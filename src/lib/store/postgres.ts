import { Pool } from "pg";
import type { DocKey, StoreDriver, Submission } from "./types";

/**
 * Postgres storage (Neon, Supabase, Render, RDS, self-hosted…).
 * Tables are created automatically on first use. Photos are stored in the
 * database too, so there is nothing else to configure.
 */

const globalForPg = globalThis as unknown as { __eccPool?: Pool; __eccSchema?: Promise<void> };

function getPool(url: string) {
  if (!globalForPg.__eccPool) {
    const local = /@(localhost|127\.0\.0\.1|db|postgres)[:/]/.test(url);
    globalForPg.__eccPool = new Pool({
      connectionString: url,
      max: 5,
      idleTimeoutMillis: 30_000,
      ssl: local || /sslmode=disable/.test(url) ? undefined : { rejectUnauthorized: false },
    });
  }
  return globalForPg.__eccPool;
}

const SCHEMA = `
create table if not exists ecc_documents (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
create table if not exists ecc_submissions (
  id text primary key,
  created_at timestamptz not null,
  data jsonb not null
);
create index if not exists ecc_submissions_created_idx on ecc_submissions (created_at desc);
create table if not exists ecc_files (
  visibility text not null,
  key text not null,
  content_type text not null,
  data bytea not null,
  created_at timestamptz not null default now(),
  primary key (visibility, key)
);
`;

export function createPostgresDriver(url: string): StoreDriver {
  const pool = getPool(url);
  const ready = () => (globalForPg.__eccSchema ??= pool.query(SCHEMA).then(() => undefined));

  return {
    kind: "postgres",

    async readDoc<T>(key: DocKey) {
      await ready();
      const r = await pool.query("select value from ecc_documents where key = $1", [key]);
      return (r.rows[0]?.value as T) ?? null;
    },
    async writeDoc(key, value) {
      await ready();
      await pool.query(
        `insert into ecc_documents (key, value, updated_at) values ($1, $2::jsonb, now())
         on conflict (key) do update set value = excluded.value, updated_at = now()`,
        [key, JSON.stringify(value)],
      );
    },

    async createSubmission(s: Submission) {
      await ready();
      await pool.query("insert into ecc_submissions (id, created_at, data) values ($1, $2, $3::jsonb)", [
        s.id,
        s.createdAt,
        JSON.stringify(s),
      ]);
    },
    async listSubmissions() {
      await ready();
      const r = await pool.query("select data from ecc_submissions order by created_at desc limit 1000");
      return r.rows.map((row) => row.data as Submission);
    },
    async getSubmission(id) {
      await ready();
      const r = await pool.query("select data from ecc_submissions where id = $1", [id]);
      return (r.rows[0]?.data as Submission) ?? null;
    },
    async updateSubmission(id, patch) {
      await ready();
      const { id: _ignored, ...rest } = patch;
      void _ignored;
      await pool.query("update ecc_submissions set data = data || $2::jsonb where id = $1", [id, JSON.stringify(rest)]);
    },
    async deleteSubmission(id) {
      await ready();
      await pool.query("delete from ecc_submissions where id = $1", [id]);
    },

    async putFile(visibility, key, file) {
      await ready();
      await pool.query(
        `insert into ecc_files (visibility, key, content_type, data) values ($1, $2, $3, $4)
         on conflict (visibility, key) do update set content_type = excluded.content_type, data = excluded.data`,
        [visibility, key, file.contentType, file.data],
      );
    },
    async getFile(visibility, key) {
      await ready();
      const r = await pool.query("select content_type, data from ecc_files where visibility = $1 and key = $2", [
        visibility,
        key,
      ]);
      const row = r.rows[0];
      return row ? { data: row.data as Buffer, contentType: row.content_type as string } : null;
    },
    async deleteFile(visibility, key) {
      await ready();
      await pool.query("delete from ecc_files where visibility = $1 and key = $2", [visibility, key]);
    },
  };
}

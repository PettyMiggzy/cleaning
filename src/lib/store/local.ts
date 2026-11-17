import { promises as fs } from "node:fs";
import path from "node:path";
import type { DocKey, StoreDriver, StoredFile, Submission, Visibility } from "./types";

const SAFE_KEY = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,180}$/;

function assertSafe(key: string) {
  if (!SAFE_KEY.test(key) || key.includes("..")) throw new Error("Invalid storage key");
}

async function readJson<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

async function writeJsonAtomic(file: string, value: unknown) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), "utf8");
  await fs.rename(tmp, file);
}

/**
 * File-system storage. Works anywhere the app has a persistent writable disk
 * (a VPS, a Docker volume, Render disk, etc.). Set DATA_DIR to choose the folder.
 */
export function createLocalDriver(root: string): StoreDriver {
  const docs = path.join(root, "docs");
  const subs = path.join(root, "submissions");
  const files = path.join(root, "files");

  return {
    kind: `local (${root})`,

    async readDoc<T>(key: DocKey) {
      return readJson<T>(path.join(docs, `${key}.json`));
    },
    async writeDoc(key, value) {
      await writeJsonAtomic(path.join(docs, `${key}.json`), value);
    },

    async createSubmission(s: Submission) {
      assertSafe(s.id);
      await writeJsonAtomic(path.join(subs, `${s.id}.json`), s);
    },
    async listSubmissions() {
      let names: string[] = [];
      try {
        names = (await fs.readdir(subs)).filter((n) => n.endsWith(".json"));
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
        throw err;
      }
      const all = await Promise.all(names.map((n) => readJson<Submission>(path.join(subs, n))));
      return all
        .filter((s): s is Submission => !!s)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async getSubmission(id) {
      if (!SAFE_KEY.test(id)) return null;
      return readJson<Submission>(path.join(subs, `${id}.json`));
    },
    async updateSubmission(id, patch) {
      assertSafe(id);
      const file = path.join(subs, `${id}.json`);
      const current = await readJson<Submission>(file);
      if (!current) return;
      await writeJsonAtomic(file, { ...current, ...patch, id: current.id });
    },
    async deleteSubmission(id) {
      assertSafe(id);
      await fs.rm(path.join(subs, `${id}.json`), { force: true });
    },

    async putFile(visibility: Visibility, key: string, file: StoredFile) {
      assertSafe(key);
      const dir = path.join(files, visibility);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.join(dir, key), file.data);
      await fs.writeFile(path.join(dir, `${key}.type`), file.contentType, "utf8");
    },
    async getFile(visibility, key) {
      if (!SAFE_KEY.test(key)) return null;
      const dir = path.join(files, visibility);
      try {
        const [data, contentType] = await Promise.all([
          fs.readFile(path.join(dir, key)),
          fs.readFile(path.join(dir, `${key}.type`), "utf8").catch(() => "application/octet-stream"),
        ]);
        return { data, contentType };
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
        throw err;
      }
    },
    async deleteFile(visibility, key) {
      if (!SAFE_KEY.test(key)) return;
      const dir = path.join(files, visibility);
      await fs.rm(path.join(dir, key), { force: true });
      await fs.rm(path.join(dir, `${key}.type`), { force: true });
    },
  };
}

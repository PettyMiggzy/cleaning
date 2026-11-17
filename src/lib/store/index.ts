import "server-only";
import path from "node:path";
import { createLocalDriver } from "./local";
import { createPostgresDriver } from "./postgres";
import type { StoreDriver } from "./types";

export * from "./types";

const globalForStore = globalThis as unknown as { __eccStore?: StoreDriver };

/**
 * DATABASE_URL set  → Postgres (recommended for production / containers)
 * otherwise         → local files in DATA_DIR (default ./data)
 */
export function store(): StoreDriver {
  if (!globalForStore.__eccStore) {
    const url = process.env.DATABASE_URL;
    globalForStore.__eccStore = url
      ? createPostgresDriver(url)
      : createLocalDriver(process.env.DATA_DIR || path.join(process.cwd(), "data"));
  }
  return globalForStore.__eccStore;
}

export function newId(prefix = "") {
  const t = Date.now().toString(36);
  const r = crypto.getRandomValues(new Uint32Array(2));
  return `${prefix}${t}${r[0].toString(36)}${r[1].toString(36)}`.slice(0, 40);
}

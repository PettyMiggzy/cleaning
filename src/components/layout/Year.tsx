import { cacheLife } from "next/cache";

/** Current year, cached (refreshes daily) so pages can still be prerendered. */
export async function Year() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

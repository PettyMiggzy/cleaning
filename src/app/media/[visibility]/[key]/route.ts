import { isAdmin } from "@/lib/auth";
import { store } from "@/lib/store";

/** Serves uploaded images. Public = gallery photos. Private = customer photos (admin only). */
export async function GET(_req: Request, ctx: RouteContext<"/media/[visibility]/[key]">) {
  const { visibility, key } = await ctx.params;
  if (visibility !== "public" && visibility !== "private") return new Response("Not found", { status: 404 });
  if (visibility === "private" && !(await isAdmin())) return new Response("Not found", { status: 404 });

  const file = await store()
    .getFile(visibility, key)
    .catch(() => null);
  if (!file || !file.contentType.startsWith("image/")) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Length": String(file.data.length),
      "Cache-Control": visibility === "public" ? "public, max-age=31536000, immutable" : "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
    },
  });
}

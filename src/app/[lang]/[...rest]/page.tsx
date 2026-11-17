import { notFound } from "next/navigation";

// Any unknown URL lands here so visitors get the branded, translated 404 page inside the site layout.
export const instant = false;

export default async function CatchAll() {
  notFound();
}

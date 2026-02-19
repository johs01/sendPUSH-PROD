import { getRemyCss } from "@/lib/remy-source";

export const revalidate = 60;

export async function GET() {
  const css = await getRemyCss();

  return new Response(css, {
    headers: {
      "Content-Type": "text/css; charset=utf-8",
      "Cache-Control": "public, max-age=60"
    }
  });
}


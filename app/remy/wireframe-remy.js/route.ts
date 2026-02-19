import { getRemyRuntimeJs } from "@/lib/remy-source";

export const revalidate = 60;

export async function GET() {
  const js = await getRemyRuntimeJs();

  return new Response(js, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=60"
    }
  });
}


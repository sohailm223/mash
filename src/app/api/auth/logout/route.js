import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  const cookie = clearSessionCookie();
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Set-Cookie": cookie, "Content-Type": "application/json" },
  });
}
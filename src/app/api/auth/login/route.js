import connectDB from "@/lib/db";
import User from "@/models/Users";
import { verifyPassword, createSessionCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    if (!email || !password) {
      return Response.json({ success: false, message: "email and password are required" }, { status: 400 });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ success: false, message: "invalid credentials" }, { status: 401 });
    }
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return Response.json({ success: false, message: "invalid credentials" }, { status: 401 });
    }
    const cookie = createSessionCookie(user);
    return new Response(JSON.stringify({ success: true, data: { name: user.name, email: user.email } }), {
      status: 200,
      headers: { "Set-Cookie": cookie, "Content-Type": "application/json" },
    });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
import connectDB from "@/lib/db";
import User from "@/models/Users";
import { hashPassword, createSessionCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return Response.json({ success: false, message: "name, email and password are required" }, { status: 400 });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json({ success: false, message: "email already registered" }, { status: 400 });
    }
    const passwordHash = await hashPassword(password);
    const user = await User.create({ name, email, passwordHash });
    const cookie = createSessionCookie(user);
    return new Response(JSON.stringify({ success: true, data: { name: user.name, email: user.email } }), {
      status: 200,
      headers: { "Set-Cookie": cookie, "Content-Type": "application/json" },
    });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
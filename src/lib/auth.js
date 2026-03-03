import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "@/models/Users";
import connectDB from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "please-set-a-secret";
const TOKEN_NAME = "mealmind_token";

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// create a JWT and return a cookie string
export function createSessionCookie(user) {
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
  // httpOnly cookie
  return `${TOKEN_NAME}=${token}; Path=/; HttpOnly; Max-Age=${7 * 24 * 60 * 60}`;
}

export function clearSessionCookie() {
  return `${TOKEN_NAME}=; Path=/; HttpOnly; Max-Age=0`;
}

export async function getUserFromCookie(req) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(new RegExp(`${TOKEN_NAME}=([^;]+)`));
    if (!match) return null;
    const token = match[1];
    const payload = jwt.verify(token, JWT_SECRET);
    await connectDB();
    const user = await User.findById(payload.id).lean();
    return user;
  } catch (err) {
    return null;
  }
}
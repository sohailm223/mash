import connectDB from "@/lib/db";
import User from "@/models/Users";
import { writeFile, mkdir } from "fs/promises";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();

    const name = formData.get("name");
    const email = formData.get("email")?.toLowerCase().trim();
    const password = formData.get("password");
    const image = formData.get("image");

    if (!name || !email || !password) {
      return Response.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let imagePath = "";

    // 🔹 Upload folder check
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 🔹 Image Upload
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = Date.now() + "-" + image.name;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      imagePath = `/uploads/${fileName}`;
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      image: imagePath,
    });

    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    return Response.json(userWithoutPassword, { status: 201 });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    if (error.code === 11000) {
      return Response.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    return Response.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const users = await User.find().select("-password");
    return Response.json(users);
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
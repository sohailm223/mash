import connectDB from "@/lib/db";
import User from "@/models/Users";
import { writeFile } from "fs/promises";
import path from "path";


export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const image = formData.get("image"); // file

    let imagePath = "";

    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = Date.now() + "-" + image.name;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);

      await writeFile(filePath, buffer);

      imagePath = `/uploads/${fileName}`;
    }
    const newUser = await User.create({
      name,
      email,
      password,
      image: imagePath,
       });
     return Response.json(newUser, { status: 201 });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}



export async function GET() {
  try {
    await connectDB();
    const foods = await User.find();
    return Response.json(User);
  } catch (error) {
    console.error("GET ERROR:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}




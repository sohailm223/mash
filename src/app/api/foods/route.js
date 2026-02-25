import connectDB from "@/lib/db";
import Food from "@/models/Food";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    console.log("Incoming body:", body); // DEBUG

    const newFood = await Food.create(body);

    return Response.json(newFood, { status: 201 });
  } catch (error) {
    console.error("POST ERROR:", error); // VERY IMPORTANT
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const foods = await Food.find();
    return Response.json(foods);
  } catch (error) {
    console.error("GET ERROR:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}
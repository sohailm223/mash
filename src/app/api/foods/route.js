import connectDB from "@/lib/db";
import Food from "@/models/Food";
 
export async function POST(req) {
  try {
    const conn = await connectDB();
    if (!conn) {
      // db not configured, can't create
      console.warn("POST /api/foods called but no database connection");
      return Response.json({ message: "Database not configured" }, { status: 503 });
    }

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
 
export async function GET(req) {
  try {
    const conn = await connectDB();
    if (!conn) {
      console.warn("GET /api/foods called but no database connection");
      // return empty array so front-end can still render gracefully
      return Response.json([]);
    }

    // build a URL object to read query/search params
    const url = new URL(req.url);
    const search = url.searchParams;

    // if random mode requested, return single random item
    if (search.has("random")) {
      const excludes = search.getAll("exclude");
      // optionally you might also filter by other keys here
      const allFoods = await Food.find();
      const pool = allFoods.filter((f) => !excludes.includes(f._id.toString()));
      if (pool.length === 0) {
        return Response.json(null); // nothing left
      }
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      return Response.json(chosen);
    }

    const filter = {};
    search.forEach((value, key) => {
      // skip special keys
      if (key === "random" || key === "exclude") return;

      // support multiple values (e.g. ?dietType=veg&dietType=vegan)
      if (filter[key]) {
        if (Array.isArray(filter[key])) {
          filter[key].push(value);
        } else {
          filter[key] = [filter[key], value];
        }
      } else {
        filter[key] = value;
      }
    });

    const foods = await Food.find(filter);
    return Response.json(foods);
  } catch (error) {
    console.error("GET ERROR:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}

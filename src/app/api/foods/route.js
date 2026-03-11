import connectDB from "@/lib/db";
import Food from "@/models/Food";
import {
  MEAL_TIMING_OPTIONS,
  DIET_TYPE_OPTIONS,
  HEALTH_GOALS_OPTIONS,
  CUISINE_OPTIONS,
  MOOD_OPTIONS,
  WEATHER_OPTIONS,
  FOOD_STYLE_OPTIONS,
} from "@/lib/constants";

// Map field names to their valid options for validation/sanitization
const FIELD_VALIDATION = {
  foodStyle: FOOD_STYLE_OPTIONS,
  mealTiming: MEAL_TIMING_OPTIONS,
  dietType: DIET_TYPE_OPTIONS,
  healthGoals: HEALTH_GOALS_OPTIONS,
  cuisine: CUISINE_OPTIONS,
  mood: MOOD_OPTIONS,
  weather: WEATHER_OPTIONS,
};

// A map to handle synonyms and expand search terms for robust filtering
const SYNONYM_MAP = {
  dietType: {
    'veg': ['veg', 'vegetarian'],
    'vegetarian': ['veg', 'vegetarian'],
    'pure-vegetarian': ['veg', 'vegetarian'],
    'non-veg': ['non-veg', 'non-vegetarian'],
    'non-vegetarian': ['non-veg', 'non-vegetarian'],
  },
  mood: {
    'happy': ['excited'],
  }
};

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    console.log("Incoming body:", body); 

    // Sanitize all array-based enum fields to ensure they are arrays of lowercase strings
    const arrayFields = ['mealTiming', 'dietType', 'healthGoals', 'cuisine', 'mood', 'weather', 'foodStyle', 'searchKeywords', 'ingredients'];
    
    arrayFields.forEach(field => {
      if (body[field]) {
        let values = [];
        if (Array.isArray(body[field])) {
          values = body[field].map(s => String(s).trim().toLowerCase());
        } else {
          values = String(body[field]).split(',').map(s => s.trim().toLowerCase());
        }
        
        // Apply specific normalizations to canonical values before saving
        if (field === 'dietType') {
          values = values.map(s => {
            if (['vegetarian', 'pure vegetarian', 'pure-vegetarian'].includes(s)) return 'veg';
            if (['non-vegetarian', 'non vegetarian'].includes(s)) return 'non-veg';
            return s;
          });
        }
        
        body[field] = values;
      }
    });

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
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = {};

    for (const [key, value] of searchParams.entries()) {
      // 1. Handle Enum Fields
      if (FIELD_VALIDATION[key]) {
        const inputValues = value.split(',').map(v => v.trim().toLowerCase().replace(/\s+/g, '-'));
        
        const searchValues = new Set();

        inputValues.forEach(val => {
          if (SYNONYM_MAP[key] && SYNONYM_MAP[key][val]) {
            SYNONYM_MAP[key][val].forEach(s => searchValues.add(s));
          } else {
            searchValues.add(val);
          }
        });
        
        if (searchValues.size > 0) {
          query[key] = { $in: Array.from(searchValues) };
        }
      }
      
      // 2. Handle Search Keywords / Ingredients (Bonus Feature)
      if (key === 'search' || key === 'ingredients') {
         const searchTerm = value.trim().toLowerCase();
         // Search in name, searchKeywords, or ingredients
        // NO FILTER
  if (searchTerm.startsWith("no ")) {

    const ingredient = searchTerm.replace("no ", "").trim();

    query.ingredients = { $nin: [ingredient] };

  } else {

    query.$or = [
      { name: { $regex: searchTerm, $options: 'i' } },
      { searchKeywords: { $regex: searchTerm, $options: 'i' } },
      { ingredients: { $regex: searchTerm, $options: 'i' } }
    ];

  }
      }
    }

    console.log("Database Query:", JSON.stringify(query, null, 2));

    const foods = await Food.find(query).lean();
    return Response.json(foods);
  } catch (error) {
    console.error("GET ERROR:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}

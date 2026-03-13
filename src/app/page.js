import Link from "next/link";
import FoodList from "@/components/FoodList";
// import Register from "@/components/Register";
import Button from "@/components/commen/Button";
import { getAutoMealTiming, getAutoWeatherCondition } from "@/lib/utils";
import FoodSpin from "@/components/FoodSpin";

async function getFoods(queryString = "") {
  // server components need an absolute URL when fetching internal APIs
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = queryString ? `${base}/api/foods?${queryString}` : `${base}/api/foods`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    console.error(`API call failed with status: ${res.status}`);
    throw new Error("Failed to fetch foods");
  }

  return res.json();
}

const user = {
    name: "prabha singh",
    email: "praha@gmail.com",
    profileComplete: true,
    questionnaire: [
      // { questionId: "mealTiming", answer: ["breakfast"] },
      // { questionId: "dietType", answer: ["veg"] },
      // { questionId: "healthGoals", answer: ["Weight Gain"] },
      // { questionId: "cuisine", answer: ["Indian"] }, 
      // { questionId: "mealTiming", answer: ["lunch"] },
      // { questionId: "mood", answer: ["Comfort"] },
      // { questionId: "mood", answer: ["excited"] },
      // {questionId: "searchKeywords", answer: ["roti"]},
      // {questionId: "foodStyle", answer: ["fast-food"]}
      //  {questionId: "searchKeywords", answer: ["no onion"]},
      // {questionId: "weather", answer: ["summer"]},
  
    ],
  };
// const user = null;

export default async function Home() {
  
  // if (!user) {
  //   return <Register />;
  // }
  const params = new URLSearchParams();

  // 1. Apply User Preferences (Manual Override / Profile)
  user.questionnaire.forEach(preference => {
    const key = preference.questionId;
    const values = preference.answer;
    
    if (values && values.length > 0) {
      params.set(key, values.join(','));
    }
  });

  // 2. System Auto Detect (Meal Timing)
  // Logic: If user has NOT selected a meal timing, use system time.
  if (!params.has("mealTiming")) {
    const autoTiming = getAutoMealTiming();
    const currentTime = new Date().toLocaleTimeString();
    console.log(`System Auto-Detect: ${autoTiming} (Current Time: ${currentTime})`);
    params.set("mealTiming", autoTiming);
  }

  // 3. System Auto Detect (Weather)
  // Logic: If user has NOT selected a weather condition, use a default.
  if (!params.has("weather")) {
    const autoWeather = getAutoWeatherCondition();
    console.log(`System Auto-Detect: ${autoWeather} (Weather)`);
    params.set("weather", autoWeather);
  }

  const queryString = params.toString();
  const isFiltered = queryString.length > 0;
  
  console.log("Constructed query string:", queryString);

  // Fetch foods with the applied filters
  const foods = await getFoods(queryString);

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">MealMind 🍽️</h1>
        <Link href="/add-food">
          <Button className="bg-green-600">Add New Food</Button>
        </Link>
      </div>
      {foods && foods.length > 0 ? (
        // <FoodList initialFoods={foods} isFiltered={isFiltered} />
         <FoodSpin initialFoods={foods} isFiltered={isFiltered} />
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No food items found. Try changing your filters!</p>
        </div>
      )}
    </div>
  );
}
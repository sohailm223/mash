import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import FoodList from "@/components/FoodList";
import Button from "@/components/commen/Button";
import { getAutoMealTiming, getAutoWeatherCondition } from "@/lib/utils";
import FoodSpin from "@/components/FoodSpin";
import LogoutButton from "@/components/LogoutButton";

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

// const user = {
//     name: "prabha singh",
//     email: "praha@gmail.com",
//     profileComplete: true,
//     questionnaire: [
//       // { questionId: "mealTiming", answer: ["breakfast"] },
//       // { questionId: "dietType", answer: ["veg"] },
//       // { questionId: "healthGoals", answer: ["Weight Gain"] },
//       // { questionId: "cuisine", answer: ["Indian"] }, 
//       // { questionId: "mealTiming", answer: ["lunch"] },
//       // { questionId: "mood", answer: ["Comfort"] },
//       // { questionId: "mood", answer: ["excited"] },
//       // {questionId: "searchKeywords", answer: ["roti"]},
//       // {questionId: "foodStyle", answer: ["fast-food"]}
//       //  {questionId: "searchKeywords", answer: ["no onion"]},
//       // {questionId: "weather", answer: ["summer"]},
  
//     ],
//   };
// const user = null;

export default async function Home() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  let user = null;

  try {
    user = userCookie ? JSON.parse(userCookie.value) : null;
  } catch (e) {
    console.error("Failed to parse user cookie:", e);
  }
  

  if (!user) {
    // If no user, redirect to the login page.
    redirect('/register');
  }
  
  if (!user.profileComplete) {
    // If user is logged in but profile is incomplete, force them to the preferences page.
    redirect('/preferences');
  }
  
  const params = new URLSearchParams();

  // 1. Apply User Preferences (Manual Override / Profile)
  const FIELD_MAP = {
    healthSuggestions: "healthGoals",
    allergies: "restrictedIngredients",
    weightGoal: "healthGoals", 
  };

  if (user.questionnaire) {
    user.questionnaire.forEach((pref) => {
      const apiField = FIELD_MAP[pref.questionId] || pref.questionId;
      const values = pref.answer;

      if (!values || values.length === 0 || values[0] === "") {
        return;
      }

      // Logic to ignore negative/default answers
      if (
        (apiField === "restrictedIngredients" && (values[0].toLowerCase() === "no allergies" || values[0].toLowerCase() === "no")) ||
        (apiField === "healthGoals" && pref.questionId === "healthSuggestions" && values[0].toLowerCase() === "no")
      ) {
        // Do nothing, skip this filter
      } else {
        // Append values to the same parameter if it already exists (e.g., for healthGoals)
        params.append(apiField, values.join(","));
      }
    });
  }

  // 2. System Auto Detect (Meal Timing)
  if (!params.has("mealTiming")) {
    const autoTiming = getAutoMealTiming();
    const currentTime = new Date().toLocaleTimeString();
    console.log(`System Auto-Detect: ${autoTiming} (Current Time: ${currentTime})`);
    params.set("mealTiming", autoTiming);
  }

  // 3. System Auto Detect (Weather)
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

  const mealTimingForComponent = params.get("mealTiming").split(',')[0]  || "Lunch"; 

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">MealMind 🍽️</h1>
        <LogoutButton />
        <Link href="/add-food">
          <Button className="bg-green-600">Add New Food</Button>
        </Link>
      </div>
      {foods && foods.length > 0 ? (
        // <FoodList initialFoods={foods} isFiltered={isFiltered} />
         <FoodSpin initialFoods={foods} isFiltered={isFiltered} mealTiming={mealTimingForComponent} />
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No food items found. Try changing your filters!</p>
        </div>
      )}
    </div>
  );
}
import Link from "next/link";
import FoodList from "@/components/FoodList";
import Button from "@/components/ui/Button";

async function getFoods(queryString = "") {
  // server components need an absolute URL when fetching internal APIs
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = queryString ? `${base}/api/foods?${queryString}` : `${base}/api/foods`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch foods");
  }

  return res.json();
}

const user = {
    name: "prabha singh",
    email: "praha@gmail.com",
    profileComplete: true,
    questionnaire: [
      { questionId: "dietType", answer: ["veg"] },
      // { questionId: "healthGoals", answer: ["Weight Gain"] },
      // { questionId: "cuisine", answer: ["Indian"] }, 
      // { questionId: "mealTiming", answer: ["lunch"] },
      // { questionId: "mood", answer: ["Comfort"] },
      // { questionId: "mood", answer: ["excited"] },
  
    ],
  };

export default async function Home() {
  // Process user preferences to build query string for the API
  const params = new URLSearchParams();

  user.questionnaire.forEach(preference => {
    const key = preference.questionId;
    const values = preference.answer;
    
    if (values.length > 0) {
      params.set(key, values.join(','));
    }
  });

   console.log("Constructed query string:", params.toString());
  console.log("User preferences:", user.questionnaire);
  
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
       <FoodList initialFoods={foods} isFiltered={isFiltered} />
    </div>
  );
}
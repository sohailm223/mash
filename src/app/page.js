"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FoodAdd from "@/components/FoodAdd";
import RandomPicker from "@/components/RandomPicker";
import FoodDetails from "@/components/FoodDetails";
import { getFoods } from "../components/api";
import FoodRow from "@/components/FoodRow";

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [randomTrigger, setRandomTrigger] = useState(0); // used to refresh random when needed
  const [likedCount, setLikedCount] = useState(0);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const user = {
    name: "prabha singh",
    email: "praha@gmail.com",
    profileComplete: true,
    questionnaire: [
      { questionId: "dietType", answer: ["vegetarian"] },
      { questionId: "healthGoals", answer: ["Weight Loss"] },
      { questionId: "cuisine", answer: ["Indian"] },
      { questionId: "mealTiming", answer: ["lunch"] },
      { questionId: "mood", answer: ["Happy"] },
  
    ],
  };

    //const user ={
  //   name: "John Doe",
  //   email: "  test@gmai.com",
  //   profileComplete: false,
  //   questionnaire: [
  //     { questionId: "dietType", answer: ["vegetarian"] },
  //     { questionId: "healthGoals", answer: ["weightLoss"] },
  //     { questionId: "cuisine", answer: ["italian"] },
  //     { questionId: "mealTiming", answer: ["lunch"] },
  //     { questionId: "mood", answer: ["energetic"] },
  // }

  // fetch all foods and then optionally filter based on saved profile
  useEffect(() => {
    async function loadFoods() {
      setLoading(true);
      try {
        // build query string from the hard‑coded user object
        const params = new URLSearchParams();
        user.questionnaire.forEach((q) => {
          const vals = Array.isArray(q.answer) ? q.answer : [q.answer];
          vals.forEach((v) => params.append(q.questionId, v));
        });

        const query = params.toString();
        console.log("fetching with query", query);
        const foods = await getFoods(query);
        console.log("fetched foods", foods);
        setFoods(Array.isArray(foods) ? foods : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setFoods([]);
      } finally {
        setLoading(false);
      }
    }

    loadFoods();
  }, []);

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">MealMind 🍽️</h1>
        <FoodAdd />
      </div>

      <div className="mt-8 flex flex-col lg:flex-row gap-10">
        {/* LEFT SIDE - Food List */}
        <div className="lg:w-3/5">
          {loading ? (
            <p>Loading...</p>
          ) : foods.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              {foods.map((food) => (
                <FoodRow
                  key={food._id}
                  food={food}
                  onClick={() => setSelectedFood(food)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No food items found.
            </p>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:w-2/5">
          <h2 className="text-xl font-semibold mb-4">
            {selectedFood ? "Selected Food" : "Random Suggestion"}
          </h2>

          {selectedFood ? (
            <FoodDetails
              food={selectedFood}
              onYes={() => {
                setLikedCount((c) => c + 1);
                setSelectedFood(null);
                setRandomTrigger((t) => t + 1);
              }}
              onNo={() => {
                setSelectedFood(null);
                setRandomTrigger((t) => t + 1);
              }}
            />
          ) : (
            <RandomPicker
              key={randomTrigger}
              onLike={() => setLikedCount((c) => c + 1)}
              onDislike={() => setRandomTrigger((t) => t + 1)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
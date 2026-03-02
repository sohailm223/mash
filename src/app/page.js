"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import FoodAdd from "@/components/FoodAdd";
import FoodFilter from "@/components/filters/FoodFilter";
import RandomPicker from "@/components/RandomPicker";
import FoodDetails from "@/components/FoodDetails";
import { getFoods, getProfile } from "../components/api";
import FoodCard from "@/components/cards/FoodCard";
import FoodRow from "@/components/FoodRow";
import { Heart } from "lucide-react";

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [randomTrigger, setRandomTrigger] = useState(0); // used to refresh random when needed
  const [likedCount, setLikedCount] = useState(0);
  const router = useRouter();

  // Initialize cuisine as a string "" because it's a text input in FoodFilter
  const [filters, setFilters] = useState({
    dietType: [],
    healthGoals: [],
    cuisine: "", 
    mealTiming: [],
    mood: [],
    cookTime: [],
    ingredients: [],
    restrictedIngredients: [],
    cookingMode: "",
  });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isInitial, setIsInitial] = useState(true);

  // fetch profile data on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await getProfile();
        if (res.success && res.data) {
          setLikedCount((res.data.likedFoods || []).length);
        }
      } catch (e) {
        console.error("failed to load profile", e);
      }
    }
    loadProfile();
  }, []);

  const handleFilterChange = (newFilters) => {
    setIsInitial(false);
    setFilters(newFilters);
  };

  // Use useCallback to define the function correctly
  const fetchFoods = useCallback(async () => {
    if (isInitial) {
      setFoods([]);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams();
      for (const key in filters) {
        const value = filters[key];
        if (Array.isArray(value)) {
          if (value.length > 0) {
            value.forEach((v) => params.append(key, v));
          }
        } else if (value) {
          params.append(key, value);
        }
      }
      
      // Even if params is empty, we fetch to show "All Products"
      const data = await getFoods(params.toString());
      setFoods(data || []);
    } catch (error) {
      console.error("Failed to fetch foods:", error);
      setFoods([]);
    }
    setLoading(false);
  }, [filters, isInitial]);

  // Debounce effect to trigger fetch when filters change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchFoods();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [fetchFoods]);

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">MealMind 🍽️</h1>
          <button
            onClick={() => router.push("/saved")}
            className="relative p-1 hover:text-red-600"
          >
            <Heart className="w-6 h-6" />
            {likedCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {likedCount}
              </span>
            )}
          </button>
        </div>
        <FoodAdd />
      </div>

      {/* filter bar spans full width */}
      <FoodFilter filters={filters} setFilters={handleFilterChange} foods={foods} />

      {/* results and random picker side-by-side */}
      <div className="mt-8 flex flex-col lg:flex-row gap-10">
        {/* left column: food list */}
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
              {isInitial
                ? "Select filters or click 'All Products' to see food recommendations 🥗"
                : hasSearched
                ? "No food items found matching your criteria."
                : "Loading products..."}
            </p>
          )}
        </div>

        {/* right column: either selected item or random suggestion */}
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
              onLike={() => setLikedCount((c) => c + 1)}
              onDislike={() => setRandomTrigger((t) => t + 1)}
              key={randomTrigger}
            />
          )}
        </div>
      </div>
    </div>
  );
}

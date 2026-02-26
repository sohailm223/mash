"use client";

import { useState, useEffect, useCallback } from "react";
import FoodAdd from "@/components/FoodAdd";
import FoodFilter from "@/components/FoodFilter";
import { getFoods } from "../components/api"
import FoodCard from "@/components/FoodCard";

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    dietType: [],
    healthGoals: [],
    cuisine: "",
    mealTiming: [],
    mood: [],
    cookTime: [],
  });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchFoods = useCallback(async () => {
    // Check if any filter is active
    const hasActiveFilters = Object.keys(filters).some((key) => {
      const value = filters[key];
      return Array.isArray(value) ? value.length > 0 : !!value;
    });

    if (!hasActiveFilters) {
      setFoods([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams();
      for (const key in filters) {
        const value = filters[key];
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else if (value) {
          params.append(key, value);
        }
      }
      const data = await getFoods(params.toString());
      setFoods(data || []);
    } catch (error) {
      console.error("Failed to fetch foods:", error);
      setFoods([]);
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">MealMind 🍽️</h1>
        <FoodAdd onSuccess={fetchFoods} />
      </div>

      <FoodFilter filters={filters} setFilters={setFilters} />

      {loading ? (
        <p>Loading...</p>
      ) : foods.length > 0 ? (
        foods.map((food) => <FoodCard key={food._id} food={food} />)
      ) : (
        <p className="text-center text-gray-500 mt-10">
          {hasSearched ? "No food items found matching your criteria." : "Select filters to see food recommendations 🥗"}
        </p>
      )}
    </div>
  );
}
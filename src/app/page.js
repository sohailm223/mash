"use client";

import { useState, useEffect, useCallback } from "react";
import FoodAdd from "@/components/FoodAdd";
import FoodFilter from "@/components/filters/FoodFilter";
import { getFoods } from "../components/api";
import FoodCard from "@/components/cards/FoodCard";

export default function Home() {
  const [foods, setFoods] = useState([]);
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

  const handleFoodAddSuccess = () => {
    setIsInitial(false);
    fetchFoods();
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">MealMind 🍽️</h1>
        <FoodAdd onSuccess={handleFoodAddSuccess} />
      </div>

      {/* Pass 'foods' here so the filter component can show counts */}
      <FoodFilter filters={filters} setFilters={handleFilterChange} foods={foods} />

      {loading ? (
        <p>Loading...</p>
      ) : foods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food) => (
            <FoodCard key={food._id} food={food} />
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
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  Leaf,
  HeartPulse,
  Clock,
  Smile,
  Timer,
  UtensilsCrossed,
} from "lucide-react";

import FilterDropdown from "./FilterDropdown";

export default function FoodFilter({ filters, setFilters, foods = [] }) {
  const dietTypes = ["Vegetarian", "Non-Vegetarian", "Vegan", "Gluten-Free"];
  const healthGoals = [
    "Weight Loss",
    "Weight Gain",
    "Muscle Building",
    "General Fitness",
  ];
  const mealTimings = ["Breakfast", "Lunch", "Snacks", "Dinner"];
  const moods = ["Happy", "Sad", "Stressed", "Celebratory", "Comfort"];
  const cookTimeOptions = ["0-15 min", "15-30 min", "30-60 min", "60+ min"];

  // derive ingredient lists from supplied foods
  const ingredientOptions = Array.from(
    new Set(foods.flatMap((f) => f.ingredients || []))
  ).sort();
  const restrictedOptions = Array.from(
    new Set(foods.flatMap((f) => f.restrictedIngredients || []))
  ).sort();
  const cookingModes = ["cook-yourself", "order-online"];

  const [ingredientMode, setIngredientMode] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleModeChange = (e) => {
    const mode = e.target.value;
    setIngredientMode(mode);
    setFilters((prev) => {
      const next = { ...prev };
      if (mode === "include") {
        next.restrictedIngredients = [];
      } else if (mode === "exclude") {
        next.ingredients = [];
      }
      return next;
    });
  };

  // keep mode in sync if filters are changed externally
  useEffect(() => {
    if (filters.ingredients && filters.ingredients.length > 0) {
      setIngredientMode("include");
    } else if (filters.restrictedIngredients && filters.restrictedIngredients.length > 0) {
      setIngredientMode("exclude");
    } else {
      setIngredientMode("");
    }
  }, [filters.ingredients, filters.restrictedIngredients]);

  const clearFilters = () => {
    setFilters({
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
    setIngredientMode("");
  };

  const getCount = (key, option) => {
    if (!foods) return 0;
    return foods.filter((food) => {
      if (key === "cookTime") {
        const time = food.cookTime || 0;
        if (option === "0-15 min") return time >= 0 && time <= 15;
        if (option === "15-30 min") return time > 15 && time <= 30;
        if (option === "30-60 min") return time > 30 && time <= 60;
        if (option === "60+ min") return time > 60;
        return false;
      }
      if (key === "ingredients" || key === "restrictedIngredients") {
        const arr = food[key] || [];
        return arr.includes(option);
      }
      if (key === "cookingMode") {
        return food.cookingMode === option;
      }
      const val = food[key];
      if (Array.isArray(val)) return val.includes(option);
      return val === option;
    }).length;
  };

  const isFilterActive =
    filters?.cuisine ||
    filters?.dietType?.length > 0 ||
    filters?.healthGoals?.length > 0 ||
    filters?.mealTiming?.length > 0 ||
    filters?.mood?.length > 0 ||
    filters?.cookTime?.length > 0 ||
    filters?.ingredients?.length > 0 ||
    filters?.restrictedIngredients?.length > 0 ||
    !!filters?.cookingMode;

  return (
    <div className="p-4 mb-6 border rounded-lg bg-gray-50 overflow-visible">
      <div className="flex items-center gap-4 flex-nowrap overflow-x-auto ">
        {/* Cuisine Search */}
        <div className="relative min-w-[150px]">
          <UtensilsCrossed className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            name="cuisine"
            id="cuisine"
            value={filters?.cuisine || ""}
            onChange={handleInputChange}
            placeholder="Cuisine (e.g. Indian)"
            className="pl-10 pr-4 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* All Products Button */}
        <button
          onClick={clearFilters}
          className={`whitespace-nowrap inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            !isFilterActive
              ? "bg-indigo-600 text-white border-transparent hover:bg-indigo-700"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          All Products
        </button>

        <FilterDropdown
          title="Diet"
          icon={Leaf}
          options={dietTypes}
          selectedValue={filters?.dietType}
          onValueChange={handleInputChange}
          filterKey="dietType"
          getOptionCount={(opt) => getCount("dietType", opt)}
        />
        <FilterDropdown
          title="Health Goal"
          icon={HeartPulse}
          options={healthGoals}
          selectedValue={filters?.healthGoals}
          onValueChange={handleInputChange}
          filterKey="healthGoals"
          getOptionCount={(opt) => getCount("healthGoals", opt)}
        />
        <FilterDropdown
          title="Meal"
          icon={Clock}
          options={mealTimings}
          selectedValue={filters?.mealTiming}
          onValueChange={handleInputChange}
          filterKey="mealTiming"
          getOptionCount={(opt) => getCount("mealTiming", opt)}
        />
        <FilterDropdown
          title="Mood"
          icon={Smile}
          options={moods}
          selectedValue={filters?.mood}
          onValueChange={handleInputChange}
          filterKey="mood"
          getOptionCount={(opt) => getCount("mood", opt)}
        />
        <FilterDropdown
          title="Cook Time"
          icon={Timer}
          options={cookTimeOptions}
          selectedValue={filters?.cookTime}
          onValueChange={handleInputChange}
          filterKey="cookTime"
          getOptionCount={(opt) => getCount("cookTime", opt)}
        />

        {(ingredientOptions.length > 0 || restrictedOptions.length > 0) && (
          <div className="flex items-center gap-2">
            <select
              value={ingredientMode}
              onChange={handleModeChange}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="">Ingredient filter</option>
              {ingredientOptions.length > 0 && <option value="include">Has ingredient</option>}
              {restrictedOptions.length > 0 && <option value="exclude">Exclude ingredient</option>}
            </select>
            {ingredientMode === "include" && ingredientOptions.length > 0 && (
              <FilterDropdown
                title="Ingredients"
                icon={Leaf}
                options={ingredientOptions}
                selectedValue={filters?.ingredients}
                onValueChange={handleInputChange}
                filterKey="ingredients"
                getOptionCount={(opt) => getCount("ingredients", opt)}
              />
            )}
            {ingredientMode === "exclude" && restrictedOptions.length > 0 && (
              <FilterDropdown
                title="Exclude Ingredients"
                icon={HeartPulse}
                options={restrictedOptions}
                selectedValue={filters?.restrictedIngredients}
                onValueChange={handleInputChange}
                filterKey="restrictedIngredients"
                getOptionCount={(opt) => getCount("restrictedIngredients", opt)}
              />
            )}
          </div>
        )}


        <FilterDropdown
          title="Cooking Mode"
          icon={UtensilsCrossed}
          options={cookingModes}
          selectedValue={filters?.cookingMode ? [filters.cookingMode] : []}
          onValueChange={(e) => {
            // keep only the last clicked value, clear when empty
            if (Array.isArray(e.target.value)) {
              const arr = e.target.value;
              const newVal = arr.length ? arr[arr.length - 1] : "";
              setFilters((prev) => ({ ...prev, cookingMode: newVal }));
            } else {
              setFilters((prev) => ({ ...prev, cookingMode: e.target.value }));
            }
          }}
          filterKey="cookingMode"
          getOptionCount={(opt) => getCount("cookingMode", opt)}
        />

        {isFilterActive && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-indigo-600 px-2 py-1 whitespace-nowrap"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}

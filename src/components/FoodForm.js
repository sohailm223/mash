"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addFood } from "./api";

export default function FoodForm({ onFormSubmitSuccess }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    mealTiming: [],
    dietType: [],
    healthGoals: [],
    foodStyle: "",
    cuisine: "", // Will be string, converted to array on submit
    cookTime: 0,
    mood: [],
    ingredients: "", // Will be string, converted to array on submit
    restrictedIngredients: "", // Will be string, converted to array on submit
    cookingMode: "cook-yourself",
    recipe: {
      ingredients: "", // Will be string, converted to array on submit
      steps: "", // Will be string, converted to array on submit
    },
    nutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
    orderInfo: {
      swiggyLink: "",
      zomatoLink: "",
      deliveryTime: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "number" ? Number(value) : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => {
      const currentValues = prev[name] || [];
      if (checked) {
        return { ...prev, [name]: [...currentValues, value] };
      } else {
        return {
          ...prev,
          [name]: currentValues.filter((item) => item !== value),
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Helper to split string to array, trimming whitespace
    const toArray = (str) =>
      str.split(",").map((item) => item.trim()).filter(Boolean);

    const payload = {
      ...formData,
      cuisine: toArray(formData.cuisine),
      ingredients: toArray(formData.ingredients),
      restrictedIngredients: toArray(formData.restrictedIngredients),
      mood: formData.mood,
      mealTiming: formData.mealTiming,
      dietType: formData.dietType,
      healthGoals: formData.healthGoals,
      recipe: {
        ...formData.recipe,
        ingredients: toArray(formData.recipe.ingredients),
        steps: toArray(formData.recipe.steps),
      },
    };

    try {
      await addFood(payload);
      alert("Food item added successfully!");
      if (onFormSubmitSuccess) {
        onFormSubmitSuccess();
      }
    } catch (err) {
      setError(err.message);
      console.error("Submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const mealTimings = ["Breakfast", "Lunch", "Snacks", "Dinner"];
  const dietTypes = ["Vegetarian", "Non-Vegetarian", "Vegan", "Gluten-Free"];
  const healthGoals = ["Weight Loss", "Weight Gain", "Muscle Building", "General Fitness"];
  const moods = ["Happy", "Sad", "Stressed", "Celebratory", "Comfort"];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
            <input type="file" accept="image/*" id="image" onChange={handleImageChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            {formData.image && (
              <img src={formData.image} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-md" />
            )}
          </div>
          <div>
            <label htmlFor="foodStyle" className="block text-sm font-medium text-gray-700">Food Style</label>
            <input type="text" name="foodStyle" id="foodStyle" value={formData.foodStyle} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700">Cuisine (comma-separated)</label>
            <input type="text" name="cuisine" id="cuisine" value={formData.cuisine} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
      </div>

      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Categorization</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Meal Timing</label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
              {mealTimings.map((timing) => (
                <div key={timing} className="flex items-center">
                  <input
                    id={`meal-${timing}`}
                    name="mealTiming"
                    type="checkbox"
                    value={timing}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor={`meal-${timing}`} className="ml-2 block text-sm text-gray-900">
                    {timing}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Diet Type</label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
              {dietTypes.map((diet) => (
                <div key={diet} className="flex items-center">
                  <input
                    id={`diet-${diet}`}
                    name="dietType"
                    type="checkbox"
                    value={diet}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor={`diet-${diet}`} className="ml-2 block text-sm text-gray-900">
                    {diet}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Health Goals</label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
              {healthGoals.map((goal) => (
                <div key={goal} className="flex items-center">
                  <input
                    id={`goal-${goal}`}
                    name="healthGoals"
                    type="checkbox"
                    value={goal}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor={`goal-${goal}`} className="ml-2 block text-sm text-gray-900">
                    {goal}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mood</label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
              {moods.map((mood) => (
                <div key={mood} className="flex items-center">
                  <input
                    id={`mood-${mood}`}
                    name="mood"
                    type="checkbox"
                    value={mood}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor={`mood-${mood}`} className="ml-2 block text-sm text-gray-900">
                    {mood}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700">Cook Time (min)</label>
            <input type="number" name="cookTime" id="cookTime" value={formData.cookTime} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">Main Ingredients (comma-separated)</label>
            <textarea name="ingredients" id="ingredients" rows="3" value={formData.ingredients} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="restrictedIngredients" className="block text-sm font-medium text-gray-700">Restricted Ingredients (comma-separated)</label>
            <textarea name="restrictedIngredients" id="restrictedIngredients" rows="3" value={formData.restrictedIngredients} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
          </div>
        </div>
      </div>

      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Nutrition</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="nutrition.calories" className="block text-sm font-medium text-gray-700">Calories</label>
            <input type="number" name="nutrition.calories" id="nutrition.calories" value={formData.nutrition.calories} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="nutrition.protein" className="block text-sm font-medium text-gray-700">Protein (g)</label>
            <input type="number" name="nutrition.protein" id="nutrition.protein" value={formData.nutrition.protein} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="nutrition.carbs" className="block text-sm font-medium text-gray-700">Carbs (g)</label>
            <input type="number" name="nutrition.carbs" id="nutrition.carbs" value={formData.nutrition.carbs} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="nutrition.fat" className="block text-sm font-medium text-gray-700">Fat (g)</label>
            <input type="number" name="nutrition.fat" id="nutrition.fat" value={formData.nutrition.fat} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
      </div>

      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Cooking Mode</h2>
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <input id="cook-yourself" name="cookingMode" type="radio" value="cook-yourself" checked={formData.cookingMode === 'cook-yourself'} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
            <label htmlFor="cook-yourself" className="ml-2 block text-sm font-medium text-gray-700">Cook Yourself</label>
          </div>
          <div className="flex items-center">
            <input id="order-online" name="cookingMode" type="radio" value="order-online" checked={formData.cookingMode === 'order-online'} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
            <label htmlFor="order-online" className="ml-2 block text-sm font-medium text-gray-700">Order Online</label>
          </div>
        </div>

        {formData.cookingMode === 'cook-yourself' && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Recipe Details 👨‍🍳</h3>
            <div>
              <label htmlFor="recipe.ingredients" className="block text-sm font-medium text-gray-700">Recipe Ingredients (comma-separated)</label>
              <textarea name="recipe.ingredients" id="recipe.ingredients" rows="3" value={formData.recipe.ingredients} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
            </div>
            <div>
              <label htmlFor="recipe.steps" className="block text-sm font-medium text-gray-700">Recipe Steps (comma-separated)</label>
              <textarea name="recipe.steps" id="recipe.steps" rows="5" value={formData.recipe.steps} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
            </div>
          </div>
        )}

        {formData.cookingMode === "order-online" && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Order Details 🛵</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="orderInfo.deliveryTime" className="block text-sm font-medium text-gray-700">Delivery Time (min)</label>
                <input type="number" name="orderInfo.deliveryTime" id="orderInfo.deliveryTime" value={formData.orderInfo.deliveryTime} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="orderInfo.swiggyLink" className="block text-sm font-medium text-gray-700">Swiggy Link</label>
                <input type="text" name="orderInfo.swiggyLink" id="orderInfo.swiggyLink" value={formData.orderInfo.swiggyLink} onChange={handleChange} placeholder="https://swiggy.com/..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="orderInfo.zomatoLink" className="block text-sm font-medium text-gray-700">Zomato Link</label>
                <input type="text" name="orderInfo.zomatoLink" id="orderInfo.zomatoLink" value={formData.orderInfo.zomatoLink} onChange={handleChange} placeholder="https://zomato.com/..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end items-center">
        {error && <p className="text-red-500 text-sm mr-4">{error}</p>}
        <button type="submit" disabled={isLoading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
          {isLoading ? "Adding..." : "Add Food"}
        </button>
      </div>
    </form>
  );
}
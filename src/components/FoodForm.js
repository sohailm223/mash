"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Save, X, ChefHat, Clock, Activity, Utensils, Flame, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input, TextArea } from "@/components/common/Input";
import { CheckboxGroup } from "@/components/common/CheckboxGroup";
import { addFood } from "./api";

const MEAL_TIMINGS = ["Breakfast", "Lunch", "Snacks", "Dinner"];
const DIET_TYPES = ["Vegetarian", "Non-Vegetarian", "Vegan", "Gluten-Free"];
const HEALTH_GOALS = ["Weight Loss", "Weight Gain", "Muscle Building", "General Fitness"];
const MOODS = ["Happy", "Sad", "Stressed", "Celebratory", "Comfort"];

export default function FoodForm({ onFormSubmitSuccess }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showPrepDetails, setShowPrepDetails] = useState(false);
  const [showRecipeDetails, setShowRecipeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    price: "",
    cuisine: "",
    mealTiming: [],
    dietType: [],
    healthGoals: [],
    mood: [],
    cookTime: "",
    ingredients: "",
    restrictedIngredients: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    cookingMode: "Cook Yourself",
    recipeIngredients: "",
    recipeSteps: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (key, newValue) => {
    setFormData((prev) => ({ ...prev, [key]: newValue }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Convert Image to Base64 (string) if it exists
      let imageBase64 = null;
      if (formData.image instanceof File) {
        imageBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(formData.image);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      }

      // 2. Prepare Payload for API
      const payload = {
        name: formData.name,
        image: imageBase64, // Send base64 string
        price: Number(formData.price) || 0,
        cuisine: formData.cuisine.split(",").map((s) => s.trim()).filter(Boolean),
        mealTiming: formData.mealTiming,
        dietType: formData.dietType,
        healthGoals: formData.healthGoals,
        mood: formData.mood,
        cookTime: Number(formData.cookTime) || 0,
        ingredients: formData.ingredients.split(",").map((s) => s.trim()).filter(Boolean),
        restrictedIngredients: formData.restrictedIngredients.split(",").map((s) => s.trim()).filter(Boolean),
        cookingMode: formData.cookingMode,
        nutrition: {
          calories: Number(formData.calories) || 0,
          protein: Number(formData.protein) || 0,
          carbs: Number(formData.carbs) || 0,
          fat: Number(formData.fat) || 0,
        },
        recipe: {
          ingredients: formData.recipeIngredients.split("\n").filter(Boolean),
          steps: formData.recipeSteps.split("\n").filter(Boolean),
        },
      };

      await addFood(payload);

      if (onFormSubmitSuccess) {
        onFormSubmitSuccess();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to save food. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card className="border-t-4 border-t-indigo-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Utensils className="w-6 h-6 text-indigo-600" /> Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Input 
                label="Food Name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="e.g. Grilled Chicken Salad" 
                required 
                className="text-lg"
              />
              <Input 
                label="Cuisine" 
                name="cuisine" 
                value={formData.cuisine} 
                onChange={handleChange} 
                placeholder="e.g. Italian, Mexican (comma separated)" 
              />
              <Input 
                label="Price (₹)" 
                name="price" 
                type="number"
                value={formData.price} 
                onChange={handleChange} 
                placeholder="e.g. 250" 
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Cooking Mode</label>
                <div className="grid grid-cols-2 gap-4">
                  {["Cook Yourself", "Order Online"].map((mode) => (
                    <label 
                      key={mode} 
                      className={`
                        relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all
                        ${formData.cookingMode === mode 
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700" 
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600"}
                      `}
                    >
                      <input 
                        type="radio" 
                        name="cookingMode" 
                        value={mode} 
                        checked={formData.cookingMode === mode} 
                        onChange={handleChange}
                        className="sr-only"
                      />
                      {mode === "Cook Yourself" ? <ChefHat className="w-6 h-6 mb-2" /> : <Utensils className="w-6 h-6 mb-2" />}
                      <span className="font-medium text-sm">{mode}</span>
                      {formData.cookingMode === mode && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full"></div>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Food Image</label>
              <div className={`
                relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-colors overflow-hidden
                ${previewUrl ? "border-indigo-300 bg-gray-50" : "border-gray-300 hover:bg-gray-50"}
              `}>
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-600 shadow-sm transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                      <div className="p-4 bg-indigo-50 rounded-full mb-3">
                        <Upload className="w-8 h-8 text-indigo-500" />
                      </div>
                      <p className="mb-1 text-sm font-medium text-gray-900">Click to upload image</p>
                      <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 2MB)</p>
                    </div>
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                  </label>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categorization */}
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Activity className="w-6 h-6 text-indigo-600" /> Categorization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: "mealTiming", label: "Meal Timing", options: MEAL_TIMINGS },
              { id: "dietType", label: "Diet Type", options: DIET_TYPES },
              { id: "healthGoals", label: "Health Goals", options: HEALTH_GOALS },
              { id: "mood", label: "Mood", options: MOODS },
            ].map((cat) => (
              <div key={cat.id} className="relative">
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl transition-all ${
                    activeCategory === cat.id
                      ? "ring-2 ring-indigo-500 border-transparent bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-gray-700 text-sm">{cat.label}</span>
                    {formData[cat.id].length > 0 && (
                      <span className="text-xs text-indigo-600 font-medium">
                        {formData[cat.id].length} selected
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      activeCategory === cat.id ? "rotate-180 text-indigo-600" : ""
                    }`}
                  />
                </button>
                {activeCategory === cat.id && (
                  <div className="absolute left-0 right-0 z-20 mt-2 p-4 bg-white border border-gray-200 rounded-xl shadow-xl min-w-[280px]">
                    <CheckboxGroup
                      options={cat.options}
                      value={formData[cat.id]}
                      onChange={(val) => handleCheckboxChange(cat.id, val)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optional Preparation Details */}
      <Card>
        <button
          type="button"
          onClick={() => setShowPrepDetails(!showPrepDetails)}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
        >
          <CardTitle className="flex items-center gap-2 text-xl">
            <Clock className="w-6 h-6 text-indigo-600" /> Preparation & Nutrition (Optional)
          </CardTitle>
          {showPrepDetails ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
        </button>
        
        {showPrepDetails && (
          <CardContent className="border-t border-gray-100 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-5">
                <h4 className="font-medium text-gray-900">Preparation</h4>
                <Input label="Cook Time (min)" type="number" name="cookTime" value={formData.cookTime} onChange={handleChange} placeholder="e.g. 30" min="0" />
                <TextArea label="Main Ingredients" name="ingredients" value={formData.ingredients} onChange={handleChange} placeholder="e.g. Chicken, Lettuce, Tomatoes (comma separated)" rows={3} />
                <TextArea label="Restricted Ingredients" name="restrictedIngredients" value={formData.restrictedIngredients} onChange={handleChange} placeholder="e.g. Peanuts, Gluten (comma separated)" rows={3} />
              </div>

              <div className="space-y-6">
                <h4 className="font-medium text-gray-900 flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500" /> Nutrition Facts</h4>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <Input label="Calories (kcal)" type="number" name="calories" value={formData.calories} onChange={handleChange} className="bg-white" placeholder="0" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Input label="Protein (g)" type="number" name="protein" value={formData.protein} onChange={handleChange} placeholder="0" />
                  <Input label="Carbs (g)" type="number" name="carbs" value={formData.carbs} onChange={handleChange} placeholder="0" />
                  <Input label="Fat (g)" type="number" name="fat" value={formData.fat} onChange={handleChange} placeholder="0" />
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Recipe Details */}
      <Card>
        <button
          type="button"
          onClick={() => setShowRecipeDetails(!showRecipeDetails)}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
        >
          <CardTitle className="flex items-center gap-2 text-xl">
            <ChefHat className="w-6 h-6 text-indigo-600" /> Recipe Instructions (Optional)
          </CardTitle>
          {showRecipeDetails ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
        </button>
        
        {showRecipeDetails && (
          <CardContent className="border-t border-gray-100 pt-6 space-y-6">
            <TextArea 
              label="Recipe Ingredients (Detailed)" 
              name="recipeIngredients" 
              value={formData.recipeIngredients} 
              onChange={handleChange} 
              placeholder="e.g.&#10;1. 200g Chicken Breast&#10;2. 1 cup Lettuce&#10;3. 2 tbsp Olive Oil" 
              rows={5} 
              className="font-mono text-sm" 
            />
            <TextArea 
              label="Step-by-Step Instructions" 
              name="recipeSteps" 
              value={formData.recipeSteps} 
              onChange={handleChange} 
              placeholder="e.g.&#10;1. Wash and chop the vegetables.&#10;2. Grill the chicken for 10 mins.&#10;3. Mix everything in a bowl." 
              rows={6} 
            />
          </CardContent>
        )}
      </Card>

      <div className="sticky bottom-0 z-10 bg-white/80 backdrop-blur-md p-4 -mx-4 md:mx-0 border-t border-gray-200 flex justify-end gap-4 rounded-t-xl">
        <Button type="button" variant="secondary" onClick={() => router.back()} className="px-6">Cancel</Button>
        <Button type="submit" isLoading={loading} className="min-w-[180px] px-6">
          <Save className="w-4 h-4 mr-2" /> Save Food Item
        </Button>
      </div>
    </form>
  );
}
"use client";

import React, { useState } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import {
  MEAL_TIMING_OPTIONS,
  DIET_TYPE_OPTIONS,
  HEALTH_GOALS_OPTIONS,
  CUISINE_OPTIONS,
  MOOD_OPTIONS,
  WEATHER_OPTIONS,
  FOOD_STYLE_OPTIONS,
  INGREDIENT_RESTRICTION_OPTIONS,
  // OCCASION_OPTIONS,
} from "@/lib/constants";

export default function AddFoodForm({ onAdded }) {
  const [form, setForm] = useState({
    name: "",
    image: null,           // may be File or URL string
    imageUrl: "",         // separate field when user enters URL
    useUrl: false,          // toggle between upload and url
    description: "",
    category: "",
    items: "",
    mealTiming: "",
    dietType: "",
    healthGoals: "",
    cuisine: "",
    mood: "",
    weather: "",
    foodStyle: "",
    restrictedIngredients: "",
    // occasion: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const body = {
      name: form.name,
      description: form.description,
    };

    if (form.category) body.category = form.category;

    const toArray = (str) => str ? str.split(",").map((s) => s.trim().toLowerCase()) : [];

    if (form.items) body.items = toArray(form.items);
    if (form.mealTiming) body.mealTiming = toArray(form.mealTiming);
    if (form.dietType) body.dietType = toArray(form.dietType);
    if (form.healthGoals) body.healthGoals = toArray(form.healthGoals);
    if (form.cuisine) body.cuisine = toArray(form.cuisine);
    if (form.mood) body.mood = toArray(form.mood);
    if (form.weather) body.weather = toArray(form.weather);
    if (form.foodStyle) body.foodStyle = toArray(form.foodStyle);
    if (form.restrictedIngredients) body.restrictedIngredients = toArray(form.restrictedIngredients);
    // if (form.occasion) body.occasion = toArray(form.occasion);

    // image handling: file -> base64, or if using URL use that directly
    if (form.useUrl && form.imageUrl) {
      body.image = form.imageUrl;
    } else if (form.image instanceof File) {
      body.image = await fileToBase64(form.image);
    }

    try {
      const res = await fetch("/api/foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to add food");
      }

      const newFood = await res.json();
      setForm({
        name: "",
        image: "",
        imageUrl: "",
        useUrl: false,
        description: "",
        category: "",
        items: "",
        mealTiming: "",
        dietType: "",
        healthGoals: "",
        cuisine: "",
        mood: "",
        weather: "",
        foodStyle: "",
        restrictedIngredients: "",
        // occasion: "",
      });
      setPreviewUrl(null);

      if (onAdded) onAdded(newFood);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  console.log("Form state:", form);

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <h2 className="text-xl font-semibold">Add New Food</h2>

      <Input
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <Input
        label="Category"
        name="category"
        value={form.category}
        onChange={handleChange}
      />

      {form.category && (
        <Input
          label={`Items in ${form.category} (comma-separated)`}
          name="items"
          value={form.items}
          onChange={handleChange}
        />
      )}

      <div>
        <label className="block text-sm font-medium" htmlFor="useUrl">
          Image source
        </label>
        <div className="flex items-center space-x-4 mt-1">
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="useUrl"
              value={true}
              checked={form.useUrl}
              onChange={() => setForm((f) => ({ ...f, useUrl: true }))}
            />
            <span className="text-sm">URL</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="useUrl"
              value={false}
              checked={!form.useUrl}
              onChange={() => {
                setForm((f) => ({ ...f, useUrl: false, imageUrl: "" }));
                setPreviewUrl(null);
              }}
            />
            <span className="text-sm">Upload</span>
          </label>
        </div>
      </div>
      {form.useUrl ? (
        <>
          <Input
            label="Image URL"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            required
          />
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="preview"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </>
      ) : (
        <div>
          <label className="block text-sm font-medium" htmlFor="imageFile">
            Upload Image
          </label>
          <input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setForm((f) => ({ ...f, image: e.target.files[0] }));
                setPreviewUrl(URL.createObjectURL(e.target.files[0]));
              }
            }}
            className="mt-1"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="preview"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-2 py-1"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium" htmlFor="dietType">
            Diet Type
          </label>
          <select
            id="dietType"
            name="dietType"
            value={form.dietType}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-2 py-1"
          >
            <option value="">-- choose --</option>
            {DIET_TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="healthGoals">
            Health Goals
          </label>
          <select
            id="healthGoals"
            name="healthGoals"
            value={form.healthGoals}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-2 py-1"
          >
            <option value="">-- choose --</option>
            {HEALTH_GOALS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium" htmlFor="cuisine">
            Cuisine
          </label>
          <select
            id="cuisine"
            name="cuisine"
            value={form.cuisine}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-2 py-1"
          >
            <option value="">-- choose --</option>
            {CUISINE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="mood">
            Mood
          </label>
          <select
            id="mood"
            name="mood"
            value={form.mood}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-2 py-1"
          >
            <option value="">-- choose --</option>
            {MOOD_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium" htmlFor="mealTiming">
            Meal Timing
          </label>
          <select
            id="mealTiming"
            name="mealTiming"
            value={form.mealTiming}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-2 py-1"
          >
            <option value="">-- choose --</option>
            {MEAL_TIMING_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="weather">
            Weather
          </label>
          <select
            id="weather"
            name="weather"
            value={form.weather}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-2 py-1"
          >
            <option value="">-- choose --</option>
            {WEATHER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="foodStyle">
            Food Style
          </label>
          <select
            id="foodStyle"
            name="foodStyle"
            value={form.foodStyle}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-2 py-1"
          >
            <option value="">-- choose --</option>
            {FOOD_STYLE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="restrictedIngredients">
            Restrictions (e.g. No Onion)
          </label>
          <select
            id="restrictedIngredients"
            name="restrictedIngredients"
            value={form.restrictedIngredients}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-2 py-1"
          >
            <option value="">-- choose --</option>
            {INGREDIENT_RESTRICTION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        {/* <div>
          <label className="block text-sm font-medium" htmlFor="occasion">
            Occasion
          </label>
          <select
            id="occasion"
            name="occasion"
            value={form.occasion}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-2 py-1"
          >
            <option value="">-- choose --</option>
            {OCCASION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div> */}
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add Food"}
      </Button>
    </form>
  );
}

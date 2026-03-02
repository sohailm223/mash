"use client";

import { useState, useEffect } from "react";
import { getProfile } from "@/components/api";
import FoodCard from "@/components/cards/FoodCard";
import Link from "next/link";

export default function SavedPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getProfile();
        if (res.success && res.data && res.data.likedFoods) {
          setFoods(res.data.likedFoods);
        }
      } catch (e) {
        console.error("failed to load profile", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-10">
      <Link href="/" className="mb-6 inline-block text-indigo-600 hover:underline">
        &larr; Back
      </Link>
      <h1 className="text-2xl font-bold mb-4">Saved Foods</h1>
      {loading ? (
        <p>Loading...</p>
      ) : foods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      ) : (
        <p>No saved foods yet.</p>
      )}
    </div>
  );
}

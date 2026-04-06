"use client";

import FoodCard from "@/components/cards/FoodCard";
import Link from "next/link";

export default function SavedPage() {
  // saved items feature disabled in simplified version
  const foods = [];
  const loading = false;

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

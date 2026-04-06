"use client";

import { useState, useEffect } from "react";
import FoodCard from "./cards/FoodCard";
import { getRandomFood } from "./api";

export default function RandomPicker({ onLike, onDislike }) {
  const [food, setFood] = useState(null);
  const [exclusions, setExclusions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rejectedId, setRejectedId] = useState(null);

  const fetchNext = async () => {
    setLoading(true);
    try {
      const item = await getRandomFood(exclusions);
      setFood(item);
    } catch (err) {
      console.error("random fetch error", err);
      setFood(null);
    }
    setLoading(false);
  };

  // initial load
  useEffect(() => {
    fetchNext();
  }, []);

  const handleYes = async () => {
    if (!food) return;
    onLike && onLike(food);
    setRejectedId(null);
    fetchNext();
  };

  const handleNo = async () => {
    if (food) {
      setRejectedId(food._id);
      setExclusions((prev) => [...prev, food._id]);
      onDislike && onDislike(food);
      // preference saving disabled
    }
  };

  // whenever exclusions change we want to pull a fresh item
  useEffect(() => {
    if (exclusions.length > 0) {
      fetchNext();
    }
  }, [exclusions]);

  if (loading) {
    return <p>Loading suggestion...</p>;
  }

  if (!food) {
    return <p>No more suggestions available.</p>;
  }

  return (
    <div className="space-y-4">
      <FoodCard food={food} rejected={food && food._id === rejectedId} />
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleYes}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Yes
        </button>
        <button
          onClick={handleNo}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          No
        </button>
      </div>
    </div>
  );
}

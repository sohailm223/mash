"use client";

import { useState, useEffect } from "react";
import FoodCard from "./cards/FoodCard";

export default function FoodDetails({ food, onYes, onNo }) {
  const [current, setCurrent] = useState(food);
  const [rejected, setRejected] = useState(false);

  useEffect(() => {
    setCurrent(food);
  }, [food]);

  if (!current) {
    return <p>Select a food item or wait for a random suggestion.</p>;
  }

  const handleYes = () => {
    onYes && onYes(current);
  };

  const handleNo = () => {
    setRejected(true);
    onNo && onNo();
  };

  return (
    <div className="space-y-4">
      <FoodCard food={current} rejected={rejected} />
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

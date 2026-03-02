"use client";

import Link from "next/link";

export default function FoodAdd() {
  return (
    <Link
      href="/add-food"
      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 cursor-pointer inline-block"
    >
      + Add New Food
    </Link>
  );
}
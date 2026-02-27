"use client";

import { useRouter } from "next/navigation";
import FoodForm from "@/components/FoodForm";

export default function AddFoodPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to home page after successful addition
    router.push("/");
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Food Item</h1>
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <FoodForm onFormSubmitSuccess={handleSuccess} />
      </div>
    </div>
  );
}
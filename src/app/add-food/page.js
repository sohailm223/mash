"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FoodForm from "@/components/FoodForm";

export default function AddFoodPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to home page after successful addition
    router.push("/");
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-6">Add New Food Item</h1>
      <FoodForm onFormSubmitSuccess={handleSuccess} />
    </div>
  );
}
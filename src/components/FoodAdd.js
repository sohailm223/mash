"use client";

import { useState } from "react";
import Modal from "./Modal";
import FoodForm from "./FoodForm";

export default function FoodAdd({ onSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsModalOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 cursor-pointer"
      >
        + Add New Food
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h1 className="text-3xl font-bold mb-6">Add New Food Item</h1>
        <FoodForm onFormSubmitSuccess={handleSuccess} />
      </Modal>
    </>
  );
}
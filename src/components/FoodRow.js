"use client";

export default function FoodRow({ food, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center p-3 border-b hover:bg-gray-50 cursor-pointer"
    >
      <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <img
          src={food.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&q=60"}
          alt={food.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="ml-4 flex-1">
        <p className="font-medium text-gray-800 line-clamp-1">{food.name}</p>
        {food.cuisine?.length > 0 && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
            {food.cuisine.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}

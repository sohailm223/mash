import React from "react";

const FoodCard = ({ food }) => {
  return (
    <div className="border p-5 mb-5 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-gray-800 mb-3">{food.name}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {/* Left Column */}
        <div>
          <p>
            <strong>Style:</strong> {food.foodStyle}
          </p>
          <p>
            <strong>Cuisine:</strong> {food.cuisine?.join(", ")}
          </p>
          <p>
            <strong>Cook Time:</strong> {food.cookTime} min
          </p>
          <p>
            <strong>Price:</strong> ₹{food.price}
          </p>
          <p>
            <strong>Calories:</strong> {food.nutrition?.calories}
          </p>
        </div>

        {/* Right Column */}
        <div>
          <div className="mb-2">
            <strong>Meal Timing:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {food.mealTiming?.map((tag) => (
                <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
          <div className="mb-2">
            <strong>Diet Type:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {food.dietType?.map((tag) => (
                <span key={tag} className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Rendering for Recipe or Order Info */}
      <div className="mt-4 pt-4 border-t">
        {food.cookingMode === "cook-yourself" && food.recipe && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Recipe 👨‍🍳</h3>
            <p className="font-medium">Steps:</p>
            <ul className="list-decimal list-inside text-sm text-gray-600">
              {food.recipe.steps?.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        )}

        {food.cookingMode === "order-online" && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Available for Online Order 🛒</h3>
            {food.orderInfo?.deliveryTime > 0 && (
              <p><strong>Delivery Time:</strong> {food.orderInfo.deliveryTime} min</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
import React, { useState } from "react";
import { Clock, Flame, Utensils } from "lucide-react";
import Card from "../common/Card";

const FoodCard = ({ food }) => {
  const [imgSrc, setImgSrc] = useState(food.image);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Fallback image if the original fails to load
      setImgSrc("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80");
    }
  };

  return (
    <Card>
      <div className="relative w-full h-56 overflow-hidden bg-gray-100">
        <img
          src={imgSrc || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"}
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={handleError}
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {food.name}
          </h2>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-2 mb-4">
          {food.foodStyle && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Utensils className="w-3 h-3 mr-1.5" /> {food.foodStyle}
            </span>
          )}
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
            <Clock className="w-3 h-3 mr-1.5" /> {food.cookTime}m
          </span>
          {food.nutrition?.calories > 0 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-100">
              <Flame className="w-3 h-3 mr-1.5" /> {food.nutrition.calories} cal
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-y-2 text-sm text-gray-600 mb-4 flex-grow">
          {food.cuisine?.length > 0 && (
            <p className="flex items-start">
              <strong className="text-gray-900 min-w-[70px]">Cuisine:</strong>
              <span className="line-clamp-1">{food.cuisine.join(", ")}</span>
            </p>
          )}
          {food.mealTiming?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {food.mealTiming.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Actions */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          {food.cookingMode === "cook-yourself" && food.recipe && (
            <div className="text-sm">
              <div className="flex items-center text-gray-800 font-semibold mb-1">
                <span>Recipe Available</span>
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  Cook Yourself
                </span>
              </div>
            </div>
          )}

          {food.cookingMode === "order-online" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Order Online
                </span>
                {food.orderInfo?.deliveryTime > 0 && (
                  <span className="text-xs text-gray-500">
                    {food.orderInfo.deliveryTime} mins
                  </span>
                )}
              </div>
              <div className="flex gap-2 mt-1">
                {food.orderInfo?.swiggyLink && (
                  <a
                    href={food.orderInfo.swiggyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-xs bg-orange-500 text-white px-3 py-1.5 rounded hover:bg-orange-600 transition-colors"
                  >
                    Swiggy
                  </a>
                )}
                {food.orderInfo?.zomatoLink && (
                  <a
                    href={food.orderInfo.zomatoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-xs bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition-colors"
                  >
                    Zomato
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default FoodCard;

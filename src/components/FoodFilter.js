"use client";

import { useState } from "react";
import {
  ChevronDown,
  Search,
  Leaf,
  HeartPulse,
  Clock,
  Smile,
  Timer,
  UtensilsCrossed,
} from "lucide-react";

// A reusable dropdown component for filters
const FilterDropdown = ({
  title,
  icon: Icon,
  options,
  selectedValue,
  onValueChange,
  filterKey,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value, e) => {
    // Prevent the dropdown from closing when clicking a checkbox
    e.stopPropagation();
    
    const currentValues = Array.isArray(selectedValue) ? selectedValue : [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onValueChange({ target: { name: filterKey, value: newValues } });
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className={`inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          selectedValue && selectedValue.length > 0 ? "border-indigo-500 text-indigo-600" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {Icon && <Icon className="mr-2 h-5 w-5" />}
        {title} {selectedValue && selectedValue.length > 0 && `(${selectedValue.length})`}
        <ChevronDown className="-mr-1 ml-2 h-5 w-5" />
      </button>

      {isOpen && (
        <div
          className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {options.map((option) => {
              const isSelected = Array.isArray(selectedValue) && selectedValue.includes(option);
              return (
                <div
                  key={option}
                  className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer`}
                  onClick={(e) => handleSelect(option, e)}
                  role="menuitem"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-3"
                  />
                  {option}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default function FoodFilter({ filters, setFilters }) {
  const dietTypes = ["Vegetarian", "Non-Vegetarian", "Vegan", "Gluten-Free"];
  const healthGoals = [
    "Weight Loss",
    "Weight Gain",
    "Muscle Building",
    "General Fitness",
  ];
  const mealTimings = ["Breakfast", "Lunch", "Snacks", "Dinner"];
  const moods = ["Happy", "Sad", "Stressed", "Celebratory", "Comfort"];
  const cookTimeOptions = ["0-15 min", "15-30 min", "30-60 min", "60+ min"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      dietType: [],
      healthGoals: [],
      cuisine: "",
      mealTiming: [],
      mood: [],
      cookTime: [],
    });
  };

  return (
    <div className="p-4 mb-6 border rounded-lg bg-gray-50">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Name Search */}
        <div className="relative flex-grow min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            name="name"
            id="name"
            value={filters.name || ""}
            onChange={handleInputChange}
            placeholder="Search by food name..."
            className="pl-10 pr-4 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Cuisine Search */}
        <div className="relative flex-grow min-w-[150px]">
          <UtensilsCrossed className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            name="cuisine"
            id="cuisine"
            value={filters.cuisine || ""}
            onChange={handleInputChange}
            placeholder="Cuisine (e.g. Indian)"
            className="pl-10 pr-4 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-start">
          <FilterDropdown
            title="Diet"
            icon={Leaf}
            options={dietTypes}
            selectedValue={filters.dietType}
            onValueChange={handleInputChange}
            filterKey="dietType"
          />
          <FilterDropdown
            title="Health Goal"
            icon={HeartPulse}
            options={healthGoals}
            selectedValue={filters.healthGoals}
            onValueChange={handleInputChange}
            filterKey="healthGoals"
          />
          <FilterDropdown
            title="Meal"
            icon={Clock}
            options={mealTimings}
            selectedValue={filters.mealTiming}
            onValueChange={handleInputChange}
            filterKey="mealTiming"
          />
          <FilterDropdown
            title="Mood"
            icon={Smile}
            options={moods}
            selectedValue={filters.mood}
            onValueChange={handleInputChange}
            filterKey="mood"
          />
          <FilterDropdown
            title="Cook Time"
            icon={Timer}
            options={cookTimeOptions}
            selectedValue={filters.cookTime}
            onValueChange={handleInputChange}
            filterKey="cookTime"
          />

          {Object.values(filters).some((v) => (Array.isArray(v) ? v.length > 0 : v)) && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-indigo-600 px-2 py-1"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
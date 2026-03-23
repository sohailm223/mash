"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

const FILTER_CONFIG = [
  { id: "dietType", label: "Diet Type", options: ["Veg", "Non-Veg", "Vegan"] },
  { id: "healthGoals", label: "Health Goals", options: ["Weight Loss", "Weight Gain", "Balanced", "Muscle Gain"] },
  // { id: "spiceLevel", label: "Spice Level", options: ["Mild", "Medium", "Spicy"] },
  { id: "allergies", label: "Allergies", options: ["No allergies", "Gluten", "Dairy", "Nuts", "Shellfish", "Eggs","onion","garlic"] },
  { id: "mealTiming", label: "Meal Timing", options: ["Breakfast", "Lunch", "Dinner", "Snacks"] },
  // { id: "mood", label: "Mood", options: ["Comfort", "Excited", "Indulgent", "Adventurous"] },
  // { id: "weather", label: "Weather", options: ["Summer", "Winter", "Rainy"] },
  // { id: "foodStyle", label: "Food Style", options: ["Fast Food", "Home-cooked", "Street Food"] },
  // { id: "cuisine", label: "Cuisine", options: ["Indian", "Chinese", "Italian", "Mexican", "Continental"] }
];

export default function FilterPanel({ currentParams, onApply, onClose }) {
  const [filters, setFilters] = useState({});
  const { data: session } = useSession();

  useEffect(() => {
    const params = new URLSearchParams(currentParams);
    const initialFilters = {};
    const userPreferences = session?.user?.questionnaire || {};

    FILTER_CONFIG.forEach(category => {
      const paramKey = category.id === 'allergies' ? 'restrictedIngredients' : category.id;
      const paramValue = params.get(paramKey);
      
      // Map 'healthGoals' from filter config to 'weightGoal' in preferences
      const prefKey = category.id === 'healthGoals' ? 'weightGoal' : category.id;
      const prefValue = userPreferences[prefKey];

      if (paramValue) {
        // URL params take precedence
        initialFilters[category.id] = paramValue.split(',');
      } else if (prefValue && Array.isArray(prefValue) && prefValue.length > 0) {
        // Fallback to user's saved preferences from session
        initialFilters[category.id] = prefValue;
      }
    });
    
    setFilters(initialFilters);
  }, [currentParams, session]);

  const handleToggle = (categoryId, optionValue) => {
    console.log(`Filter modified for Category:  "${categoryId}" - Option: "${optionValue}" at ${new Date().toLocaleTimeString()}`);
    const normalizedValue = optionValue.toLowerCase().replace(/\s+/g, "-");
    
    setFilters(prev => {
      const currentValues = prev[categoryId] || [];
      let newValues;
      
      if (currentValues.includes(normalizedValue)) {
        newValues = currentValues.filter(v => v !== normalizedValue);
      } else {
        if (categoryId === 'allergies') {
          if (normalizedValue === 'no-allergies') {
            newValues = ['no-allergies']; // Selecting "No allergies" clears others
          } else {
            // Selecting a specific allergy clears "No allergies"
            const withoutNoAllergies = currentValues.filter(v => v !== 'no-allergies');
            newValues = [...withoutNoAllergies, normalizedValue];
          }
        } else {
          newValues = [...currentValues, normalizedValue];
        }
      }
      // how to get time ye filter kb remove hoga jo bydefualt aajye 
      return {
        ...prev,
        [categoryId]: newValues
      };
    });
  };

  const handleApply = async () => {
    console.log(`Filters applied at time start ${new Date().toLocaleTimeString()}`);
    const params = new URLSearchParams(currentParams);
    
    // Update params with new filter state
    FILTER_CONFIG.forEach(category => {
      const values = filters[category.id];
      const paramKey = category.id === 'allergies' ? 'restrictedIngredients' : category.id;

      if (values && values.length > 0) {
        params.set(paramKey, values.join(','));
        if (paramKey !== category.id) params.delete(category.id);
      } else {
        params.delete(paramKey);
        if (paramKey !== category.id) params.delete(category.id);
      }
    });
    console.log("show food after applying filters with params:", params.toString());

    // Save filters to a temporary cookie for 1 minute (60 seconds)
    // This allows the filters to persist across refreshes but not permanently in the DB
    const expirySeconds = 60;
    document.cookie = `temp_filters=${params.toString()}; path=/; max-age=${expirySeconds}`;
    
    onApply(params.toString(), Date.now() + expirySeconds * 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Slide-in Panel */}
      <div className="relative w-full max-w-xs bg-white h-full shadow-2xl overflow-y-auto flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-5 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-800">Filter Preferences</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 flex-1 space-y-8">
          {FILTER_CONFIG.map((category) => (
            <div key={category.id}>
              <h4 className="font-semibold text-gray-900 mb-3">{category.label}</h4>
              <div className="flex flex-wrap gap-2">
                {category.options.map(option => {
                  const val = option.toLowerCase().replace(/\s+/g, "-");
                  const isActive = filters[category.id]?.includes(val);
                  
                  return (
                    <button
                      key={option}
                      onClick={() => handleToggle(category.id, option)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        isActive 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 border-t bg-gray-50 sticky bottom-0">
          <button 
            onClick={handleApply}
            className="w-full py-3.5 bg-gray-900 hover:bg-black text-white text-lg font-bold rounded-2xl shadow-lg transition transform active:scale-[0.98]"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect, useRef } from 'react';
import { MEAL_SPECIFIC_INGREDIENTS } from '@/lib/utils';
import FilterPanel from './FilterPanel';




export default function FoodSpin({ initialFoods, isFiltered, mealTiming, baseParams }) {
  const [foods, setFoods] = useState(initialFoods || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [phase, setPhase] = useState("select-mode");
  const [selectedMode, setSelectedMode] = useState(null);

  const [suggestedFood, setSuggestedFood] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [rejectedIds, setRejectedIds] = useState(new Set());

  // filtering states
  const [currentQueryString, setCurrentQueryString] = useState(baseParams);
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  // Filter timer states
  const [filterExpiry, setFilterExpiry] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  const wheelRef = useRef(null);
  const cacheRef = useRef({});
  const abortControllerRef = useRef(null);

  const COMMON_INGREDIENTS = MEAL_SPECIFIC_INGREDIENTS[mealTiming] || [
  //   { id: "chicken", label: "Chicken" },
  ];
  const [checkedIngredients, setCheckedIngredients] = useState({});

  const toggleIngredient = (id) => {
    setCheckedIngredients((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getNewSuggestion = (currentFoods = foods) => {
    let available = currentFoods.filter((f) => !rejectedIds.has(f._id));

    if (available.length === 0) {
      setRejectedIds(new Set());
      available = [...currentFoods];
    }

    if (available.length === 0) return null;

    const idx = Math.floor(Math.random() * available.length);
    return available[idx];
  };

  useEffect(() => {
    if (initialFoods) {
      setFoods(initialFoods);
      if (isFiltered && initialFoods.length === 0) {
        setError("No food items found. Try changing your filters!");
      } else {
        setError(null);
      }
    }
  }, [initialFoods, isFiltered]);

  useEffect(() => {
    if (foods?.length > 0) {
      setRejectedIds(new Set());
      setSuggestedFood(getNewSuggestion(foods));
      setShowResult(false);
    }
  }, [foods]);

  const handleModeSelect = (mode) => {
    if (selectedMode === mode) return;

    if (wheelRef.current) {
      wheelRef.current.style.transition = "none";
      wheelRef.current.style.transform = `rotate(0deg)`;
    }

    setSelectedMode(mode);
    setFoods([]);
    setRejectedIds(new Set());
    setSuggestedFood(null);
    setShowResult(false);
    setError(null);
    setCheckedIngredients({}); 
    
  };

  const fetchFoodsForMode = async (mode, ingredients = []) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    const params = new URLSearchParams(currentQueryString);
    
    // Fix: If 'no-allergies' is selected, remove the param so the API returns all foods
    if (params.get('restrictedIngredients') === 'no-allergies') {
      params.delete('restrictedIngredients');
    }

    params.set('foodType', mode);

    if (ingredients.length > 0) {
      params.set('ingredients', ingredients.join(','));
    }

    try {
      const res = await fetch(`/api/foods?${params.toString()}`, {
        signal: abortControllerRef.current.signal
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch food: ${res.statusText}`);
      }
      const data = await res.json();

      if (data.length === 0) {
        setError("No food found for your selection. Try changing filters.");
        setFoods([]);
        return [];
      }

      setFoods(data);
      return data;
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
      setFoods([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch foods when ingredients change in self-cooking mode
  // useEffect(() => {
  //   if (selectedMode === 'self-cooking') {
  //     const selectedIngredients = Object.keys(checkedIngredients).filter(
  //       (key) => checkedIngredients[key]
  //     );

  //     if (selectedIngredients.length > 0) {
  //       fetchFoodsForMode('self-cooking', selectedIngredients);
  //     } else {
  //       setFoods([]); // Clear food list if no ingredients are selected
  //     }
  //   }
  // }, [checkedIngredients, selectedMode]);

  const handleFilterApply = (newParams, expiryTime) => {
    setCurrentQueryString(newParams);
    setFiltersVisible(false);
    // setSelectedMode(null); // Removed to keep the user in the current mode
    setFoods([]);
    setSuggestedFood(null);
    setShowResult(false);
    setError(null);

    if (expiryTime) {
      setFilterExpiry(expiryTime);
      setTimeLeft(Math.ceil((expiryTime - Date.now()) / 1000));
    }
  };

  const clearFilters = () => {
    setFilterExpiry(null);
    setTimeLeft(null);
    setCurrentQueryString(baseParams); // Reset to defaults
    document.cookie = "temp_filters=; path=/; max-age=0"; // Clear cookie
    setFoods([]);
    setSuggestedFood(null);
    setShowResult(false);
  };

  useEffect(() => {
    if (!filterExpiry) return;

    const interval = setInterval(() => {
      const remaining = Math.ceil((filterExpiry - Date.now()) / 1000);
      console.log(`Time remaining for filter expiration: ${remaining}s`);

      if (remaining <= 0) {
        clearInterval(interval);
        setFilterExpiry(null);
        setTimeLeft(null);
        setCurrentQueryString(baseParams); // Reset to defaults
        document.cookie = "temp_filters=; path=/; max-age=0"; // Clear cookie
        setFoods([]); 
        setSuggestedFood(null);
        setShowResult(false);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [filterExpiry, baseParams]);

  const startSpin = async () => {
    if (spinning || loading) return;

    //  Ingredients nikaalo
    let selectedIngredients = Object.keys(checkedIngredients).filter(
      (key) => checkedIngredients[key]
    );

    const fetchedFoods = await fetchFoodsForMode(selectedMode, selectedIngredients);

    if (!fetchedFoods || fetchedFoods.length === 0) return;

    setSuggestedFood(getNewSuggestion(fetchedFoods));

    setSpinning(true);
    setShowResult(false);

    const extraSpins = 4 + Math.floor(Math.random() * 5);
    const randomAngle = Math.floor(Math.random() * 360);
    const totalRotation = extraSpins * 360 + randomAngle;

    if (wheelRef.current) {
      wheelRef.current.style.transition =
        "transform 4.5s cubic-bezier(0.25, 0.1, 0.25, 1)";
      wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
    }

    setTimeout(() => {
      setSpinning(false);
      setShowResult(true);

      setTimeout(() => {
        if (wheelRef.current) {
          wheelRef.current.style.transition = "none";
          wheelRef.current.style.transform = `rotate(${randomAngle}deg)`;
        }
      }, 100);
    }, 4600);
  };

  const handleReject = () => {
    if (!suggestedFood) return;
    setRejectedIds((prev) => new Set([...prev, suggestedFood._id]));
    setShowResult(false);
    startSpin();
  };

  const handleConfirm = () => {
    if (!suggestedFood) return;
    alert(`Confirmed: ${suggestedFood.name} (${selectedMode || "—"})`);
  };

  if (phase === "select-mode" || phase === "spin") {

    return (
      <div className="min-h-fit flex flex-col items-center justify-start gap-4 p-4 max-w-2xl mx-auto">

        <div className="relative w-full flex justify-between items-center mb-2">
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            What's your plan for today?
          </h2>
          {timeLeft !== null && timeLeft > 0 && (
            <div className="absolute right-14 top-1/2 -translate-y-1/2 mr-2 flex items-center gap-2">
              <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded animate-pulse">
              ⏳ {timeLeft}s left
              </span>
              <button onClick={clearFilters} className="p-1 bg-red-50 hover:bg-red-100 text-red-500 rounded-full transition" title="Clear Filters">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
          <button 
            onClick={() => setFiltersVisible(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 text-gray-600 transition border border-gray-200"
            title="Filter Preferences"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>


        {/* 1. SPIN WHEEL - TOP */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto">
          <div
            ref={wheelRef}
            className="absolute inset-0 rounded-full border-8 border-gray-800 bg-gray-100 shadow-2xl overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800"
              alt="What to eat?"
              className="w-full h-full object-cover"
            />
          </div>

          {showResult && suggestedFood && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-20 animate-fade-in bg-white rounded-full shadow-2xl border-4 border-gray-800">
              <img
                src={suggestedFood.image}
                alt={suggestedFood.name}
                className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-full border-4 border-green-500 shadow-lg mb-3"
              />
              <h3 className="text-xl md:text-2xl font-black text-center text-gray-900 leading-none px-4 drop-shadow-sm">
                {suggestedFood.name}
              </h3>
            </div>
          )}

        

          {/* Pointer arrow */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
            <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[24px] border-b-red-600 drop-shadow-lg" />
          </div>
        </div>

        {/* 2. MODE BUTTONS - Online / Self-Cooking */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mt-2">
          <button
            onClick={() => handleModeSelect("online")}
            className={`flex-1 py-4 text-white text-xl font-bold rounded-2xl shadow-md hover:scale-105 transition ${
              selectedMode === "online"
                ? "ring-4 ring-yellow-400 bg-blue-800"
                : "bg-gradient-to-r from-blue-600 to-blue-700"
            }`}
          >
            Order-Online
          </button>
          <button
            onClick={() => handleModeSelect("self-cooking")}
            className={`flex-1 py-4 text-white text-xl font-bold rounded-2xl shadow-md hover:scale-105 transition ${
              selectedMode === "self-cooking"
                ? "ring-4 ring-yellow-400 bg-green-800"
                : "bg-gradient-to-r from-green-600 to-green-700"
            }`}
          >
            Self-Cooking
          </button>
        </div>

        {/* Self-Cooking Ingredients Checklist */}
        {selectedMode === "self-cooking" && (
          <div className="w-full max-w-lg bg-green-50 border border-green-200 rounded-2xl p-4 mt-1">
            <h3 className="text-lg font-bold text-green-800 mb-3 text-center">
              🛒 Selcted food ?
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COMMON_INGREDIENTS.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-xl border-2 transition select-none
                    ${checkedIngredients[item.id]
                      ? "bg-green-200 border-green-500 font-semibold text-green-900"
                      : "bg-white border-gray-200 text-gray-700 hover:border-green-400"
                    }`}
                >
                  <input
                    type="checkbox"
                    className="accent-green-600 w-4 h-4"
                    checked={!!checkedIngredients[item.id]}
                    onChange={() => toggleIngredient(item.id)}
                  />
                  <span className="text-sm">{item.label}</span>
                </label>
              ))}
            </div>
            {Object.values(checkedIngredients).some(Boolean) && (
              <p className="text-center text-green-700 text-sm mt-3 font-medium">
                 {Object.values(checkedIngredients).filter(Boolean).length} ingredient(s) selected
              </p>
            )}
          </div>
        )}

        {loading && <p className="text-center py-2 text-lg animate-pulse">Finding options for you...</p>}
        {error && <p className="text-center text-red-600 font-bold">{error}</p>}

        {/* 3. SPIN BUTTON */}
        {selectedMode && (
          <button
            onClick={startSpin}
            disabled={loading || spinning || (selectedMode === "self-cooking" && Object.values(checkedIngredients).filter(Boolean).length === 0)}
            className="px-10 py-3 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-black text-xl font-extrabold rounded-full shadow-lg disabled:opacity-60 transition transform active:scale-95"
          >
            {(loading || spinning) ? "Spinning..." : "SPIN!"}
          </button>
        )}

        {/* 4. RESULT BUTTONS - After Spin */}
        {showResult && suggestedFood && !spinning && (
          <div className="w-full max-w-md flex flex-col gap-2 animate-fade-in">
            <p className="text-center text-lg font-semibold text-gray-800">
              {selectedMode === "online" ? "Order Online?" : "Cook Yourself?"}
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleReject}
                className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-800 text-lg font-bold rounded-xl border border-red-300 transition"
              >
                No, Change Food
              </button>
              <button
                onClick={() => setPhase("confirmed")}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-xl shadow-md transition"
              >
                Yes, This One!
              </button>
            </div>

            <button
              onClick={() => {
                setPhase("select-mode");
                setSelectedMode(null);
                setFoods([]);
                setSuggestedFood(null);
                setShowResult(false);
              }}
              className="text-center text-gray-500 hover:text-gray-700 underline text-sm mt-3"
            >
              Change mode
            </button>
          </div>
        )}

        {/* Filter Panel */}
        {filtersVisible && (
          <FilterPanel 
            currentParams={currentQueryString} 
            onApply={handleFilterApply} 
            onClose={() => setFiltersVisible(false)} 
          />
        )}

      </div>
    );
  }

  if (phase === "confirmed") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-10 p-6 text-center">
        <div className="text-7xl">🎉</div>
        <h2 className="text-4xl md:text-5xl font-bold">Great Choice!</h2>

        <div className="mt-6 max-w-sm">
          <img
            src={suggestedFood?.image}
            alt={suggestedFood?.name}
            className="w-64 h-64 object-cover rounded-2xl mx-auto mb-6 shadow-xl"
          />
          <h3 className="text-3xl font-bold text-green-700 mb-3">
            {suggestedFood?.name}
          </h3>
          <p className="text-xl text-gray-700">
            {selectedMode === "online"
              ? "We'll help you order it online"
              : "Time to cook this at home!"}
          </p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-6">
          <button
            onClick={() => {
              setPhase("select-mode");
              setSelectedMode(null);
              setShowResult(false);
              setFoods([]);
              setSuggestedFood(null);
            }}
            className="px-10 py-5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xl font-bold rounded-xl"
          >
            Start Over
          </button>

          <button
            onClick={handleConfirm}
            className="px-10 py-5 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-xl shadow-lg"
          >
            Proceed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-20 text-2xl text-gray-600">
      Something went wrong — please refresh
    </div>
  );
}
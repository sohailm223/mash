"use client";
import React, { useState, useEffect, useRef } from 'react';
import { MEAL_SPECIFIC_INGREDIENTS } from '@/lib/utils';



export default function FoodSpin({ initialFoods, isFiltered, mealTiming, baseParams }) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [phase, setPhase] = useState("select-mode");
  const [selectedMode, setSelectedMode] = useState(null);

  const [suggestedFood, setSuggestedFood] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [rejectedIds, setRejectedIds] = useState(new Set());

  const wheelRef = useRef(null);
  const cacheRef = useRef({});
  const abortControllerRef = useRef(null);

  const COMMON_INGREDIENTS = MEAL_SPECIFIC_INGREDIENTS[mealTiming] || [
  //   { id: "chicken", label: "Chicken" },
  //   // { id: "paneer", label: "Paneer" },
  //   // { id: "dal", label: "Dal" },
  //   // { id: "chawal", label: "Chawal (Rice)"},
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
    if (foods?.length > 0) {
      setRejectedIds(new Set());
      setSuggestedFood(getNewSuggestion(foods));
      setShowResult(false);
      if (wheelRef.current) {
        wheelRef.current.style.transition = "none";
        wheelRef.current.style.transform = `rotate(0deg)`;
      }
    }
  }, [foods]);

  const handleModeSelect = (mode) => {
    if (selectedMode === mode) return;

    setSelectedMode(mode);
    setFoods([]);
    setRejectedIds(new Set());
    setSuggestedFood(null);
    setShowResult(false);
    setError(null);
    setCheckedIngredients({}); 

    if (mode === 'online') {
      fetchFoodsForMode('online');
    }
    if (mode === 'self-cooking') {
      fetchFoodsForMode('self-cooking');
    }
  };

  const fetchFoodsForMode = async (mode, ingredients = []) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    const params = new URLSearchParams(baseParams);
    params.set('foodType', mode);

    if (ingredients.length > 0) {
      params.set('ingredients', ingredients.join(','));
    }

    const cacheKey = params.toString();

    try {
      if (cacheRef.current[cacheKey]) {
        setFoods(cacheRef.current[cacheKey]);
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/foods?${params.toString()}`, {
        signal: abortControllerRef.current.signal
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch food: ${res.statusText}`);
      }
      const data = await res.json();
      console.log(`Querying for: ${params.toString()}`);
      console.log(`self-cooking total foods: \`${ingredients.join(',')}\``, { dataLength: data.length, ingredients });
      console.log("Total Foods:", data.length);


      if (data.length === 0) {
        setError(`No food found for your selection.`);
        setFoods([]);
      } else {
        cacheRef.current[cacheKey] = data;
        setFoods(data);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch foods when ingredients change in self-cooking mode
  useEffect(() => {
    if (selectedMode === 'self-cooking') {
      const selectedIngredients = Object.keys(checkedIngredients).filter(
        (key) => checkedIngredients[key]
      );

      if (selectedIngredients.length > 0) {
        fetchFoodsForMode('self-cooking', selectedIngredients);
      } else {
        setFoods([]); // Clear food list if no ingredients are selected
      }
    }
  }, [checkedIngredients, selectedMode]);

  const startSpin = () => {
    if (spinning || foods.length === 0) return;

    const nextFood = getNewSuggestion();
    setSuggestedFood(nextFood);

    setSpinning(true);
    setShowResult(false);

    const extraSpins = 4 + Math.floor(Math.random() * 5);
    const randomAngle = Math.floor(Math.random() * 360);
    const totalRotation = extraSpins * 360 + randomAngle;

    if (wheelRef.current) {
      wheelRef.current.style.transition = "transform 4.5s cubic-bezier(0.25, 0.1, 0.25, 1)";
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

        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
          What's your plan for today?
        </h2>

        {/* 1. SPIN WHEEL - TOP */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto">
          <div
            ref={wheelRef}
            className="absolute inset-0 rounded-full border-8 border-gray-800 bg-gray-100 shadow-2xl overflow-hidden"
            style={{ transform: "rotate(0deg)" }}
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
                ✅ {Object.values(checkedIngredients).filter(Boolean).length} ingredient(s) selected
              </p>
            )}
          </div>
        )}

        {loading && <p className="text-center py-2 text-lg animate-pulse">Finding options for you...</p>}
        {error && <p className="text-center text-red-600 font-bold">{error}</p>}

        {/* 3. SPIN BUTTON */}
        <button
          onClick={startSpin}
          disabled={spinning || foods.length === 0}
          className="px-10 py-3 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-black text-xl font-extrabold rounded-full shadow-lg disabled:opacity-60 transition transform active:scale-95"
        >
          {spinning ? "Spinning..." : "SPIN!"}
        </button>

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
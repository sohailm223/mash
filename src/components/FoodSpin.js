"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function FoodList({ initialFoods, isFiltered }) {
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

  // Get random food (excluding already rejected ones)
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

  const handleModeSelect = async (mode) => {
    setLoading(true);
    setError(null);
    setSelectedMode(mode);
    try {
    //   const mealTiming = getCurrentMealTiming();
      const res = await fetch(`/api/foods?foodType=${mode}`);
      console.log("API Response Status:", res);
      if (!res.ok) {
        throw new Error(`Failed to fetch food: ${res.statusText}`);
      }
      const data = await res.json();
      console.log(`Querying for: foodType=${mode}`);
      console.log("Total Foods:", data.length);
      console.log("All Foods Data:", data);
      if (data.length === 0) {
        setError(`No food found for "${mode}" mode.`);
        setFoods([]);
        setPhase('select-mode');
      } else {
        setFoods(data);
        setPhase("spin");
      }
    } catch (err) {
      setError(err.message);
      setPhase('select-mode'); 
    } finally {
      setLoading(false);
    }
  };

  const startSpin = () => {
    if (spinning || foods.length === 0) return;

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
      const newFood = getNewSuggestion();
      setSuggestedFood(newFood);
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
    startSpin();
  };

  const handleConfirm = () => {
    if (!suggestedFood) return;
    alert(`Confirmed: ${suggestedFood.name} (${selectedMode || "—"})`);
  
  };

  if (phase === "select-mode") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-8 p-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          What's your plan for today?
        </h2>
        {loading ? (
          <p className="text-center py-20 text-xl">Finding options for you...</p>
        ) : (
          <>
            {error && <p className="text-center text-red-600 mb-4">Error: {error}</p>}
            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
              <button
                onClick={() => handleModeSelect("online")}
                className="flex-1 py-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-2xl font-bold rounded-2xl shadow-lg hover:scale-105 transition"
              >
                Order-Online
              </button>
              <button
                onClick={() => handleModeSelect("self-cooking")}
                className="flex-1 py-8 bg-gradient-to-r from-green-600 to-green-700 text-white text-2xl font-bold rounded-2xl shadow-lg hover:scale-105 transition"
              >
                Self-Cooking
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (loading) {
    return <p className="text-center py-20 text-xl">Loading food items...</p>;
  }
  if (foods.length === 0 && phase === 'spin') {
    return (
      <div className="text-center py-20">
        <p>No food items found for "{selectedMode}".</p>
        <button onClick={() => setPhase('select-mode')} className="mt-4 text-blue-600 underline">
          Go Back
        </button>
      </div>
    );
  }

  if (phase === "spin") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-10 p-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
          Spin & Decide
        </h2>

        {/* Big Circle */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
          <div
            ref={wheelRef}
            className="absolute inset-0 rounded-full border-8 border-gray-800 bg-gray-100 shadow-2xl overflow-hidden transition-transform duration-[4500ms] ease-out"
            style={{ transform: "rotate(0deg)" }}
          >
            {showResult && suggestedFood ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <img
                  src={suggestedFood.image}
                  alt={suggestedFood.name}
                  className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-white shadow-lg mb-2"
                />
                <h3 className="text-xl md:text-2xl font-bold text-center text-gray-800 drop-shadow-lg">
                  {suggestedFood.name}
                </h3>
              </div>
            ) : (
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800"
                alt="What to eat?"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Pointer arrow */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
            <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[24px] border-b-red-600 drop-shadow-lg" />
          </div>
        </div>

        {/* Spin button */}
        <button
          onClick={startSpin}
          disabled={spinning}
          className="mt-8 px-12 py-5 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-black text-2xl font-extrabold rounded-full shadow-xl disabled:opacity-60 transition transform active:scale-95"
        >
          {spinning ? "Spinning..." : "SPIN!"}
        </button>

        {/* After spin result */}
        {showResult && suggestedFood && (
          <div className="mt-10 w-full max-w-md flex flex-col gap-6 animate-fade-in">
            <>
                <p className="text-center text-xl font-semibold text-gray-800">
                  {selectedMode === "online" ? "Order Online?" : "Cook Yourself?"}
                </p>
                <div className="flex gap-5">
                  <button
                    onClick={handleReject}
                    className="flex-1 py-5 bg-red-50 hover:bg-red-100 text-red-800 text-xl font-bold rounded-xl border border-red-300 transition"
                  >
                    No, Change Food
                  </button>
                  <button
                    onClick={() => setPhase("confirmed")}
                    className="flex-1 py-5 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-xl shadow-lg transition"
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
                  }}
                  className="text-center text-gray-500 hover:text-gray-700 underline text-sm mt-3"
                >
                  Change mode
                </button>
            </>
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

  // Fallback (should not reach here)
  return (
    <div className="text-center py-20 text-2xl text-gray-600">
      Something went wrong — please refresh
    </div>
  );
}
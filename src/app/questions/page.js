"use client";
import { useState } from "react";

export default function Questions() {
  const [foodPreference, setFoodPreference] = useState([]);
  const [spicePreference, setSpicePreference] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [healthySuggestions, setHealthySuggestions] = useState([]);
  const [weightGoal, setWeightGoal] = useState([]);

  const handleCheckbox = (value, state, setState) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value));
    } else {
      if (state.length < 5) {
        setState([...state, value]);
      } else {
        alert("Maximum 5 selections allowed ❌");
      }
    }
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in ❌");
      return;
    }

    const answers = {
      foodPreference,
      spicePreference,
      allergies,
      healthySuggestions,
      weightGoal,
    };

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...answers }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Preferences Saved Successfully ✅");
    } catch (error) {
      console.error(error);
      alert("Something went wrong ❌");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Select Your Preferences</h2>

      <h3>Q1 Are you vegetarian or non-vegetarian?</h3>
      {["veg", "non-veg"].map((item) => (
        <label key={item}>
          <input
            type="checkbox"
            checked={foodPreference.includes(item)}
            onChange={() => handleCheckbox(item, foodPreference, setFoodPreference)}
          />
          {item}
          <br />
        </label>
      ))}

      <h3>Q2 Do you prefer spicy or mild?</h3>
      {["Spicy", "Mild", "Normal"].map((item) => (
        <label key={item}>
          <input
            type="checkbox"
            checked={spicePreference.includes(item)}
            onChange={() => handleCheckbox(item, spicePreference, setSpicePreference)}
          />
          {item}
          <br />
        </label>
      ))}

      <h3>Q3 Any allergies? (max 5)</h3>
      {["No allergies", "Oil", "High protein food", "Sugar"].map((item) => (
        <label key={item}>
          <input
            type="checkbox"
            checked={allergies.includes(item)}
            onChange={() => handleCheckbox(item, allergies, setAllergies)}
          />
          {item}
          <br />
        </label>
      ))}

      <h3>Q4 Do you want healthy suggestions?</h3>
      {["Yes", "No"].map((item) => (
        <label key={item}>
          <input
            type="checkbox"
            checked={healthySuggestions.includes(item)}
            onChange={() => handleCheckbox(item, healthySuggestions, setHealthySuggestions)}
          />
          {item}
          <br />
        </label>
      ))}

      <h3>Q5 Weight goal?</h3>
      {["Lose", "Gain", "Maintain"].map((item) => (
        <label key={item}>
          <input
            type="checkbox"
            checked={weightGoal.includes(item)}
            onChange={() => handleCheckbox(item, weightGoal, setWeightGoal)}
          />
          {item}
          <br />
        </label>
      ))}

      <br />

      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "600"
        }}
      >
        Save Preferences
      </button>
    </div>
  );
}
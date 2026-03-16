"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MultiReuse from "@/components/Multireuse"; 
import { preferenceQuestions } from "@/data/questions"; 

export default function Preferences() {
  const [answers, setAnswers] = useState({
    dietType: "",
    spiceLevel: "",
    allergies: [],
    healthSuggestions: "",
    weightGoal: "",
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const currentSelection = answers[name] || [];
      
      if (checked) {
        if (name === "allergies" && currentSelection.length >= 5) {
          alert("Maximum 5 selections allowed ❌");
          return;
        }
        setAnswers((prev) => ({
          ...prev,
          [name]: [...currentSelection, value],
        }));
      } else {
        setAnswers((prev) => ({
          ...prev,
          [name]: currentSelection.filter((item) => item !== value),
        }));
      }
    } else {
      setAnswers((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      alert("User not logged in ❌. Please register or login first.");
      router.push("/register");
      return;
    }

    // We have the user object from registration now
    const user = JSON.parse(userString);
    const userId = user._id || user.id;

    const { dietType, spiceLevel, allergies, healthSuggestions, weightGoal } =
      answers;

    if (!dietType || !spiceLevel || !healthSuggestions || !weightGoal) {
      alert("Please answer all questions.");
      return;
    }

    const answersPayload = [
      { questionId: "dietType", answer: [dietType] },
      { questionId: "spiceLevel", answer: [spiceLevel] },
      { questionId: "allergies", answer: allergies },
      { questionId: "healthSuggestions", answer: [healthSuggestions] },
      { questionId: "weightGoal", answer: [weightGoal] },
    ].filter((a) => a.answer.length > 0 && a.answer[0] !== "");

    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          answers: answersPayload
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to save preferences.");

      // Create the final user object with preferences to be stored in a cookie
      const finalUserObject = {
        ...user,
        profileComplete: true,
        questionnaire: answersPayload,
      };

      // Save to a cookie for the server-side Home page to read
      document.cookie = `user=${JSON.stringify(finalUserObject)}; path=/; max-age=86400`;
      localStorage.removeItem("user"); // Clean up local storage

      alert("Preferences Saved Successfully ✅");
      router.push("/");
    } catch (error) {
      console.error(error);
      alert(`Something went wrong: ${error.message} ❌`);
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-8 rounded-lg border-t-4 border-green-400 bg-white w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Tell Us Your Preferences
        </h2>

        <div className="flex flex-col gap-6">
          {preferenceQuestions.map((q) => (
            <MultiReuse
              key={q.name}
              type={q.type}
              title={q.title}
              name={q.name}
              options={q.options}
              selected={answers[q.name]}
              onChange={handleChange}
            />
          ))}

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white font-bold cursor-pointer px-6 py-3 rounded-md mt-4 w-full"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

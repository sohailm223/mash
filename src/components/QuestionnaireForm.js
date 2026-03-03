"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import questions from "@/data/questions.json";
import { submitQuestionnaire, skipQuestionnaire } from "./api";

export default function QuestionnaireForm({ onCompleted }) {
  const router = useRouter();
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);

  function handleChange(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await submitQuestionnaire(answers);
      if (res.success) {
        if (onCompleted) onCompleted();
        else router.push("/user-profile");
      } else {
        setError(res.message || "Unable to save answers");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSkip() {
    try {
      const res = await skipQuestionnaire();
      if (res.success) {
        if (onCompleted) onCompleted();
        else router.push("/user-profile");
      } else {
        setError(res.message || "Unable to skip");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl mb-6">Tell us about yourself</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q) => (
          <div key={q.id}>
            <p className="font-medium mb-2">{q.text}</p>
            <div className="space-y-1">
              {q.options.map((opt) => (
                <label key={opt} className="inline-flex items-center">
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => handleChange(q.id, opt)}
                    className="mr-2"
                    required
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
        {error && <p className="text-red-600">{error}</p>}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="text-gray-600 underline"
          >
            Skip for now
          </button>
        </div>
      </form>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/components/api";

export default function UserProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadProfile = async () => {
    setLoading(true);
    const res = await getProfile();
    setLoading(false);
    if (res.success && res.data) {
      setProfile(res.data);
    } else {
      router.push("/login");
    }
  };

  if (!profile) {
    return (
      <div className="p-10">
        <h1 className="text-2xl mb-4">Your profile</h1>
        <button
          onClick={loadProfile}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Loading…" : "Load profile"}
        </button>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">Your profile</h1>
      <p>User ID: {profile._id}</p>
      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>
      <p>Questions answered: {profile.profileComplete ? "Yes" : "No"}</p>
      {profile.questionnaire && profile.questionnaire.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Your answers</h2>
          <ul className="list-disc pl-5">
            {profile.questionnaire.map((q) => (
              <li key={q.questionId}>
                {q.questionId}: {q.answer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
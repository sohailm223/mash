"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import QuestionnaireForm from "@/components/QuestionnaireForm";
import { getProfile } from "@/components/api";

export default function QuestionnairePage() {
  const router = useRouter();

  // redirect if questionnaire already completed
  useEffect(() => {
    async function check() {
      const res = await getProfile();
      if (res.success && res.data?.profileComplete) {
        router.push("/user-profile");
      }
    }
    check();
  }, [router]);

  return (
    <div className="p-10">
      <button
        onClick={() => router.push("/")}
        className="mb-4 text-blue-500 underline"
      >
        ← Back to home
      </button>
      <QuestionnaireForm onCompleted={() => router.push("/")} />
    </div>
  );
}
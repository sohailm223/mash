"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { register as registerApi, getProfile } from "@/components/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  
  // if already logged in, redirect away
  useEffect(() => {
    async function check() {
      try {
        const res = await getProfile();
        if (res.success && res.data) {
          router.push("/");
        }
      } catch {}
    }
    check();
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await registerApi({ name, email, password });
      if (res.success) {
        // after account creation take user to questionnaire
        router.push("/questionnaire");
      } else {
        setError(res.message || "Registration failed");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Create an account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full border rounded px-2 py-1"
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <a href="/login" className="text-blue-500 underline">
          Login
        </a>
      </p>
    </div>
  );
}
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!email || !password) {
    setError("All fields are necessary.");
    return;
  }

  try {

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Email or password incorrect.");
      return;
    }

    const user = data.user;

    if (!user) {
      setError("User not found");
      return;
    }

    // save user
    localStorage.setItem("user", JSON.stringify(user));

    // set cookie
    document.cookie = `user=${JSON.stringify(user)}; path=/; max-age=86400`;

    // go home
    router.push("/");

  } catch (error) {
    console.error("Login error:", error);
    setError("Something went wrong during login.");
  }
};

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
        <h1 className="text-xl font-bold my-4">Enter your details</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email" />
          <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
          <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">Login</button>
          {error && <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">{error}</div>}
          <Link className="text-sm mt-3 text-right" href={'/register'}>
            Don't have an account? <span className="underline">Register</span>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
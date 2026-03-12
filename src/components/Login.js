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
    setError('');

    if (!email || !password) {
      setError('All fields are necessary.');
      return;
    }

    try {
      // NOTE: For a real application, you should use a library like NextAuth.js
      // to handle authentication securely. This is a simplified example.
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/'); // Redirect to the main page to see the food list
      } else {
        const data = await res.json();
        setError(data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Something went wrong during login.');
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
          <Link className="text-sm mt-3 text-right" href={'/'}>
            Don't have an account? <span className="underline">Register</span>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
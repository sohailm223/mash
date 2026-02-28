"use client";

import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({
     email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({ email: "", password: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      
     
      <input
        type="text"
        placeholder="Name or Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
        required
      />

      <br /><br />

     
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
        required
      />

      <br /><br />

      
      <button type="submit">Login</button>

      <br /><br />

     
      <button type="button" onClick={() => window.location.href="/forgot"}>
        Forgot Password
      </button>

      <button type="button" onClick={() => window.location.href="/register"}>
        Signup
      </button>

    </form>
  );
}
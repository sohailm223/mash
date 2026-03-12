"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Get session from NextAuth
  const { data: session, status } = useSession();

useEffect(() => {
  if (status === "authenticated" && session) {
    // Store the userId in localStorage
    if (!localStorage.getItem("userId")) {
      localStorage.setItem("userId", session.user.id); // session.user.id should now have the correct MongoDB _id
      localStorage.setItem("userName", session.user.name);
      localStorage.setItem("userEmail", session.user.email);
    }
    router.push("/questions"); // Redirect to the next page after login
  }
}, [session, status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
      } else {
        localStorage.setItem("userId", data.user.id); // Store the userId here as well
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", data.user.email);

        setMessage("Login successful ✅");
        router.push("/yourprofile");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }

    setLoading(false);
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/questions" });
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "50px" }}>
      <h1>Login</h1>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <br />
      <br />
      <div style={{ position: "relative", width: "220px" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          style={{ width: "100%", paddingRight: "40px" }}
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
        >
          {showPassword ? "🙈" : "👁️"}
        </span>
      </div>
      <br />
      <br />
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <br />
      <br />
      <button
        type="button"
        onClick={handleGoogleLogin}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4285F4",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Continue with Google
      </button>
    </form>
  );
}
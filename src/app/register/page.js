"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {

  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);

    try {

      const res = await fetch("/api/users", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {

        alert("User registered successfully ✅");
        router.push("/login");

      } else {

        alert(data.message);

      }

    } catch (error) {

      alert("Something went wrong ❌");

    }
  };

  // ✅ Google Login Function
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/login" });
  };

  return (
    <div style={{ padding: "100px", fontFamily: "Arial" }}>

      <h2>User Register</h2>

      <form onSubmit={handleSubmit}>

        <label>Name</label><br />
        <input
          type="text"
          placeholder="name..."
          required
          style={{ padding: "8px", width: "250px" }}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
 
        <br /><br />

        <label>Email</label><br />
        <input
          type="email"
          placeholder="email..."
          required
          style={{ padding: "8px", width: "250px" }}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <br /><br />

        <label>Password</label><br />

        <div style={{ position: "relative", width: "250px" }}>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="password..."
            required
            style={{ width: "100%", padding: "8px", paddingRight: "40px" }}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer"
            }}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>

        </div>

        <br /><br />

        <button
          type="submit"
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
          Register
        </button>

      </form>

      <br /><br />

      {/* ✅ Google Login Button */}

      <button
        onClick={handleGoogleLogin}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4285F4",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "600"
        }}
      >
        Continue with Google
      </button>

    </div>
  );
}
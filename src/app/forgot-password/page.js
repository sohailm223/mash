"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {

  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    const res = await fetch("/api/forgot-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (data.success) {
      alert("Password Updated ✅");

      // 👉 Open YourProfile Page
      router.push("/yourprofile");

    } else {
      alert(data.message);
    }
  };

  return (
    <div style={{ padding: "100px", maxWidth: "400px" }}>
      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit}>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          style={{ width: "100%" }}
        />

        <br /><br />

        {/* NEW PASSWORD */}
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            required
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            style={{ width: "100%" }}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "5px",
              border: "none",
              background: "none",
              cursor: "pointer"
            }}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <br /><br />

        {/* CONFIRM PASSWORD */}
        <div style={{ position: "relative" }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            required
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            style={{ width: "100%" }}
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "5px",
              border: "none",
              background: "none",
              cursor: "pointer"
            }}
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <br /><br />

        <button type="submit">
          Submit
        </button>

      </form>
    </div>
  );
}
"use client";

import { useState } from "react";

export default function RegisterPage() {
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

    const res = await fetch("/api/users", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      alert("User registered successfully!");
    } else {
      alert(data.message);
    }
  };

  return (
    <div style={{ padding: "100px" }}>
     
      <h2>User Register</h2>
       <br/> <br/>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label><br />
        <input
          id="name"
          type="text"
          placeholder="Name"
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}/>
        <br /><br />
        <label htmlFor="email">Email</label><br />
        <input
          id="email"
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <br /><br />

        {/* Password */}
        <label htmlFor="password">Password</label><br />
        <div style={{ position: "relative", width: "200px" }}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            style={{ width: "100%", paddingRight: "40px" }}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* Eye Icon Button */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              userSelect: "none"
            }}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <br /><br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
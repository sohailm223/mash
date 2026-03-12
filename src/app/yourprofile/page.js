"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function YourProfile() {

  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User not logged in");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("name", form.name);
    formData.append("phone", form.phone);
    formData.append("gender", form.gender);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await fetch("/api/yourprofile", {
      method: "PUT",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      alert("Profile Updated ✅");

      // 👉 Redirect to Questions Page
      router.push("/questions");

    } else {
      alert(data.message);
    }
  };

  return (
    <div style={{ padding: "100px", maxWidth: "400px" }}>
      <h2>Your Profile</h2>

      <form onSubmit={handleSubmit}>

        {/* IMAGE */}
        <div style={{ textAlign: "center", position: "relative" }}>
          <div
            onClick={handleImageClick}
            style={{
              width: "130px",
              height: "130px",
              borderRadius: "50%",
              background: "#ddd",
              margin: "0 auto",
              overflow: "hidden",
              cursor: "pointer",
              position: "relative"
            }}
          >
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                fontSize: "40px"
              }}>
                👤
              </div>
            )}

            <div style={{
              position: "absolute",
              bottom: "5px",
              right: "5px",
              background: "#0070f3",
              borderRadius: "50%",
              padding: "6px",
              color: "white",
              fontSize: "14px"
            }}>
              📷
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <br /><br />

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          style={{ width: "100%" }}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
          style={{ width: "100%" }}
        />

        <br /><br />

        <select
          value={form.gender}
          onChange={(e) =>
            setForm({ ...form, gender: e.target.value })
          }
          style={{ width: "100%" }}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <br /><br />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Complete Profile
        </button>

      </form>
    </div>
  );
} 
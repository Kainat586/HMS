"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user._id);

        if (data.user.role === "doctor" && data.doctorId) {
          localStorage.setItem("doctorId", data.doctorId);
        }
        if (data.user.role === "patient") {
          localStorage.setItem("patientId", data.user._id);
        }

        if (data.user.role === "doctor") {
          router.push("/dashboard/doctor");
        } else if (data.user.role === "admin") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard/patient");
        }
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div className="d-flex justify-items-center align-items-center ">
      <div className="card shadow-lg p-4 rounded-sm" style={{ width: "400px" , height:"420px", backgroundColor: "#ffff" }}>
        <form  onSubmit={handleSubmit}>
          <div className="from-group mb-4 mt-[40px] gap-5">
          <h2 className="fw-bold fs-2 text-center text-primary mb-4"
          >
            Login
          </h2></div>

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            type="email"
            className="form-control mb-4"
          />

          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            type="password"
            className="form-control mb-4"
          />

          <div className="d-flex justify-content-center align-items-center mb-4 gap-2">
            <p className="m-2 "
            style={{color:"#1e3a8a"}}>Don't have an account?</p>
            <a href="/register" className="custom-link">
              Register
            </a>
          </div>

          <button
            className="btn btn-lg btn-primary w-100 "
            type="submit"
            disabled={loading}
          >{loading ? "Loading..." : "Login"}

            
          </button>

          {error && <p className="text-danger  text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}

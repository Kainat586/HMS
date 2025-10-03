"use client";
import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";

const AddDoctorModal = ({ isOpen, onClose, fetchDoctors, editingDoctor }) => {
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (editingDoctor) {
      setForm({
        name: editingDoctor.name || "",
        specialization: editingDoctor.specialization || "",
        email: editingDoctor.email || "",
        password: "",
      });
    } else {
      setForm({ name: "", specialization: "", email: "", password: "" });
    }
  }, [editingDoctor]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (editingDoctor) {
        const res = await axios.put(`/api/doctors/${editingDoctor._id}`, form);
        if (res.data.success) {
          setMessage("Doctor updated successfully!");
        } else {
          setMessage("Failed to update doctor!");
        }
      } else {
        // Add new doctor
        const res = await axios.post("/api/doctors", form);
        if (res.data.success) {
          setMessage(res.data.message);
        } else {
          setMessage(res.data.message || "Failed to add doctor!");
        }
      }

      fetchDoctors();

      setTimeout(() => {
        onClose();
        setMessage("");
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
     <div
      className={`modal fade ${isOpen ? "show d-block" : "d-none"}`}
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title ml-[130px] fw-bold fs-4 text-primary">
              {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Doctor Name"
                required
                className="form-control mb-3"
              />
              <input
                type="text"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                placeholder="Specialization"
                required
                className="form-control mb-3"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="form-control mb-3"
              />
              {!editingDoctor && (
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password (default: 123456)"
                  className="form-control mb-3"
                />
              )}

              {message && (
                <p
                  className={`small ${
                    message.startsWith("✅") ? "text-success" : "text-danger"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>

            <div className="modal-footer d-flex justify-content-center  mb-3">
              
              <button
                type="submit"
                className="btn btn-primary w-100 h-30"
                disabled={loading}
              >
                {loading
                  ? editingDoctor
                    ? "Updating..."
                    : "Adding..."
                  : editingDoctor
                  ? "Update Doctor"
                  : "Add Doctor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDoctorModal;

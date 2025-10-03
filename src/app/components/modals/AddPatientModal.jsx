"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const AddPatientModal = ({ isOpen, onClose, fetchPatients, editingPatient }) => {
  const [form, setForm] = useState({ name: "", email: "", disease: "", password: "", });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  useEffect(() => {
    if (editingPatient) {
      setForm({
        name: editingPatient.name || "",
        email: editingPatient.email || "",
        disease: editingPatient.disease || "",
        password: "",
      })
    }
    else {
      setForm({ name: "", specialization: "", email: "", password: "" });
    }
  }, [editingPatient]);
  if (!isOpen) {
    return null;
  }


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (editingPatient) {
        const res = await axios.put(`/api/patients/${editingPatient._id}`, form);
        if (res.data.success) {
          setMessage("Pateint updated successfully!");
        } else {
          setMessage(" Failed to update patient!");
        }
      } else {
        const res = await axios.post("/api/patients", form);
        if (res.data.success) {
          setMessage(" Pateint added successfully!");
        } else {
          setMessage("Failed to add patient!");
        }
      }

      fetchPatients();

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className={`modal fade ${isOpen ? "show d-block" : "d-none"}`} tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title ml-[130px] fw-bold fs-4 text-primary mt-3">
              {editingPatient ? "Edit Patient" : "Add New Patient"}
            </h2>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {message && <p className="text-center text-success">{message}</p>}
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="modal-body">
                <input
                  name="name"
                  placeholder="Patient Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="form-control fs-6 mb-3"
                />
                <input
                name="email"
                placeholder="Patient Email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="form-control fs-6 mb-3"
              />

              <input
                name="disease"
                placeholder="Disease"
                value={form.disease}
                onChange={handleChange}
                required
                className="form-control fs-6 mb-3"
              />
               {!editingPatient && (
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password (optional, default: 123456)"
                  className="form-control fs-6 mb-3"
                />
              )}
              </div>


              

             

              <div className="d-flex justify-content-center gap-3 mt-4">
                
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary text-white w-100 h-30"
                >
                  {loading
                    ? editingPatient
                      ? "Updating..."
                      : "Adding..."
                    : editingPatient
                      ? "Update Patient"
                      : "Add Patient"}            </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AddPatientModal;
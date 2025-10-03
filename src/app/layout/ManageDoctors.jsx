"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AddDoctorModal from "@/app/components/modals/AddDoctorModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import { set } from "mongoose";
const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const[loading,setLoading]=useState(false);
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/doctors");
      setDoctors(res.data.data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (!id) {
      alert("Doctor ID is missing!");
      return;
    }

    if (!confirm("Are you sure you want to delete this doctor?")) return;

    try {
      const response = await fetch(`/api/doctors/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setDoctors((prev) => prev.filter((doctors) => doctors._id !== id));
      } else {
        alert(data.message || "Failed to delete doctor");
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Something went wrong while deleting the doctor");
    }
  };
  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="container bg-white p-5 shadow-lg ">
      {/* Header */}
      <div className="d-flex justify-content-between items-center mb-4">
        <h2 className="fs-2 fw-bold text-primary">Manage Doctors</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary w-40"
        >
          + Add New Doctor
        </button>
      </div>

      {/* Doctors Table */}
      <table className="table  w-full">
        <thead className="table-primary">
          <tr>
            <th className="col">Name</th>
            <th className="col">Specialization</th>
            <th className="col">Email</th>
            <th className="col align-items-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <tr
                key={doctor._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="col">{doctor.name}</td>
                <td className="col">{doctor.specialization}</td>
                <td className="col">{doctor.email}</td>
                <td className="col d-flex justify-content-center align-items-center mr-10">
                  <button
                    onClick={() => handleDelete(doctor._id)}
                    className="btn text-danger "
                  >
                    <FaTrash size={18} />
                  </button>

                  <button
                    onClick={() => {
                      setEditingDoctor(doctor);
                      setIsModalOpen(true);
                    }}
                    className="btn btn-text-primary "
                  >
                    <FaEdit size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center text-gray-500 py-4 italic">
                {loading ? "Loading..." : " No doctors found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <AddDoctorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDoctor(null);
        }}
        fetchDoctors={fetchDoctors}
        editingDoctor={editingDoctor}
      />

    </div>
  );
};

export default ManageDoctors;

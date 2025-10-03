"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AddPatientModal from "@/app/components/modals/AddPatientModal";
import { FaTrash, FaEdit } from "react-icons/fa";
import { set } from "mongoose";

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/patients");
      setPatients(res.data.data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]);
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (!id) {
      alert("Patient ID is missing!");
      return;
    }

    if (!confirm("Are you sure you want to delete this patient?")) return;

    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setPatients((prev) => prev.filter((patients) => patients._id !== id));
      } else {
        alert(data.message || "Failed to delete patient");
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Something went wrong while deleting the patient");
    }
  };


  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="container bg-white p-5 shadow-lg">
      <div className="d-flex justify-content-between items-center mb-4">
        <h2 className="fw-bold fs-2 text-primary">Manage Patients</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          + Add New Patient
        </button>
      </div>

      {/* Patients Table */}
      <table className="table w-full">
        <thead className="table-primary">
          <tr>
            <th className="col">Name</th>
            <th className="col">Email</th>
            <th className="col">Disease</th>
            <th className="col">Assigned Doctor</th>
            <th className="col">Actions</th>

          </tr>
        </thead>
        <tbody>
          {patients.length > 0 ? (
            patients.map((p) => (
              <tr key={p._id} className="hover:bg-secondary">
                <td className="col">{p.name}</td>
                <td className="col">{p.email}</td>
                <td className="col">{p.disease}</td>
                <td className="col">

                  {p.assignedDoctor ? p.assignedDoctor.name : "Not Assigned"}


                </td>

                <td className=" d-flex justify-content-center align-items-center gap-2">
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="btn text-danger "
                  >
                    <FaTrash size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingPatient(p);
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
              <td colSpan="4" className="text-center text-gray-500 py-4 italic">
               {loading?"Loading...":"No records Found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <AddPatientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPatient(null);
        }}
        fetchPatients={fetchPatients}
        editingPatient={editingPatient}
      />
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AssignDoctor() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchPatients = async () => {
    try {
      const res = await axios.get("/api/patients");
      setPatients(res.data.data || []);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setPatients([]);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("/api/doctors");
      setDoctors(res.data.data || []);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setDoctors([]);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const handleAssign = async () => {
    if (!selectedPatient || !selectedDoctor) {
      setMessage("Please select both patient and doctor.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/assign-doctor", {
        patientId: selectedPatient,
        doctorId: selectedDoctor,
      });

      if (res.data.success) {
        setMessage(" Doctor assigned successfully!");
        fetchPatients(); 
      } else {
        setMessage(" Failed to assign doctor.");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Error assigning doctor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container bg-white shadow-lg p-5 ">
      <h2 className="fs-2 fw-bold text-primary mb-5">Assign Doctor to Patient</h2>

      <label className="form-label text-primary">Select Patient:</label>
      <select
        value={selectedPatient}
        onChange={(e) => setSelectedPatient(e.target.value)}
        className="form-select mb-4"
      >
        <option value="">-- Select Patient --</option>
        {Array.isArray(patients) && patients.length > 0 ? (
          patients.map((patient) => (
            <option key={patient._id} value={patient._id}>
              {patient.name} ({patient.email})
            </option>
          ))
        ) : (
          <option disabled>No patients found</option>
        )}
      </select>

      <label className="form-label text-primary">Select Doctor:</label>
      <select
        value={selectedDoctor}
        onChange={(e) => setSelectedDoctor(e.target.value)}
        className="form-select mb-4"
      >
        <option value="">-- Select Doctor --</option>
        {Array.isArray(doctors) && doctors.length > 0 ? (
          doctors.map((doctor) => (
            <option key={doctor._id} value={doctor._id}>
              {doctor.name} ({doctor.specialization})
            </option>
          ))
        ) : (
          <option disabled>No doctors found</option>
        )}
      </select>

      <button
        onClick={handleAssign}
        disabled={loading}
        className="btn btn-primary w-full mt-3 h-10"
      >
        {loading ? "Assigning..." : "Assign Doctor"}
      </button>

      {message && (
        <p className="mt-4 text-center fw-normal text-secondary">{message}</p>
      )}
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";

export default function DoctorNotes() {
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [loading, setLoading] = useState(false);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    const fetchPatients = async () => {
      const doctorId = localStorage.getItem("doctorId");
      if (!doctorId) return;

      try {
        const res = await fetch(`/api/doctor/patients?doctorId=${doctorId}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.patients)) {
          setPatients(data.patients);
        } else {
          setPatients([]);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const fetchNotes = async (patientId) => {
    try {
      const res = await axios.get(`/api/doctor/notes?patientId=${patientId}`);
      setSavedNotes(res.data.data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    if (selectedPatient) {
      fetchNotes(selectedPatient);
    } else {
      setSavedNotes([]);
    }
  }, [selectedPatient]);

  const handleSave = async () => {
    const doctorId = localStorage.getItem("doctorId");

    if (!doctorId || !selectedPatient) {
      alert("Please select a patient and make sure doctor is logged in!");
      return;
    }

    if (!notes && !transcript) {
      alert("Please add notes before saving!");
      return;
    }

    try {
      setLoading(true);
      const finalNotes = notes.trim() + " " + transcript.trim();

      const res = await axios.post("/api/doctor/notes", {
        patientId: selectedPatient,
        doctorId,
        notes: finalNotes,
      });

      alert("Patient notes saved successfully!");
      setNotes("");
      resetTranscript();
      fetchNotes(selectedPatient);
    } catch (error) {
      console.error("Error saving notes:", error);
      alert("Failed to save notes!");
    } finally {
      setLoading(false);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <p className="text-danger">Your browser does not support speech recognition.</p>;
  }

  return (
    <div className="container bg-white shadow-lg rounded-lg text-primary p-6"
     >
      <h2 className="text-2xl fw-bold text-primary mb-4"
      
      >🩺 Doctor’s Voice Notes</h2>

      {/* Patient Dropdown */}
      <select
        value={selectedPatient}
        onChange={(e) => setSelectedPatient(e.target.value)}
        className="form-select fs-6 mb-4"
      >
        <option value="">Select Patient</option>
        {patients.length > 0 ? (
          patients.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} — {p.disease}
            </option>
          ))
        ) : (
          <option disabled>No patients assigned</option>
        )}
      </select>

      {/* Notes Input */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Type patient notes here..."
        className="form-control fs-6 text-primary mb-4"
        
        rows="4"
      />

      {transcript && (
        <div className="mb-3 p-3 rounded text-primary"
        style={{ backgroundColor: "#e0f2fe" }}>
          <strong>🎤 Transcript:</strong> {transcript}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 justify-center mb-6">
        {!listening ? (
          <button
            onClick={() => SpeechRecognition.startListening({ continuous: true })}
            className="px-5 bg-success-700 text-white rounded"
          >
            🎙️
          </button>
        ) : (
          <button
            onClick={SpeechRecognition.stopListening}
            className="py-2 bg-danger-500 text-white rounded-lg"
          >
            🛑 
          </button>
        )}

        <button
          onClick={resetTranscript}
          
          className="py-2 bg-primary-500 text-white rounded-lg"
        >
          🔄 
        </button>

        <button
          onClick={handleSave}
          disabled={(!selectedPatient) && !(notes || transcript)}
          className="px-5 py-2 bg-secondary-500 text-white rounded-lg"
        >
          {loading ? "⏳ Saving..." : "💾 Save Notes"}
        </button>
      </div>

      
    </div>
  );
}

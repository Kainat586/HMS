"use client";
import React, { useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import ReactMarkdown from "react-markdown";

export default function DoctorReportsPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [notes, setNotes] = useState("");
  const [report, setReport] = useState("");
  const [reports, setReports] = useState([]);

  const doctorId = localStorage.getItem("doctorId");
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (!doctorId) return;
    fetch(`/api/doctor/patients?doctorId=${doctorId}`)
      .then((res) => res.json())
      .then((data) => setPatients(data.patients || []))
      .catch(console.error);
  }, [doctorId]);

  useEffect(() => {
    if (!selectedPatient) return;
    fetch(`/api/patient-reports?patientId=${selectedPatient}`)
      .then((res) => res.json())
      .then((data) => setReports(data.reports || []))
      .catch(console.error);
  }, [selectedPatient]);

  const handleGenerate = async () => {
    const res = await fetch("/api/generate-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientName: patients.find((p) => p._id === selectedPatient)?.name,
        disease: patients.find((p) => p._id === selectedPatient)?.disease,
        notes: notes || transcript,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setReport(data.report);
    } else {
      alert("Failed to generate report");
    }
  };

  const handleSave = async () => {
    const res = await fetch("/api/patient-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorId, patientId: selectedPatient, report }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Report saved!");
      setReports([data.data, ...reports]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg text-primary p-6"
    >
      <h2 className="mb-4 fw-bold text-primary"
      >Doctor Reports</h2>

      <div className="mb-3">
        <select
          className="form-control fs-6 text-primary mb-4"

          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} — {p.disease}
            </option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div className="mb-3">
        <textarea
          className="form-control text-primary fs-6"

          rows="4"
          placeholder="Type or dictate notes..."
          value={notes || transcript}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-center gap-4 m-5">
        {!listening ? (
          <button
            onClick={() => SpeechRecognition.startListening({ continuous: true })}
            className="btn btn-success"
          >
            🎙️
          </button>
        ) : (
          <button
            onClick={SpeechRecognition.stopListening}
            className="btn btn-danger"
          >
            🛑
          </button>
        )}
        <button onClick={resetTranscript} className="btn btn-secondary">
          🔄
        </button>
        <button
          onClick={handleGenerate}
          className="btn btn-primary"
          disabled={!selectedPatient || !(notes || transcript)}
        >
          ⚡
        </button>

      </div>

      {/* Generated Report */}
      {report && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">📑 Generated Report</h5>
            <div className="card-text">
              <ReactMarkdown>{report}</ReactMarkdown>
            </div>
            <div className="mt-3">
              <button onClick={handleSave} className="btn btn-warning">
                💾 Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

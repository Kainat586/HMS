"use client";
import { set } from "mongoose";
import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
export default function MedicalHistory() {
    const [history, setHistory] = useState({ patients: [], notes: [] });
    const [search, setsearch] = useState("");
    const [filteredNotes, setfilteredNotes] = useState([]);
    const[loading,setLoading]=useState(false);

   useEffect(() => {
    setLoading(true);
    const fetchHistory = async () => {
        const doctorId = localStorage.getItem("doctorId");
        const res = await fetch(`/api/doctor/history?doctorId=${doctorId}`);
        const data = await res.json();
        
        if (data.success && data.patients) {
            // New logic: Flatten the notes from the patient array
            
            
            // Set the notes property in the history state
            setHistory(data);
            setLoading(false);
        }
    };
    fetchHistory();
}, []);
    useEffect(() => {
        setLoading(true);
        if (search.trim() === "") {
            setfilteredNotes(history.notes);
        } else {
            const filtered = history.notes.filter((n) =>
                n.patientId?.name?.toLowerCase().includes(search.toLowerCase())
            );
            setfilteredNotes(filtered);
            setLoading(false);
        }
    }, [search, history.notes]);

    return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6"
        style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
           
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold ml-2 text-primary fs-2"
                    >Medical Records</h2>

                <div className="d-flex align-items-center gap-2">
                    <div className="input-group">
                      
                        <span className="input-group-text bg-white">
                            <i className="bi bi-search"></i>
                        </span>

                        
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setsearch(e.target.value)}
                            placeholder="Search by patient name..."
                            className="form-control"
                        />
                    </div>
                </div>

            </div>


            <table className="table  w-full">
                <thead className="table-primary">
                    <tr >
                        <th className="col">Patient Name</th>
                        <th className="col">Patient Email</th>
                        <th className="col">Disease</th>
                        <th className="col">Note</th>
                        <th className="col">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredNotes.length > 0 ? (
                        filteredNotes.map((n) => (
                            <tr key={n._id}>
                                <td className="col">{n.patientId?.name}</td>
                                <td className="col">{n.patientId?.email}</td>
                                <td className="col">{n.patientId?.disease}</td>
                                <td className="col">{n.note}</td>
                                <td className="col">
                                    {new Date(n.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="4"
                                className="text-center text-gray-500 py-4 italic"
                            >
                                {loading ? "Loading..." : " No records found"}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

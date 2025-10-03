"use client"
import { connectToDatabase } from "@/lib/mongodb"
import { useEffect, useState } from "react";
import axios from "axios";
export default function BookAppointments() {
   
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedDate, setDate] = useState("");
    const [selectedTime, setTime] = useState("");
      const [loading, setLoading] = useState(false);
    
    const patientId = typeof window !== "undefined" ? localStorage.getItem("patientId") : null;
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
        fetchDoctors();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDoctor || !selectedDate || !selectedTime) {
            alert("Please fill all fields.");
            return;
        }

        if (!patientId) {
            alert("Patient not logged in!");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post("/api/patients/book-appointment", {
                doctorId: selectedDoctor,
                patientId, 
                appointmentDate:selectedDate,
                appointmentTime:selectedTime,
            });

            if (res.data.success) {
                alert(" Appointment booked successfully!");
                setSelectedDoctor("");
                setDate("");
                setTime("");
            } else {
                alert("Failed to book appointment!");
            }
        } catch (err) {
            console.error("Error booking appointment:", err);
            alert(" Error booking appointment!");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="container bg-white shadow-lg p-6">
            <h2 className="fw-bold fs-2 text-primary p-6">
                 Book Appointment
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Select Doctor */}
                <div>
                    <label className="form-label p-2">👨‍⚕️ Select Doctor</label>
                    <select
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        className="form-select mb-4"
                    >
                        <option value="">Choose a doctor</option>
                        {doctors.map((doc) => (
                            <option key={doc._id} value={doc._id}>
                                {doc.name} — {doc.specialization}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date */}
                <div>
                    <label className="form-label ">📆 Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setDate(e.target.value)}
                        className="form-select mb-4"
                    />
                </div>

                {/* Time */}
                <div>
                    <label className="form-label">⏰ Time</label>
                    <input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setTime(e.target.value)}
                        className="form-select mb-4"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full mt-3 h-10"
                >
                    {loading ? "⏳ Booking..." : "✅ Book Appointment"}
                </button>
            </form>
        </div>
    );

}
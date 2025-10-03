"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userId = localStorage.getItem("userId"); 
        if (!userId) {
          setError("Doctor userId not found in localStorage");
          return;
        }

        const res = await axios.get(`/api/doctors/appointments?userId=${userId}`);
        if (res.data.success) {
          setAppointments(res.data.appointments);
        } else {
          setError(res.data.message || "Failed to fetch appointments");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Server error while fetching appointments");
      }
    };

    fetchAppointments();
  }, []);

  return (
   <div className="container bg-white p-4 rounded shadow">
  <h2 className="fs-2 fw-bold mb-4 text-primary"
  >Doctor Appointments</h2>

  {error && <p className="text-danger">{error}</p>}

  {appointments.length > 0 ? (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead className="table-primary">
          <tr>
            <th scope="col">Patient</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt._id}>
              <td>{appt.patientId?.name || "N/A"}</td>
              <td>{new Date(appt.appointmentDate).toLocaleDateString()}</td>
              <td>{appt.appointmentTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    !error && (
      <p className="fs-5 text-center text-primary">No appointments found.</p>
    )
  )}
</div>

  );
}

import { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';
import { MdDescription } from 'react-icons/md';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDisease } from '@fortawesome/free-solid-svg-icons';
import StatsCard from '../layout/statscard';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from "chart.js";

export default function Statistics({ role, userId }) {
  const [doctorStates, setdoctorStates] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    doctorStates: [],
  });
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalReports: 0,
    topDisease: "N/A",
  });
  const [reports, setreports] = useState([]);
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  )
  const [doctorId, setDoctorId] = useState(null);

  const fetchPatients = async () => {
    try {
      const res = await axios.get('/api/admin/stats/overview');
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };
const fetchDoctors = async () => {
        try {
          const userId = localStorage.getItem("userId");
          if (!userId) {
            setError("Doctor userId not found in localStorage");
            return;
          }
          const res = await axios.get(`/api/admin/patientsreports`);
          setreports(res.data.data);

        }
        catch (error) {
          console.error("Error fetching reports",error);
        }
      };
  useEffect(() => {
    if (role === "doctor") {
      
      const fetchReports = async () => {

        try {
          const userId = localStorage.getItem("userId");
          if (!userId) {
            setError("Doctor userId not found in localStorage");
            return;
          }
          const res = await axios.get(`/api/doctors/reports?userId=${userId}`);
          setdoctorStates(res.data.data);
        } catch (error) {
          console.error("Error fetching reports:", error);
        }
      };
      fetchReports();

    }
    if (role === "admin") {
      fetchPatients();
      fetchDoctors();
    }
  }, [role, userId]);

  const chartData = {
    labels: (doctorStates.diseaseStats || []).map((d) => d._id || "Unknown"),
    datasets: [
      {
        label: "Patients per Disease",
        data: (doctorStates.diseaseStats || []).map((d) => d.count),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
    ],
  };
const doctorData = {
    labels: (reports || []).map((r) => r.doctorName || "Unknown"), // Correct: Labels are the doctor's name
    datasets: [
        {
            label: "Patients per Doctor", // This is the label for the dataset
            data: (reports || []).map((r) => r.totalpatients), // Correct: Data is the numerical patient count
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
        },
    ],
};

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Desease Distribution among Ptaients" },
    }
  };


  return (
    <div className="row g-4">
      {role === "admin" && (
        <>
          <div className="col-md-6">
            <StatsCard title="Total Doctors" value={stats.totalDoctors} image={<FaUser size={17} />} />
          </div>

          <div className="col-md-6">
            <StatsCard title="Total Patients" value={stats.totalPatients} image={<FaUser size={17} />} />
          </div>

          <div className="col-md-6">
            <StatsCard title="Total Reports" value={stats.totalReports} image={<MdDescription size={17} />} />
          </div>

          <div className="col-md-6">
            <StatsCard title="Common Disease" value={stats.topDisease} image={<FontAwesomeIcon icon={faDisease} style={{ fontSize: "20px" }} />} />
          </div>
          
          <div className="card shadow-sm p-4 mt-4">
            <Bar data={doctorData} options={chartOptions} />
          </div>
        </>
      )}

      {role === "doctor" && (
        <>
          <div className="col-md-6">
            <StatsCard
              title="Your Reports"
              value={doctorStates.totalReports || 0}
              image={<MdDescription size={17} />}
            />
          </div>
          <div className="col-md-6">
            <StatsCard
              title="Your Patients"
              value={doctorStates.totalPatients || 0}
              image={<FaUser size={17} />}
            />
          </div>
          <div className="card shadow-sm p-4 mt-4">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </>
      )}
    </div>
  );
}

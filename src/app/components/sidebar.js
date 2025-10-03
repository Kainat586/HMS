"use client";

import { usePathname } from "next/navigation";
import {
  FaSignOutAlt,
  FaUserMd,
  FaUserInjured,
  FaNotesMedical,
  FaCalendarCheck,
  FaFileMedical, FaClipboardList, FaHistory,
  FaFile,

} from "react-icons/fa";

export default function Sidebar({ role, setActivePage, collapsed, setCollapsed }) {
  const pathname = usePathname();

  const adminLinks = [
    { key: "manage-doctors", label: "Manage Doctors", icon: <FaUserMd /> },
    { key: "manage-patients", label: "Manage Patients", icon: <FaUserInjured /> },
    { key: "assign-doctor", label: "Assign Doctor", icon: <FaUserInjured /> },
  ];

  const doctorLinks = [
    { key: "add-patient-notes", label: "Add Patient Notes", icon: <FaNotesMedical /> },
    { key: "view-appointments", label: "View Appointments", icon: <FaCalendarCheck /> },
    { key: "view-medical-history", label: "View Medical Records", icon: <FaFileMedical /> },
    { key: "generate-report", label: "Generate Report", icon: <FaClipboardList /> },
    { key: "check-previous-reports", label: "View Previous Reports", icon: <FaHistory /> },
  ];

  const patientLinks = [
    { key: "book-appointment", label: "Book Appointment", icon: <FaCalendarCheck /> },
  ];

  const links =
    role === "admin" ? adminLinks : role === "doctor" ? doctorLinks : patientLinks;

  return (
    <div
      className="d-flex flex-column justify-content-between position-fixed top-0 start-0 vh-100 shadow"
      style={{
        width: collapsed ? "80px" : "250px",
        background: "#ffffffff",
        transition: "width 0.3s",
        zIndex: 1030,
      }}
    >
      <div className="d-flex align-items-center justify-content-between p-3">
        {!collapsed && <h1 className="fs-5 fw-bold text-primary m-0"
        >🏥 HMS</h1>}
        <button
          className="btn btn-sm btn-light"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "➡" : "⬅"}
        </button>
      </div>

      <nav className="nav flex-column px-2 ">
        {links.map((link) => (
          <button
            key={link.key}
            onClick={() => setActivePage(link.key)}
            className="d-flex justify-content-between align-items-center text-primary mb-2 text-start w-100 fw-semibold border-0"
            style={{
              backgroundColor: "#ffff",
              padding: "10px 15px",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",

            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor="#c7bebeff", e.currentTarget.style.color = "#ffff")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff", e.currentTarget.style.color = "#fff")}          >
            
            {!collapsed && <span>{link.label}</span>}
            <span className="me-2">{link.icon}</span>
          </button>
        ))}
      </nav>


      <div className="border-top border-light p-3">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
          className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold"
        >
          <FaSignOutAlt />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}

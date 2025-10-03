"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import DoctorNotes from "../layout/DoctorNotes";
import AssignDoctor from "../layout/AssignDoctor";
import ManageDoctors from "../layout/ManageDoctors";
import ManagePatients from "../layout/ManagePatients";
import BookAppointments from "../layout/BookAppointments";
import DoctorAppointments from "../layout/DoctorAppointments";
import MedicalHistory from "../components/MedicalHistory";
import DoctorReportsPage from "../components/GenerateReport";
import ViewNotes from "../components/ViewNotes";
import Statistics from "../components/statics";

export default function DashboardLayout() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  const renderContent = () => {
    if (activePage === "add-patient-notes") return <DoctorNotes />;
    if (activePage === "assign-doctor") return <AssignDoctor />;
    if (activePage === "manage-doctors") return <ManageDoctors />;
    if (activePage === "manage-patients") return <ManagePatients />;
    if (activePage === "book-appointment") return <BookAppointments />;
    if (activePage === "view-appointments") return <DoctorAppointments />;
    if (activePage === "view-medical-history") return <MedicalHistory />;
    if (activePage === "generate-report") return <DoctorReportsPage />;
    if (activePage === "check-previous-reports") return <ViewNotes />;

    return (
      // <div className="d-flex flex-column justify-content-center align-items-center">
        
    
<div className="d-flex flex-column ">
          {user.role === "admin" && <Statistics role="admin" />}
          {user.role === "doctor" && <Statistics role={user.role}  />
 }
        
       </div>
    );
  };

  return (
    <div className="container-flex">
      <Navbar user={user} collapsed={collapsed} />
      <div className="d-flex flex-column">
        <Sidebar
          role={user.role}
          setActivePage={setActivePage}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main
          style={{
            marginLeft: collapsed ? "80px" : "250px",
            transition: "margin-left 0.3s",
            marginTop: "56px",
          }}
          className="flex-grow-1 p-4"
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

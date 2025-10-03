'use client';

import { useEffect, useState } from "react";
import DoctorNotes from "@/app/layout/DoctorNotes";

const DoctorPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <p className="text-center mt-10 text-red-500">Loading doctor data...</p>;
  }

  return (
    <DoctorNotes doctorId={user?._id} />
  );
};

export default DoctorPage;

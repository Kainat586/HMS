"use client";

import Link from "next/link";

export default function Navbar({ user, collapsed }) {
  return (
    <nav
      className={`navbar sticky-top border-bottom px-4 bg-white shadow-sm`}
      style={{
        marginLeft: collapsed ? "4px" : "250px", 
        transition: "margin-left 0.3s",
        height: "56px",
      }}
    >
      <div className="container-fluid d-flex justify-content-end">
        <div className="d-flex align-items-center gap-3">
          <span className="fw-semibold fs-6 text-dark">
            Hi, <span className="text-primary">{user?.name || "Guest"}</span>
          </span>
          <span className="badge bg-primary text-uppercase px-3 py-2">
            {user?.role || "GUEST"}
          </span>
        </div>
      </div>
    </nav>
  );
}

"use client";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function ViewNotes() {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState("");
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedReport, setSelectedReport] = useState(null);

    // ✅ Fetch patients for dropdown
    useEffect(() => {
        async function fetchPatients() {
            try {
                const res = await fetch(`/api/doctor/patients?doctorId=68c40483f00cd4453d7f071e`);
                const data = await res.json();
                if (data.success) setPatients(data.patients);
            } catch (err) {
                console.error("Failed to fetch patients:", err);
            }
        }
        fetchPatients();
    }, []);

    // ✅ Fetch reports when patient changes
    useEffect(() => {
        if (!selectedPatient) return;
        async function fetchReports() {
            setLoading(true);
            try {
                const res = await fetch(`/api/patient-reports?patientId=${selectedPatient}`);
                const data = await res.json();
                if (data.success) setReports(data.reports);
            } catch (err) {
                console.error("Failed to fetch reports:", err);
            }
            setLoading(false);
        }
        fetchReports();
    }, [selectedPatient]);

    // ✅ Filter reports by search
    const filteredReports = reports.filter((r) =>
        r.patient?.name?.toLowerCase().includes(search.toLowerCase())
    );

    // ✅ Download PDF
    const downloadPDF = (reportObj) => {
        const doc = new jsPDF();
        const margin = 15;
        let y = 20;

        doc.setFontSize(18);
        doc.text("Medical Report", margin, y);
        y += 15;

        doc.setFontSize(12);
        doc.text(`Patient: ${reportObj.patient?.name || "N/A"}`, margin, y);
        y += 7;
        doc.text(`Disease: ${reportObj.patient?.disease || "N/A"}`, margin, y);
        y += 7;
        doc.text(
            `Doctor: ${reportObj.doctor?.name || "N/A"} (${reportObj.doctor?.specialization || "N/A"})`,
            margin,
            y
        );
        y += 15;

        doc.setFontSize(14);
        doc.text("Report Content:", margin, y);
        y += 10;

        doc.setFontSize(12);
        const splitReport = doc.splitTextToSize(reportObj.report, 180);
        doc.text(splitReport, margin, y);

        const filename = `${reportObj.patient?.name || "Patient"}-Report.pdf`;
        doc.save(filename);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-primary mb-4">Medical Records</h2>

            {/* Patient Dropdown */}
            <div className="d-flex justify-content-between mb-3">
  {/* Patient Dropdown */}
  <select
    className="form-select w-25"
    value={selectedPatient}
    onChange={(e) => setSelectedPatient(e.target.value)}
  >
    <option value="">Select Patient</option>
    {patients
      .filter((p) => p?.patient) // only keep valid patient entries
      .map((p) => (
        <option key={p.patient._id} value={p.patient._id}>
          {p.patient.name} — {p.patient.disease}
        </option>
      ))}
  </select>

  {/* Search box */}
  <input
    type="text"
    className="form-control w-25"
    placeholder="Search patient..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>


            {/* Reports Table */}
            <div className="card shadow-sm">
                <div className="card-body">
                    <table className="table table-bordered">
                        <thead className="table-primary">
                            <tr>
                                <th>Patient</th>
                                <th>Disease</th>
                                <th>Report Preview</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center text-primary">
                                        Loading...
                                    </td>
                                </tr>
                            ) : filteredReports.length > 0 ? (
                                filteredReports.map((r) => (
                                    <tr key={r._id}>
                                        <td>{r.patient?.name}</td>
                                        <td>{r.patient?.disease}</td>
                                        <td>
                                            {r.report.length > 40
                                                ? r.report.substring(0, 40) + "..."
                                                : r.report}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-info me-2"
                                                onClick={() => setSelectedReport(r)}
                                            >
                                                View
                                            </button>
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => downloadPDF(r)}
                                            >
                                                Download PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted">
                                        No reports found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Report Modal */}
            {selectedReport && (
                <div
                    className="modal show fade d-block"
                    tabIndex="-1"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Report Details</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setSelectedReport(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    <strong>Patient:</strong> {selectedReport.patient?.name}
                                </p>
                                <p>
                                    <strong>Disease:</strong> {selectedReport.patient?.disease}
                                </p>
                                <p>
                                    <strong>Doctor:</strong>{" "}
                                    {selectedReport.doctor?.name} (
                                    {selectedReport.doctor?.specialization})
                                </p>
                                <hr />
                                <p>{selectedReport.report}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

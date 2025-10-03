import mongoose from "mongoose";

const PatientReportSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    report: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.PatientReport ||
  mongoose.model("PatientReport", PatientReportSchema);

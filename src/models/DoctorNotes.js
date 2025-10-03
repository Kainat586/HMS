import mongoose from "mongoose";

const DoctorNotesSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    notes: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.DoctorNotes ||
  mongoose.model("DoctorNotes", DoctorNotesSchema);

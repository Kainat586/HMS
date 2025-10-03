import mongoose, { Schema } from "mongoose";

const PatientSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    disease: { type: String },
    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
  },
  { timestamps: true }
);


export default mongoose.models.Patient || mongoose.model("Patient", PatientSchema);

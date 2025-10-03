import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['patient', 'doctor', 'admin'],
            default: "patient",
        },

    },
    { timestamps: true }
);
export default mongoose.models.User || mongoose.model("User", userSchema);
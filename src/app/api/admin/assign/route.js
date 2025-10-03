import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Patient from "@/models/Patient";
import User from "@/models/User";
import { assertIsAdmin } from "../_utils/auth";


export async function POST(req) {
// const gate = await assertIsAdmin(req); if (!gate.ok) return gate.res;
await connectToDatabase();
const { patientId, doctorId } = await req.json();
if (!patientId || !doctorId) return NextResponse.json({ success:false, message: "patientId and doctorId required" }, { status:400 });


const doctor = await User.findById(doctorId);
if (!doctor || doctor.role !== "doctor") return NextResponse.json({ success:false, message:"Doctor not found" }, { status:404 });


const updated = await Patient.findByIdAndUpdate(
patientId,
{ assignedDoctor: doctorId },
{ new: true }
).populate("userId assignedDoctor", "name email role");


if (!updated) return NextResponse.json({ success:false, message:"Patient not found" }, { status:404 });


return NextResponse.json({ success:true, data: updated });
}
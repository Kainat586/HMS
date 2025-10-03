import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Patient from "@/models/Patient";
import User from "@/models/User";



export async function POST(req) {
await connectToDatabase();
const { userId, disease } = await req.json();


if (!userId) return NextResponse.json({ success:false, message: "userId required" }, { status: 400 });


const user = await User.findById(userId);
if (!user) return NextResponse.json({ success:false, message: "User not found" }, { status: 404 });


if (user.role !== "patient") {
user.role = "patient";
await user.save();
}


const patient = await Patient.findOneAndUpdate(
{ userId },
{ userId, disease: disease || "Fever" },
{ upsert: true, new: true }
).populate("userId");


return NextResponse.json({ success: true, data: patient }, { status: 201 });
}
export async function GET(){
    await connectToDatabase();
    const patients = await User.find({ role: "patient" }).select("_id name email role");
    return NextResponse.json({ success: true, data: patients });
    
}
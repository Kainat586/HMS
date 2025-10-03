import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from '@/models/User';
export async function GET() {

await connectToDatabase();
const doctors = await User.find({ role: "doctor" }).select("_id name email role");
return NextResponse.json({ success: true, data: doctors });
}

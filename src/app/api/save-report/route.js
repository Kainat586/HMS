import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import DoctorNotes from "@/models/DoctorNotes";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { doctorId, patientId, report } = await req.json();

    if (!doctorId || !patientId || !report) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const newNote = await DoctorNotes.create({
      doctorId,
      patientId,
      notes: report,
    });

    return NextResponse.json({ success: true, data: newNote });
  } catch (error) {
    console.error("Error saving report:", error);
    return NextResponse.json({ success: false, message: "Failed to save report" }, { status: 500 });
  }
}

import { connectToDatabase } from "@/lib/mongodb";
import DoctorNotes from "@/models/DoctorNotes";
import Doctor from "@/models/Doctor";
import mongoose from "mongoose";


export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    if (!patientId) {
      return Response.json({ success: false, message: "Patient ID is required" }, { status: 400 });
    }
    const patientObject= new mongoose.Types.ObjectId(patientId);
    const notes= await DoctorNotes.aggregate([
      {
        $match:{
          patientId:patientObject
        }
      },
      {
        $sort:{
          createdAt:-1
        }
      }
    ]);
    return Response.json({ success: true, data: notes }, { status: 200 });
  } catch (error) {
    console.error(" Error fetching notes:", error);
    return Response.json({ success: false, message: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { patientId, doctorId, notes } = await req.json(); 

    if (!patientId || !doctorId || !notes) {
      return Response.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    const doctor = await Doctor.findOne({ _id: doctorId });
    if (!doctor) {
      return Response.json({ success: false, message: "Doctor record not found" }, { status: 404 });
    }

    const newNote = await DoctorNotes.create({
      patientId,
      doctorId: doctor._id,
      notes,
    });

    return Response.json(
      { success: true, message: "Note saved successfully", data: newNote },
      { status: 201 }
    );
  } catch (error) {
    console.error(" Error saving notes:", error);
    return Response.json({ success: false, message: "Failed to save notes" }, { status: 500 });
  }
}

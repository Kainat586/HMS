import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import Appointment from "@/models/Appointment";

export async function GET(req) {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json(
            { success: false, message: "userId is required" },
            { status: 400 }
        );
    }

    try {
       
        const doctor = await Doctor.findOne({ userId });
        if (!doctor) {
            return NextResponse.json(
                { success: false, message: "Doctor not found for given userId" },
                { status: 404 }
            );
        }
        const appointments = await Appointment.find({ doctorId: doctor._id })
            .populate("patientId", "name email"); 
 
        
        console.log("Appointments with populated patient:", appointments);

        return NextResponse.json({ success: true, appointments }, { status: 200 });
    } catch (error) {
        console.error("Fetch Appointments Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

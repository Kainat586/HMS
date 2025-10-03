import { connectToDatabase } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { patientId, doctorId, appointmentDate, appointmentTime } = await req.json();

    const appointment = new Appointment({
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
    });

    await appointment.save();

    return new Response(JSON.stringify({ success: true, appointment }), { status: 201 });
  } catch (error) {
    console.error("Book Appointment Error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
}

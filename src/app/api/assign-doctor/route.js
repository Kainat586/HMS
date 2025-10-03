import { connectToDatabase } from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import Patient from "@/models/Patient";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { patientId, doctorId } = await req.json();

    // ✅ Find doctor by ID
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return new Response(
        JSON.stringify({ success: false, message: "Doctor not found" }),
        { status: 404 }
      );
    }

    // ✅ Assign doctor._id, NOT doctor.userId
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { assignedDoctor: doctor._id },
      { new: true }
    ).populate("assignedDoctor"); // ✅ populate for confirmation

    return new Response(
      JSON.stringify({ success: true, data: updatedPatient }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error assigning doctor:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to assign doctor" }),
      { status: 500 }
    );
  }
}

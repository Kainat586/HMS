import { connectToDatabase } from "@/lib/mongodb";
import Patient from "@/models/Patient";
import Doctor from "@/models/Doctor";
export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");

    if (!doctorId) {
      return new Response(
        JSON.stringify({ success: false, message: "doctorId is required" }),
        { status: 400 }
      );
    }

    const patients = await Patient.find({ assignedDoctor: doctorId }).populate("assignedDoctor");

    return new Response(
      JSON.stringify({ success: true, patients }), 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching patients:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch patients" }),
      { status: 500 }
    );
  }
}


export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const patient = await Patient.create(body);

    return new Response(JSON.stringify({ success: true, data: patient }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error adding patient:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to add patient" }),
      { status: 500 }
    );
  }
}

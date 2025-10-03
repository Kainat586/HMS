import {connectToDatabase} from "@/lib/mongodb";
import Patient from "@/models/Patient";

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;

    const deletedPatient = await Patient.findByIdAndDelete(id);

    if (!deletedPatient) {
      return new Response(
        JSON.stringify({ success: false, message: "Patient not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Patient deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting patient:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to delete patient" }),
      { status: 500 }
    );
  }
}
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    await connectToDatabase();

    const patient = await Patient.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!patient) {
      return new Response(JSON.stringify({ success: false, message: "Pateint not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true, data: patient }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    return new Response(JSON.stringify({ success: false, message: "Failed to update patient" }), {
      status: 500,
    });
  }
}

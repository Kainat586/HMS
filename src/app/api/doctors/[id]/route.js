import { connectToDatabase } from "@/lib/mongodb";
import Doctor from "@/models/Doctor";


export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    await connectToDatabase();

    const doctor = await Doctor.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!doctor) {
      return new Response(JSON.stringify({ success: false, message: "Doctor not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true, data: doctor }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating doctor:", error);
    return new Response(JSON.stringify({ success: false, message: "Failed to update doctor" }), {
      status: 500,
    });
  }
}



export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    console.log("Deleting Doctor ID:", id);

    await connectToDatabase();

    if (!id || id.length !== 24) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid doctor ID" }),
        { status: 400 }
      );
    }

    const deletedDoctor = await Doctor.findByIdAndDelete(id);

    if (!deletedDoctor) {
      return new Response(
        JSON.stringify({ success: false, message: "Doctor not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Doctor deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to delete doctor" }),
      { status: 500 }
    );
  }
}

import { connectToDatabase } from "@/lib/mongodb";
import Patient from "@/models/Patient";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectToDatabase();
    const patients = await Patient.find().populate("assignedDoctor");
    return new Response(JSON.stringify({ success: true, data: patients }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return new Response(JSON.stringify({ success: false, message: "Failed to fetch patients" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { name, disease, email, password } = body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ success: false, message: "Patient with this email already exists!" }),
        { status: 400 }
      );
    }
    const defaultPassword = password || "123456";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "patient",
    });
    const patient = await Patient.create({
      name,
      disease,
      email,
      assignedDoctor:null,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Patient added successfully!",
        data: patient,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding patient:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to add patient" }),
      { status: 500 }
    );
  }
}

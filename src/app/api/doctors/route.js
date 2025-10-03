import { connectToDatabase } from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import User from "@/models/User";
import bcrypt from "bcryptjs";

//Get all doctors
export async function GET() {
  try {
    await connectToDatabase();
    const doctors = await Doctor.find();
    return new Response(JSON.stringify({ success: true, data: doctors }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return new Response(JSON.stringify({ success: false, message: "Failed to fetch doctors" }), {
      status: 500,
    });
  }
}

// Add a new doctor
export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { name, specialization, email, password } = body;
// Validate required fields
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ success: false, message: "Doctor with this email already exists!" }),
        { status: 400 }
      );
    }

    // ✅ Hash password (if provided, otherwise use default)
    const defaultPassword = password || "123456";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // ✅ Create User account for login
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
    });

    
    const doctor = await Doctor.create({
      name,
      specialization,
      email,
      userId: newUser._id,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Doctor added successfully!",
        data: doctor,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding doctor:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to add doctor" }),
      { status: 500 }
    );
  }
}

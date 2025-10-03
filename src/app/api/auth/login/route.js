import bcrypt from "bcryptjs";
import User from "@/models/User";
import Doctor from "@/models/Doctor";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found!" }),
        { status: 404 }
      );
    }

    // Password check
    let isMatch = false;
    if (user.password.startsWith("$2b$")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = password === user.password; // plain text fallback
    }

    if (!isMatch) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid credentials!" }),
        { status: 401 }
      );
    }

    // Extra data holder
    let extraData = {};

    if (user.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: user._id });
      if (doctor) {
        extraData.doctorId = doctor._id; 
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Login successful!",
        user,
        ...extraData,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 }
    );
  }
}

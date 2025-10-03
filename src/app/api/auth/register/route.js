import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
    try {
        await connectToDatabase();

        const { name, email, password, role } = await req.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ error: "User already exists." }, { status: 409 });
        }

        const newUser = new User({ name, email, password, role });
        await newUser.save();

        return NextResponse.json(
            { message: "User registered successfully.", user: { id: newUser._id, name, email, role } },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in registration:", error);
        return NextResponse.json({ error: "Internal server error.",details:error.message }, { status: 500 });
    }
}

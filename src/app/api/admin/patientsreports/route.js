import { connectToDatabase } from "@/lib/mongodb";

import Patient from "@/models/Patient";

import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDatabase();
        const reports = await Patient.aggregate([
            {
                $group: {
                    _id: "$assignedDoctor",
                    totalpatients: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "doctors",
                    localField: "_id",
                    foreignField: "_id",
                    as: "doctorInfo"
                }
            },
            { $unwind: "$doctorInfo" },
            {
                $project: {
                    doctorName: "$doctorInfo.name",
                    doctorEmail: "$doctorInfo.email",
                    totalpatients: 1,
                }
            }
        ]);
      

        return NextResponse.json({ success: true, data: reports }, { status: 200 });
    }
    catch (error) {
        console.error("Error fetching patient reports:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch patient reports" }, { status: 500 });
    }
}
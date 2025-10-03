import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import PatientReport from "@/models/PatientReport";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { doctorId, patientId, report } = await req.json();

    if (!doctorId || !patientId || !report) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const newReport = await PatientReport.create({ doctorId, patientId, report });

    return NextResponse.json({ success: true, data: newReport });
  } catch (err) {
    console.error(" Save report failed:", err);
    return NextResponse.json({ success: false, message: "Failed to save report" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    let query = {};
    if (patientId) {
      query.patientId = patientId;
    }
    const reports = await PatientReport.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "patients",             // 👈 actual collection name
          localField: "patientId",
          foreignField: "_id",
          as: "patient"
        }
      },
      { $unwind: "$patient" },
      {
        $lookup: {
          from: "doctors",              // 👈 actual collection name
          localField: "doctorId",
          foreignField: "_id",
          as: "doctor"
        }
      },
      { $unwind: "$doctor" },
      {
        $project: {
          createdAt: 1,
          updatedAt: 1,
          "patient._id": 1,
          "patient.name": 1,
          "patient.disease": 1,
          "doctor._id": 1,
          "doctor.name": 1,
          "doctor.specialization": 1
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

console.log(reports);

    return NextResponse.json({ success: true, reports });
  } catch (err) {
    console.error("Fetch reports failed:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

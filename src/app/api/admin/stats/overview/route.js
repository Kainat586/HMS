// src/app/api/admin/stats/overview/route.js
import {connectToDatabase} from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import Patient from "@/models/Patient";
import PatientReport from "@/models/PatientReport";

export async function GET() {
  await connectToDatabase();

  try {
    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await Patient.countDocuments();
    const totalReports = await PatientReport.countDocuments();

    const topDiseaseAgg = await Patient.aggregate([
      { $match: { disease: { $exists: true, $ne: "" } } },
      { $group: { _id: "$disease", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const topDisease = topDiseaseAgg[0]?._id || "N/A";

    return new Response(
      JSON.stringify({
        success: true,
        totalDoctors,
        totalPatients,
        totalReports,
        topDisease,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch stats" }),
      { status: 500 }
    );
  }
}

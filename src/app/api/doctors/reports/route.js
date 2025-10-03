import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Patient from "@/models/Patient";
import Doctor from "@/models/Doctor";
import mongoose, { Mongoose } from "mongoose";

export async function GET(req) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ success: false, message: "doctorId is required" }, { status: 400 });
  }
  try {

   

    const doctorStats = await Doctor.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: 'patients',
          localField: '_id',
          foreignField: 'assignedDoctor',
          as: 'patients',
        },
      },
      {
        $unwind: {
          path: '$patients',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          totalPatients: { $sum: { $cond: [{ $ne: ['$patients._id', null] }, 1, 0] } },
          diseaseStats: {
            $push: '$patients.disease',
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalPatients: '$totalPatients',
          totalReports: '$totalPatients',
          diseaseStats: {
            $map: {
              input: { $setUnion: '$diseaseStats' },
              as: 'disease',
              in: {
                _id: '$$disease',
                count: {
                  $size: {
                    $filter: {
                      input: '$diseaseStats',
                      as: 'd',
                      cond: { $eq: ['$$d', '$$disease'] },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);
    console.log("doctorStats", doctorStats[0])
    return NextResponse.json(
      {
        success: true,
      
        data: {
          totalPatients:doctorStats[0]?.totalPatients || 0,
          totalReports: doctorStats[0]?.totalReports || 0,
          diseaseStats: doctorStats[0]?.diseaseStats||[],
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching patient reports:", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}

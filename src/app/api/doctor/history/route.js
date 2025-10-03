import { connectToDatabase } from "@/lib/mongodb";
import Patient from "@/models/Patient";
import DoctorNotes from "@/models/DoctorNotes";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");

    if (!doctorId) {
      return Response.json(
        { success: false, message: "Doctor ID is required" },
        { status: 400 }
      );
    }
    const id = new mongoose.Types.ObjectId(doctorId);
    const patients = await Patient.aggregate([
      {
        $match: {
          assignedDoctor: id,
        }
      },
      {
        $lookup: {
          from: `doctornotes`,
          localField: `_id`,
          foreignField: `patientId`,
          as: `notes`,
        }
      },
      {
        $lookup: {
          from: 'doctornotes',
          let: { patientId: '$_id', notes: '$notes' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$patientId', '$$patientId'] }
              }
            },
            {
              $lookup: {
                from: 'users', 
                localField: 'doctorId',
                foreignField: '_id',
                as: 'doctorInfo',
              }
            },
            { $unwind: { path: '$doctorInfo', preserveNullAndEmptyArrays: true } },
            {
              $project: {
                _id: 1,
                doctorId: 1,
                note:`$notes`,
                createdAt: 1,
                'doctorName': '$doctorInfo.name',
                'doctorSpecialization': '$doctorInfo.specialization',
              }
            },
            { $sort: { createdAt: -1 } } 
          ],
          as: 'notes' 
        }
      },
      {
        $project: {
          name: 1,
          disease: 1,
          email: 1,
          assignedDoctor: 1,
          notes: 1,
        }
      }
    ]);
    const allNotes = [];
    patients.forEach(patient => {
      (patient.notes || []).forEach(note => {
        allNotes.push({
          ...note,
          patientId: {
            name: patient.name,
            disease: patient.disease,
            email: patient.email
          }
        });
      });
    });

    allNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    console.log(patients[0]);
    console.log(allNotes);
    return Response.json(
      {
        success: true,
        patients: patients,
        notes: allNotes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching history:", error);
    return Response.json(
      { success: false, message: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

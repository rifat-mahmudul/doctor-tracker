import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Doctor } from "@/models/Doctor";
import { Patient } from "@/models/Patient";

export async function GET() {
  try {
    await connectDB();

    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await Patient.countDocuments();

    const patientsPerDoctor = await Patient.aggregate([
      {
        $group: {
          _id: "$doctorId",
          totalPatients: { $sum: 1 },
        },
      },
    ]);

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const recentPatients = await Patient.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalDoctors,
        totalPatients,
        patientsPerDoctor,
        recentPatients,
      },
    });
  } catch (error) {
    console.log("error form dashboard stats: ", error);
    return NextResponse.json(
      { message: "Failed to fetch dashboard stats" },
      { status: 500 },
    );
  }
}

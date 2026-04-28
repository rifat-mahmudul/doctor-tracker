import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Doctor } from "@/models/Doctor";
import { Patient } from "@/models/Patient";

export async function GET() {
  try {
    await connectDB();

    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await Patient.countDocuments();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeConsultations = await Patient.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const thirtyDaysAgoStart = new Date();
    thirtyDaysAgoStart.setDate(thirtyDaysAgoStart.getDate() - 30);
    
    const sixtyDaysAgoStart = new Date();
    sixtyDaysAgoStart.setDate(sixtyDaysAgoStart.getDate() - 60);
    
    const last30DaysCount = await Patient.countDocuments({
      createdAt: { $gte: thirtyDaysAgoStart }
    });
    
    const previous30DaysCount = await Patient.countDocuments({
      createdAt: { 
        $gte: sixtyDaysAgoStart, 
        $lt: thirtyDaysAgoStart 
      }
    });
    
    let monthlyGrowth = 0;
    if (previous30DaysCount > 0) {
      monthlyGrowth = Math.round(((last30DaysCount - previous30DaysCount) / previous30DaysCount) * 100);
    } else if (last30DaysCount > 0) {
      monthlyGrowth = 100;
    }

    const patientsPerDoctor = await Patient.aggregate([
      {
        $group: {
          _id: "$doctorId",
          totalPatients: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctorInfo"
        }
      },
      {
        $unwind: {
          path: "$doctorInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          name: { $ifNull: ["$doctorInfo.name", "Unassigned"] },
          specialization: { $ifNull: ["$doctorInfo.specialization", "N/A"] },
          totalPatients: 1
        }
      },
      { $sort: { totalPatients: -1 } },
      { $limit: 10 }
    ]);

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    last7Days.setHours(0, 0, 0, 0);

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

    const dateMap = new Map();
    recentPatients.forEach(item => {
      dateMap.set(item._id, item.count);
    });

    const patientTrends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      patientTrends.push({
        date: formattedDate,
        count: dateMap.get(dateString) || 0,
        fullDate: dateString
      });
    }

    const recentActivitiesData = await Patient.find()
      .populate('doctorId', 'name specialization')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentActivities = recentActivitiesData.map(patient => ({
      id: patient._id,
      type: 'admission',
      patientName: patient.name,
      doctorName: patient.doctorId?.name || 'Unassigned',
      condition: patient.condition || 'General',
      timestamp: patient.createdAt
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalDoctors,
        totalPatients,
        activeConsultations,
        monthlyGrowth,
        patientsPerDoctor,
        patientTrends,
        recentActivities
      },
    });
  } catch (error) {
    console.log("error from dashboard stats: ", error);
    return NextResponse.json(
      { message: "Failed to fetch dashboard stats" },
      { status: 500 },
    );
  }
}
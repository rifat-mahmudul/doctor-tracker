import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Doctor } from "@/models/Doctor";
import { Patient } from "@/models/Patient";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();

    const doctorId = params.id;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 },
      );
    }

    const patients = await Patient.find({ doctorId }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: {
        doctor,
        patients,
      },
    });
  } catch (error) {
    console.log("error from doctor details: ", error);
    return NextResponse.json(
      { message: "Failed to fetch doctor details" },
      { status: 500 },
    );
  }
}

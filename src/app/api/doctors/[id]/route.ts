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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Doctor ID is missing in request" },
        { status: 400 },
      );
    }

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 },
      );
    }

    const patients = await Patient.find({ doctorId: id }).sort({ createdAt: -1 });

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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Doctor ID is missing in request" },
        { status: 400 },
      );
    }

    const body = await req.json();

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true },
    );

    if (!updatedDoctor) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Doctor updated successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    console.error("Error updating doctor:", error);
    return NextResponse.json(
      { message: "Failed to update doctor" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Doctor ID is missing in request" },
        { status: 400 },
      );
    }

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 },
      );
    }

    await Doctor.findByIdAndDelete(id);

    await Patient.updateMany({ doctorId: id }, { $unset: { doctorId: "" } });

    return NextResponse.json({
      success: true,
      message: "Doctor deleted and patient assignments cleared",
    });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return NextResponse.json(
      { message: "Failed to delete doctor" },
      { status: 500 },
    );
  }
}

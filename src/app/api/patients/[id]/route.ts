import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Patient } from "@/models/Patient";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();

    const body = await req.json();
    const patientId = params.id;

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      {
        $set: body,
      },
      { new: true },
    );

    if (!updatedPatient) {
      return NextResponse.json(
        { message: "Patient not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedPatient,
    });
  } catch (error) {
    console.log("error from update patient: ", error);
    return NextResponse.json(
      { message: "Failed to update patient" },
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

    const patientId = params.id;

    const deleted = await Patient.findByIdAndDelete(patientId);

    if (!deleted) {
      return NextResponse.json(
        { message: "Patient not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    console.log("error from delete patient: ", error);
    return NextResponse.json(
      { message: "Failed to delete patient" },
      { status: 500 },
    );
  }
}

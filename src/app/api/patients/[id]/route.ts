import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
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
        { message: "Patient ID is missing in request" },
        { status: 400 },
      );
    }

    const patient = await Patient.findById(id).populate(
      "doctorId",
      "name specialization",
    );

    if (!patient) {
      console.log(`Patient with ID ${id} not found in DB`);
      return NextResponse.json(
        { message: "Patient not found in database" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.log("error from get single patient: ", error);
    return NextResponse.json(
      { message: "Internal Server Error or Invalid ID format" },
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

    const body = await req.json();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Patient ID is missing in request" },
        { status: 400 },
      );
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
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
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Patient ID is missing in request" },
        { status: 400 },
      );
    }

    const deleted = await Patient.findByIdAndDelete(id);

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

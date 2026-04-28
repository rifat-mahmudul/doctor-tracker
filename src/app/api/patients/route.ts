import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Patient } from "@/models/Patient";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const { name, condition, doctorId } = body;

    if (!name || !doctorId) {
      return NextResponse.json(
        { message: "Name and doctorId are required" },
        { status: 400 },
      );
    }

    const patient = await Patient.create({
      name,
      condition,
      doctorId,
    });

    return NextResponse.json(
      {
        success: true,
        data: patient,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("error from create patient: ", error);
    return NextResponse.json(
      { message: "Failed to create patient" },
      { status: 500 },
    );
  }
}

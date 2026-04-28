import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Patient } from "@/models/Patient";

export async function GET() {
  try {
    await connectDB();

    const conditions = await Patient.distinct("condition");

    return NextResponse.json({
      conditions: conditions.filter(Boolean).sort(),
    });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return NextResponse.json(
      { message: "Failed to fetch filter options" },
      { status: 500 },
    );
  }
}

import { connectDB } from "@/lib/db";
import { Doctor } from "@/models/Doctor";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const specializations = await Doctor.distinct("specialization");
    const hospitals = await Doctor.distinct("hospital");

    return NextResponse.json({
      specializations: specializations.sort(),
      hospitals: hospitals.sort(),
    });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return NextResponse.json(
      { message: "Failed to fetch filter options" },
      { status: 500 },
    );
  }
}

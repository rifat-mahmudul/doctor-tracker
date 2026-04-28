import { connectDB } from "@/lib/db";
import { Doctor } from "@/models/Doctor";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, specialization, hospital, phone, email } = body;

    if (!name || !specialization || !hospital) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const doctor = await Doctor.create({
      name,
      specialization,
      hospital,
      phone,
      email,
    });

    return NextResponse.json(
      {
        success: true,
        data: doctor,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("error from post doctor: ", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { hospital: { $regex: search, $options: "i" } },
      ];
    }

    const doctors = await Doctor.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Doctor.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: doctors,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log("error from get doctor: ", error);
    return NextResponse.json(
      { message: "Failed to fetch doctors" },
      { status: 500 },
    );
  }
}

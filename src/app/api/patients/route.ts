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

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const condition = searchParams.get("condition") || "";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (condition && condition !== "all") {
      query.condition = { $regex: new RegExp(`^${condition}$`, "i") };
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const patients = await Patient.find(query)
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Patient.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: patients,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log("error from get all patient: ", error);
    return NextResponse.json(
      { message: "Failed to fetch patients" },
      { status: 500 },
    );
  }
}

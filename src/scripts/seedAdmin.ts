import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  await connectDB();

  const existing = await User.findOne({ email: "admin@test.com" });

  if (existing) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(`${process.env.ADMIN_PASS}`, 10);

  await User.create({
    name: "Admin",
    email: `${process.env.ADMIN_EMAIL}`,
    password: hashedPassword,
    role: "admin",
  });

  console.log("Admin created successfully");
}

seedAdmin();

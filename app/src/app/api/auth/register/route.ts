import connectDB from "@/lib/connectDB";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password, name } = await req.json();

    console.log("Registration attempt:", { email, name, hasPassword: !!password });

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("User created successfully:", email);

    return NextResponse.json(
      { message: "User created successfully", redirect: "/login" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { message: "Server Error", error: err },
      { status: 500 }
    );
  }
}

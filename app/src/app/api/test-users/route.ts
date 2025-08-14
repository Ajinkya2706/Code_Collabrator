import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import User from "@/models/user";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const users = await User.find({}, { password: 0 }); // Exclude password
    return NextResponse.json({ 
      count: users.length, 
      users: users.map(u => ({ id: u._id, name: u.name, email: u.email }))
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
} 
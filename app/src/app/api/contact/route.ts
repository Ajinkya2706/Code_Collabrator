import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import VisitorMessage from "@/models/visitorMessage";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    await connectDB();
    await VisitorMessage.create({ name, email, message });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save message." }, { status: 500 });
  }
} 
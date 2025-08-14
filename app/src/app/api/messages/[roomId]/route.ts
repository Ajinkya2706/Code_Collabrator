import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Message from "@/models/message";
import Room from "@/models/room";

type Params = Promise<{ roomId: string }>;

// get all messages in room
export async function GET(
  request: NextRequest,
  segmentData: { params: Params }
) {
  try {
    // Get session from next-auth
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    const params = await segmentData.params;
    const roomId = params.roomId;

    const room = await Room.findOne({ roomId });

    // Find room
    const messages = await Message.find({ roomId: room._id }).populate(
      "sender",
      "name"
    );

    return NextResponse.json(messages, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch messages:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// create message
export async function POST(
  request: NextRequest,
  segmentData: { params: Params }
) {
  try {
    // Get session from next-auth
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    const params = await segmentData.params;
    const roomId = params.roomId;

    const { message } = await request.json();

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    const room = await Room.findOne({ roomId });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const newMessage = new Message({
      roomId: room._id,
      sender: session.user.id,
      message,
    });

    await newMessage.save();

    // populate sender and then send
    const msg = await Message.findById(newMessage._id).populate(
      "sender",
      "name"
    );

    return NextResponse.json(msg, { status: 201 });
  } catch (err) {
    console.error("Failed to create message:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

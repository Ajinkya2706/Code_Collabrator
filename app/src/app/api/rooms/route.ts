import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import connectDB from "@/lib/connectDB";
import Room from "@/models/room";
import User from "@/models/user";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found in MongoDB" }, { status: 404 });
    }
    
    const rooms = await Room.find({ createdBy: user._id }).sort({ createdAt: -1 });
    return NextResponse.json(rooms, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch rooms:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found in MongoDB" }, { status: 404 });
    }
    
    const name = user.name ? `${user.name.split(" ")[0]}'s Room` : "New Room";
    const newRoom = await Room.create({
      name,
      createdBy: user._id,
    });
    return NextResponse.json(newRoom, { status: 201 });
  } catch (err) {
    console.error("Failed to create room:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found in MongoDB" }, { status: 404 });
    }
    
    const { roomId } = await req.json();
    if (!roomId) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }
    
    const deletedRoom = await Room.findOneAndDelete({
      roomId: roomId,
      createdBy: user._id,
    });
    
    if (!deletedRoom) {
      return NextResponse.json(
        { error: "Room not found or not authorized" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: "Room deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to delete room:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

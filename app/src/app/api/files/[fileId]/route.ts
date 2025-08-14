import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import File from "@/models/file";
import User from "@/models/user";
import { auth } from "@/app/api/auth/[...nextauth]/auth";

export async function GET(request: NextRequest, segmentData: { params: { fileId: string } }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const params = segmentData.params;
    const fileId = params.fileId;
    const file = await File.findById(fileId);
    return NextResponse.json(file, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch file:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  segmentData: { params: { fileId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const params = await segmentData.params;
    const fileId = params.fileId;

    const { content } = await request.json();

    // Check if the file exists
    const file = await File.findById(fileId);
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Update the file content
    file.content = content;
    const newFile = await file.save();

    // Return the updated file
    if (!newFile) {
      return NextResponse.json(
        { error: "Failed to update file content" },
        { status: 500 }
      );
    }

    return NextResponse.json(newFile, { status: 200 });
  } catch (err) {
    console.error("Failed to update file content:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// delete file
export async function DELETE(
  request: NextRequest,
  segmentData: { params: { fileId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const params = await segmentData.params;
    const fileId = params.fileId;

    // Check if the file exists
    const file = await File.findById(fileId);
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    
    // Delete the file
    const deletedFile = await File.findByIdAndDelete(fileId);
    if (!deletedFile) {
      return NextResponse.json(
        { error: "Failed to delete file" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to delete file:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: "Terminal API is working",
    timestamp: new Date().toISOString(),
    status: "ok"
  });
}

export async function POST(req: NextRequest) {
  const { command } = await req.json();
  
  return NextResponse.json({
    message: `Received command: ${command}`,
    output: `Test output for: ${command}`,
    success: true
  });
} 
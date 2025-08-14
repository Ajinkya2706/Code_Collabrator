import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { command, roomId, cwd } = await req.json();

    if (!command) {
      return NextResponse.json({ error: "Command is required" }, { status: 400 });
    }

    // Security: Only allow safe commands
    const safeCommands = [
      'npm', 'node', 'npx', 'yarn', 'git', 'ls', 'pwd', 'cat', 'echo',
      'mkdir', 'touch', 'rm', 'cp', 'mv', 'chmod', 'chown',
      'grep', 'find', 'sed', 'awk', 'sort', 'uniq', 'wc',
      'curl', 'wget', 'ping', 'nslookup', 'dig',
      'ps', 'top', 'htop', 'free', 'df', 'du',
      'python', 'python3', 'pip', 'pip3',
      'java', 'javac', 'mvn', 'gradle',
      'gcc', 'g++', 'make', 'cmake',
      'docker', 'docker-compose',
      'kubectl', 'helm',
      'ssh', 'scp', 'rsync'
    ];

    const commandParts = command.trim().split(' ');
    const baseCommand = commandParts[0];

    // Check if command is safe
    if (!safeCommands.some(safe => baseCommand.startsWith(safe))) {
      return NextResponse.json({ 
        error: `Command '${baseCommand}' is not allowed for security reasons` 
      }, { status: 403 });
    }

    // Set working directory
    const workingDir = cwd || process.cwd();

    console.log(`Executing command: ${command} in ${workingDir}`);

    // Execute command with timeout
    const { stdout, stderr } = await execAsync(command, {
      cwd: workingDir,
      timeout: 30000, // 30 second timeout
      maxBuffer: 1024 * 1024, // 1MB buffer
    });

    const output = stdout || stderr || 'Command executed successfully';

    return NextResponse.json({
      output,
      success: true,
      command,
      cwd: workingDir,
    });

  } catch (error: any) {
    console.error('Terminal execution error:', error);
    
    if (error.code === 'ETIMEDOUT') {
      return NextResponse.json({ 
        error: "Command timed out after 30 seconds" 
      }, { status: 408 });
    }

    return NextResponse.json({ 
      error: error.message || "Failed to execute command" 
    }, { status: 500 });
  }
} 
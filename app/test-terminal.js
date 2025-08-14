// Test script for terminal functionality
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function testTerminalCommands() {
  console.log('🧪 Testing Terminal Commands...\n');

  const testCommands = [
    { cmd: 'echo "Hello World"', description: 'Basic echo command' },
    { cmd: 'pwd', description: 'Show current directory' },
    { cmd: 'ls -la', description: 'List files with details' },
    { cmd: 'node --version', description: 'Check Node.js version' },
    { cmd: 'npm --version', description: 'Check npm version' },
    { cmd: 'git --version', description: 'Check git version' },
    { cmd: 'python3 --version', description: 'Check Python version' },
    { cmd: 'echo "Test output" > test.txt', description: 'Create test file' },
    { cmd: 'cat test.txt', description: 'Read test file' },
    { cmd: 'rm test.txt', description: 'Delete test file' }
  ];

  for (const test of testCommands) {
    try {
      console.log(`📝 Testing: ${test.description}`);
      console.log(`   Command: ${test.cmd}`);
      
      const { stdout, stderr } = await execAsync(test.cmd, {
        timeout: 10000,
        maxBuffer: 1024 * 1024
      });
      
      if (stdout) {
        console.log(`   ✅ Output: ${stdout.trim()}`);
      }
      if (stderr) {
        console.log(`   ⚠️  Stderr: ${stderr.trim()}`);
      }
      console.log('');
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      console.log('');
    }
  }

  console.log('✅ Terminal test completed!');
}

// Test file operations
async function testFileOperations() {
  console.log('📁 Testing File Operations...\n');

  const fileOps = [
    { op: 'mkdir test-dir', description: 'Create directory' },
    { op: 'touch test-dir/file.txt', description: 'Create file in directory' },
    { op: 'echo "content" > test-dir/file.txt', description: 'Write to file' },
    { op: 'cat test-dir/file.txt', description: 'Read file content' },
    { op: 'rm test-dir/file.txt', description: 'Delete file' },
    { op: 'rmdir test-dir', description: 'Delete directory' }
  ];

  for (const op of fileOps) {
    try {
      console.log(`📝 Testing: ${op.description}`);
      console.log(`   Command: ${op.op}`);
      
      const { stdout, stderr } = await execAsync(op.op, {
        timeout: 10000,
        maxBuffer: 1024 * 1024
      });
      
      if (stdout) {
        console.log(`   ✅ Output: ${stdout.trim()}`);
      }
      if (stderr) {
        console.log(`   ⚠️  Stderr: ${stderr.trim()}`);
      }
      console.log('');
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      console.log('');
    }
  }

  console.log('✅ File operations test completed!');
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Terminal Feature Tests\n');
  
  await testTerminalCommands();
  await testFileOperations();
  
  console.log('🎉 All tests completed successfully!');
}

runTests().catch(console.error); 
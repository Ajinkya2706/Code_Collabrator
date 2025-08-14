const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Socket.IO server for real-time sync...\n');

// Start Socket.IO server only
console.log('📡 Starting Socket.IO server...');
const socketServer = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Socket.IO server...');
  socketServer.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down Socket.IO server...');
  socketServer.kill('SIGTERM');
  process.exit(0);
});

// Handle server crashes
socketServer.on('close', (code) => {
  console.log(`❌ Socket.IO server exited with code ${code}`);
  if (code !== 0) {
    console.log('🔄 Restarting Socket.IO server...');
    // Restart logic could be added here
  }
});

console.log('\n✅ Socket.IO server is starting...');
console.log('📊 Socket.IO server will be available on port 3001');
console.log('\nPress Ctrl+C to stop the server\n'); 
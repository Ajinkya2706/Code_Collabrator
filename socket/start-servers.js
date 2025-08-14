const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting collaborative code editor servers...\n');

// Start Socket.IO server
console.log('📡 Starting Socket.IO server...');
const socketServer = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

// Start Yjs WebSocket server
console.log('🔗 Starting Yjs WebSocket server...');
const yjsServer = spawn('node', ['yjs-server.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  socketServer.kill('SIGINT');
  yjsServer.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down servers...');
  socketServer.kill('SIGTERM');
  yjsServer.kill('SIGTERM');
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

yjsServer.on('close', (code) => {
  console.log(`❌ Yjs server exited with code ${code}`);
  if (code !== 0) {
    console.log('🔄 Restarting Yjs server...');
    // Restart logic could be added here
  }
});

console.log('\n✅ Both servers are starting...');
console.log('📊 Socket.IO server will be available on port 3001');
console.log('🔗 Yjs WebSocket server will be available on port 1234');
console.log('\nPress Ctrl+C to stop both servers\n'); 
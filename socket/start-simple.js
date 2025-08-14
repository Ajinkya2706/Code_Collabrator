const { spawn } = require('child_process');

console.log('Starting servers...');

// Start Socket.IO server
const socketServer = spawn('node', ['server.js'], {
  stdio: 'inherit',
  shell: true
});

// Wait a bit, then start Yjs server
setTimeout(() => {
  const yjsServer = spawn('node', ['yjs-server.js'], {
    stdio: 'inherit',
    shell: true
  });

  // Handle Yjs server close
  yjsServer.on('close', (code) => {
    console.log(`Yjs server exited with code ${code}`);
    socketServer.kill();
    process.exit(code);
  });
}, 1000);

// Handle Socket.IO server close
socketServer.on('close', (code) => {
  console.log(`Socket.IO server exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  socketServer.kill();
  process.exit(0);
}); 
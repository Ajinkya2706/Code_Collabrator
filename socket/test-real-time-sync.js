const io = require('socket.io-client');

console.log('🧪 Testing Socket.IO Real-time Sync...\n');

// Connect to the Socket.IO server
const socket = io('http://localhost:3001', {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

let testRoomId = 'test-room-' + Date.now();
let testFileId = 'test-file-' + Date.now();
let testUserId = 'test-user-' + Date.now();

socket.on('connect', () => {
  console.log('✅ Connected to Socket.IO server');
  
  // Join a test room
  socket.emit('join-room', {
    roomId: testRoomId,
    user: {
      _id: testUserId,
      name: 'Test User',
    },
  });
  
  console.log('👥 Joined room:', testRoomId);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from Socket.IO server');
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message);
});

// Listen for code updates
socket.on('code-update', (data) => {
  console.log('📝 Received code update:', {
    fileId: data.fileId,
    codeLength: data.code.length,
    sender: data.sender
  });
});

// Listen for cursor updates
socket.on('cursor-update', (data) => {
  console.log('👆 Received cursor update:', {
    fileId: data.fileId,
    position: data.position,
    sender: data.sender
  });
});

// Listen for file events
socket.on('file-create', (data) => {
  console.log('📄 Received file create:', data.file.name);
});

socket.on('file-delete', (data) => {
  console.log('🗑️ Received file delete:', data.fileId);
});

socket.on('file-rename', (data) => {
  console.log('✏️ Received file rename:', data.fileId, 'to', data.newName);
});

// Test functions
function testCodeChange() {
  console.log('\n🧪 Testing code change...');
  socket.emit('code-change', {
    roomId: testRoomId,
    fileId: testFileId,
    code: 'console.log("Hello World!");',
    sender: testUserId,
  });
}

function testCursorMove() {
  console.log('\n🧪 Testing cursor move...');
  socket.emit('cursor-move', {
    roomId: testRoomId,
    fileId: testFileId,
    position: { lineNumber: 1, column: 10 },
    sender: testUserId,
  });
}

function testFileCreate() {
  console.log('\n🧪 Testing file create...');
  socket.emit('file-create', {
    roomId: testRoomId,
    file: {
      _id: 'test-file-' + Date.now(),
      name: 'test.js',
      content: '// Test file',
      language: 'javascript',
    },
  });
}

function testMessage() {
  console.log('\n🧪 Testing message...');
  socket.emit('message', {
    roomId: testRoomId,
    message: {
      text: 'Hello from test!',
      sender: testUserId,
    },
  });
}

// Run tests after a delay
setTimeout(() => {
  testCodeChange();
  
  setTimeout(() => {
    testCursorMove();
    
    setTimeout(() => {
      testFileCreate();
      
      setTimeout(() => {
        testMessage();
        
        setTimeout(() => {
          console.log('\n✅ All tests completed!');
          console.log('Check the server console for received events.');
          process.exit(0);
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
}, 2000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Test terminated');
  socket.disconnect();
  process.exit(0);
}); 
const WebSocket = require('ws');
const http = require('http');

console.log('🧪 Testing server connections...\n');

// Test Socket.IO server
function testSocketIOServer() {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      method: 'GET',
      timeout: 5000
    }, (res) => {
      console.log('✅ Socket.IO server is running on port 3001');
      resolve(true);
    });

    req.on('error', (err) => {
      console.log('❌ Socket.IO server is not running on port 3001');
      console.log('   Error:', err.message);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log('⏰ Socket.IO server connection timeout');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Test Yjs WebSocket server
function testYjsServer() {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 1234,
      method: 'GET',
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (data.includes('Yjs WebSocket Server is running')) {
          console.log('✅ Yjs WebSocket server is running on port 1234');
          resolve(true);
        } else {
          console.log('❌ Yjs WebSocket server response is unexpected');
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log('❌ Yjs WebSocket server is not running on port 1234');
      console.log('   Error:', err.message);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log('⏰ Yjs WebSocket server connection timeout');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Test WebSocket connection to Yjs server
function testYjsWebSocket() {
  return new Promise((resolve) => {
    try {
      const ws = new WebSocket('ws://localhost:1234');
      
      ws.on('open', () => {
        console.log('✅ Yjs WebSocket connection successful');
        ws.close();
        resolve(true);
      });

      ws.on('error', (err) => {
        console.log('❌ Yjs WebSocket connection failed');
        console.log('   Error:', err.message);
        resolve(false);
      });

      ws.on('timeout', () => {
        console.log('⏰ Yjs WebSocket connection timeout');
        resolve(false);
      });

      // Set a timeout
      setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          console.log('⏰ Yjs WebSocket connection timeout');
          ws.terminate();
          resolve(false);
        }
      }, 5000);

    } catch (err) {
      console.log('❌ Failed to create Yjs WebSocket connection');
      console.log('   Error:', err.message);
      resolve(false);
    }
  });
}

// Run all tests
async function runTests() {
  console.log('🔍 Testing Socket.IO server...');
  const socketIOOk = await testSocketIOServer();
  
  console.log('\n🔍 Testing Yjs HTTP server...');
  const yjsHttpOk = await testYjsServer();
  
  console.log('\n🔍 Testing Yjs WebSocket connection...');
  const yjsWsOk = await testYjsWebSocket();
  
  console.log('\n📊 Test Results:');
  console.log('Socket.IO Server:', socketIOOk ? '✅ OK' : '❌ FAILED');
  console.log('Yjs HTTP Server:', yjsHttpOk ? '✅ OK' : '❌ FAILED');
  console.log('Yjs WebSocket:', yjsWsOk ? '✅ OK' : '❌ FAILED');
  
  if (socketIOOk && yjsHttpOk && yjsWsOk) {
    console.log('\n🎉 All servers are running correctly!');
    console.log('You can now use the collaborative code editor.');
  } else {
    console.log('\n⚠️  Some servers are not running correctly.');
    console.log('Please check the server logs and ensure both servers are started.');
    console.log('\nTo start both servers:');
    console.log('  npm run both');
  }
  
  process.exit(0);
}

runTests().catch((err) => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
}); 
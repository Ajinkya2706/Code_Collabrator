const WebSocket = require('ws');
const http = require('http');
const Y = require('yjs');
const { WebsocketProvider } = require('y-websocket');

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Yjs WebSocket Server is running');
});

const wss = new WebSocket.Server({ server });

// Store active documents
const docs = new Map();

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, 'http://localhost');
  const roomName = url.searchParams.get('room') || 'default';
  
  console.log('Client connecting to room:', roomName);
  
  // Get or create document for this room
  let doc = docs.get(roomName);
  if (!doc) {
    doc = new Y.Doc();
    docs.set(roomName, doc);
  }
  
  // Create awareness instance for this connection
  const awareness = new Map();
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'sync') {
        // Handle sync messages
        const update = Y.encodeUpdateAsBinary(doc);
        ws.send(JSON.stringify({
          type: 'sync',
          data: update
        }));
      } else if (data.type === 'update') {
        // Handle update messages
        Y.applyUpdate(doc, data.data);
        // Broadcast to other clients in the same room
        wss.clients.forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'update',
              data: data.data
            }));
          }
        });
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected from room:', roomName);
  });
});

const PORT = process.env.YJS_PORT || 1234;
server.listen(PORT, () => {
  console.log(`Yjs WebSocket server running on port ${PORT}`);
}); 
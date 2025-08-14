const WebSocket = require('ws');
const http = require('http');

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Yjs WebSocket Server is running');
});

const wss = new WebSocket.Server({ server });

// Simple message broadcasting
wss.on('connection', (ws, req) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    // Broadcast message to all other clients
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.YJS_PORT || 1234;
server.listen(PORT, () => {
  console.log(`Simple Yjs WebSocket server running on port ${PORT}`);
}); 
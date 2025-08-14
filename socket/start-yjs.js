const WebSocket = require('ws');
const http = require('http');

console.log('Starting Yjs WebSocket server...');

// Create HTTP server
const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Yjs WebSocket Server is running');
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store active documents
const docs = new Map();

// Store client connections
const clients = new Map();

wss.on('connection', (ws, req) => {
  console.log('Client connected');
  
  // Generate a unique client ID
  const clientId = Math.random().toString(36).substr(2, 9);
  clients.set(ws, clientId);
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message:', data.type, 'for document:', data.documentId);
      
      switch (data.type) {
        case 'join-document':
          handleJoinDocument(ws, data.documentId, clientId);
          break;
          
        case 'leave-document':
          handleLeaveDocument(ws, data.documentId, clientId);
          break;
          
        case 'sync-step-1':
          handleSyncStep1(ws, data.documentId, data.documentState);
          break;
          
        case 'sync-step-2':
          handleSyncStep2(ws, data.documentId, data.update);
          break;
          
        case 'update':
          handleUpdate(ws, data.documentId, data.update);
          break;
          
        case 'awareness':
          handleAwareness(ws, data.documentId, data.awareness);
          break;
          
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected:', clientId);
    // Remove client from all documents
    for (const [docId, docData] of docs.entries()) {
      if (docData.clients.has(clientId)) {
        docData.clients.delete(clientId);
        // If no clients left, remove the document
        if (docData.clients.size === 0) {
          docs.delete(docId);
          console.log('Document removed:', docId);
        }
      }
    }
    clients.delete(ws);
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

function handleJoinDocument(ws, documentId, clientId) {
  console.log(`Client ${clientId} joining document: ${documentId}`);
  
  // Get or create document
  if (!docs.has(documentId)) {
    docs.set(documentId, {
      clients: new Map()
    });
    console.log('Created new document:', documentId);
  }
  
  const docData = docs.get(documentId);
  docData.clients.set(clientId, ws);
  
  // Send initial document state (empty for now)
  ws.send(JSON.stringify({
    type: 'sync-step-1',
    documentId: documentId,
    documentState: []
  }));
}

function handleLeaveDocument(ws, documentId, clientId) {
  console.log(`Client ${clientId} leaving document: ${documentId}`);
  
  if (docs.has(documentId)) {
    const docData = docs.get(documentId);
    docData.clients.delete(clientId);
    
    // If no clients left, remove the document
    if (docData.clients.size === 0) {
      docs.delete(documentId);
      console.log('Document removed:', documentId);
    }
  }
}

function handleSyncStep1(ws, documentId, documentState) {
  if (!docs.has(documentId)) {
    console.log('Document not found for sync step 1:', documentId);
    return;
  }
  
  const docData = docs.get(documentId);
  const clientId = clients.get(ws);
  
  try {
    // Send our current state back (empty for now)
    ws.send(JSON.stringify({
      type: 'sync-step-2',
      documentId: documentId,
      update: []
    }));
  } catch (error) {
    console.error('Error in sync step 1:', error);
  }
}

function handleSyncStep2(ws, documentId, update) {
  if (!docs.has(documentId)) {
    console.log('Document not found for sync step 2:', documentId);
    return;
  }
  
  console.log('Sync step 2 completed for document:', documentId);
}

function handleUpdate(ws, documentId, update) {
  if (!docs.has(documentId)) {
    console.log('Document not found for update:', documentId);
    return;
  }
  
  const docData = docs.get(documentId);
  const clientId = clients.get(ws);
  
  try {
    // Broadcast the update to all other clients in this document
    for (const [otherClientId, otherWs] of docData.clients.entries()) {
      if (otherClientId !== clientId && otherWs.readyState === WebSocket.OPEN) {
        otherWs.send(JSON.stringify({
          type: 'update',
          documentId: documentId,
          update: update
        }));
      }
    }
  } catch (error) {
    console.error('Error handling update:', error);
  }
}

function handleAwareness(ws, documentId, awareness) {
  if (!docs.has(documentId)) {
    console.log('Document not found for awareness:', documentId);
    return;
  }
  
  const docData = docs.get(documentId);
  const clientId = clients.get(ws);
  
  // Broadcast awareness to all other clients in this document
  for (const [otherClientId, otherWs] of docData.clients.entries()) {
    if (otherClientId !== clientId && otherWs.readyState === WebSocket.OPEN) {
      otherWs.send(JSON.stringify({
        type: 'awareness',
        documentId: documentId,
        awareness: awareness
      }));
    }
  }
}

// Start the server
const PORT = process.env.YJS_PORT || 1234;
server.listen(PORT, () => {
  console.log(`✅ Yjs WebSocket server running on port ${PORT}`);
  console.log(`🌐 WebSocket URL: ws://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Yjs server...');
  wss.close(() => {
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down Yjs server...');
  wss.close(() => {
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
}); 
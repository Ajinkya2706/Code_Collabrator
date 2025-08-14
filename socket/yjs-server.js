const WebSocket = require('ws');
const Y = require('yjs');
const http = require('http');

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Yjs WebSocket Server is running');
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store active documents
const docs = new Map();

// Store client connections
const clients = new Map();

// Heartbeat interval
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

wss.on('connection', (ws, req) => {
  console.log('✅ Client connected');
  
  // Generate a unique client ID
  const clientId = Math.random().toString(36).substr(2, 9);
  clients.set(ws, clientId);
  
  // Set up heartbeat
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
  });
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`📨 Received ${data.type} from client ${clientId}`);
      
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
          
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }));
          break;
          
        default:
          console.log('❓ Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('❌ Error processing message:', error);
    }
  });
  
  ws.on('close', (code, reason) => {
    console.log(`🔌 Client ${clientId} disconnected:`, code, reason);
    // Remove client from all documents
    for (const [docId, docData] of docs.entries()) {
      if (docData.clients.has(clientId)) {
        docData.clients.delete(clientId);
        console.log(`👤 Removed client ${clientId} from document ${docId}`);
        // If no clients left, remove the document
        if (docData.clients.size === 0) {
          docs.delete(docId);
          console.log(`🗑️ Document removed: ${docId}`);
        }
      }
    }
    clients.delete(ws);
  });
  
  ws.on('error', (error) => {
    console.error(`❌ WebSocket error for client ${clientId}:`, error);
    clients.delete(ws);
  });
});

function handleJoinDocument(ws, documentId, clientId) {
  console.log(`📄 Client ${clientId} joining document: ${documentId}`);
  
  // Get or create document
  if (!docs.has(documentId)) {
    const ydoc = new Y.Doc();
    docs.set(documentId, {
      doc: ydoc,
      clients: new Map()
    });
    console.log(`✨ Created new document: ${documentId}`);
  }
  
  const docData = docs.get(documentId);
  docData.clients.set(clientId, ws);
  
  // Send initial document state
  const state = Y.encodeStateAsUpdate(docData.doc);
  ws.send(JSON.stringify({
    type: 'sync-step-1',
    documentId: documentId,
    documentState: Array.from(state)
  }));
  
  console.log(`📊 Document ${documentId} now has ${docData.clients.size} clients`);
}

function handleLeaveDocument(ws, documentId, clientId) {
  console.log(`🚪 Client ${clientId} leaving document: ${documentId}`);
  
  if (docs.has(documentId)) {
    const docData = docs.get(documentId);
    docData.clients.delete(clientId);
    
    // If no clients left, remove the document
    if (docData.clients.size === 0) {
      docs.delete(documentId);
      console.log(`🗑️ Document removed: ${documentId}`);
    } else {
      console.log(`📊 Document ${documentId} now has ${docData.clients.size} clients`);
    }
  }
}

function handleSyncStep1(ws, documentId, documentState) {
  if (!docs.has(documentId)) {
    console.log(`❌ Document not found for sync step 1: ${documentId}`);
    return;
  }
  
  const docData = docs.get(documentId);
  const clientId = clients.get(ws);
  
  try {
    // Apply the received state to our document
    const stateArray = new Uint8Array(documentState);
    Y.applyUpdate(docData.doc, stateArray);
    
    // Send our current state back
    const ourState = Y.encodeStateAsUpdate(docData.doc);
    ws.send(JSON.stringify({
      type: 'sync-step-2',
      documentId: documentId,
      update: Array.from(ourState)
    }));
    
    console.log(`🔄 Sync step 1 completed for document ${documentId}`);
  } catch (error) {
    console.error(`❌ Error in sync step 1 for document ${documentId}:`, error);
  }
}

function handleSyncStep2(ws, documentId, update) {
  if (!docs.has(documentId)) {
    console.log(`❌ Document not found for sync step 2: ${documentId}`);
    return;
  }
  
  const docData = docs.get(documentId);
  
  try {
    // Apply the received update
    const updateArray = new Uint8Array(update);
    Y.applyUpdate(docData.doc, updateArray);
    console.log(`🔄 Sync step 2 completed for document ${documentId}`);
  } catch (error) {
    console.error(`❌ Error in sync step 2 for document ${documentId}:`, error);
  }
}

function handleUpdate(ws, documentId, update) {
  if (!docs.has(documentId)) {
    console.log(`❌ Document not found for update: ${documentId}`);
    return;
  }
  
  const docData = docs.get(documentId);
  const clientId = clients.get(ws);
  
  try {
    // Apply the update to our document
    const updateArray = new Uint8Array(update);
    Y.applyUpdate(docData.doc, updateArray);
    
    // Broadcast the update to all other clients in this document
    let broadcastCount = 0;
    for (const [otherClientId, otherWs] of docData.clients.entries()) {
      if (otherClientId !== clientId && otherWs.readyState === WebSocket.OPEN) {
        otherWs.send(JSON.stringify({
          type: 'update',
          documentId: documentId,
          update: Array.from(updateArray)
        }));
        broadcastCount++;
      }
    }
    
    if (broadcastCount > 0) {
      console.log(`📡 Broadcasted update from client ${clientId} to ${broadcastCount} other clients in document ${documentId}`);
    }
  } catch (error) {
    console.error(`❌ Error handling update for document ${documentId}:`, error);
  }
}

function handleAwareness(ws, documentId, awareness) {
  if (!docs.has(documentId)) {
    console.log(`❌ Document not found for awareness: ${documentId}`);
    return;
  }
  
  const docData = docs.get(documentId);
  const clientId = clients.get(ws);
  
  // Broadcast awareness to all other clients in this document
  let broadcastCount = 0;
  for (const [otherClientId, otherWs] of docData.clients.entries()) {
    if (otherClientId !== clientId && otherWs.readyState === WebSocket.OPEN) {
      otherWs.send(JSON.stringify({
        type: 'awareness',
        documentId: documentId,
        awareness: awareness
      }));
      broadcastCount++;
    }
  }
  
  if (broadcastCount > 0) {
    console.log(`👥 Broadcasted awareness from client ${clientId} to ${broadcastCount} other clients in document ${documentId}`);
  }
}

// Heartbeat mechanism
const heartbeat = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      console.log('💀 Terminating inactive connection');
      return ws.terminate();
    }
    
    ws.isAlive = false;
    ws.ping();
  });
}, HEARTBEAT_INTERVAL);

// Start the server
const PORT = process.env.YJS_PORT || 1234;
server.listen(PORT, () => {
  console.log(`✅ Yjs WebSocket server running on port ${PORT}`);
  console.log(`🔗 WebSocket URL: ws://localhost:${PORT}`);
  console.log(`📊 Active documents: ${docs.size}`);
  console.log(`👥 Active clients: ${clients.size}`);
});

// Log server stats periodically
setInterval(() => {
  console.log(`📊 Server Stats - Documents: ${docs.size}, Clients: ${clients.size}`);
}, 60000); // Every minute

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down Yjs server...');
  clearInterval(heartbeat);
  wss.close(() => {
    server.close(() => {
      console.log('✅ Server closed gracefully');
      process.exit(0);
    });
  });
});

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down Yjs server...');
  clearInterval(heartbeat);
  wss.close(() => {
    server.close(() => {
      console.log('✅ Server closed gracefully');
      process.exit(0);
    });
  });
}); 
# Real-time Sync Test Guide

## Quick Test Steps

### 1. Start the Servers
```bash
cd socket
npm install
npm run both
```

### 2. Start the Frontend
```bash
cd app
npm run dev
```

### 3. Test File Creation Sync
1. Open the app in **two different browser tabs**
2. Join the same room in both tabs
3. Create a file in **Tab 1** using the "+" button
4. **Expected Result**: The file should appear in **Tab 2** immediately

### 4. Test Real-time Code Editing
1. Open the same file in both tabs
2. Type some code in **Tab 1**
3. **Expected Result**: The code should appear in **Tab 2** in real-time

### 5. Test File Deletion
1. Delete a file in **Tab 1**
2. **Expected Result**: The file should disappear from **Tab 2** immediately

## Troubleshooting

### If file creation doesn't sync:
1. Check browser console for Socket.IO connection errors
2. Verify both servers are running (ports 3001 and 1234)
3. Check if users are joining the same room

### If real-time editing doesn't work:
1. Check browser console for Yjs connection errors
2. Verify Yjs server is running on port 1234
3. Check for "Yjs Connected" status in the editor

### If nothing works:
1. Run the test script: `cd socket && npm run test`
2. Check server logs for any errors
3. Restart both servers

## Expected Console Messages

### Socket.IO Server:
- ✅ Client connected: [socket-id]
- 👥 Socket [socket-id] joined room: [room-id]
- 📄 File created in room [room-id]: [filename]

### Yjs Server:
- ✅ Client connected
- 📄 Client [client-id] joining document: [room-file-id]
- 🔄 Sync step 1 completed for document [room-file-id]

### Browser Console:
- Connected to Socket.io server
- Yjs WebSocket connected successfully
- Yjs binding created successfully 
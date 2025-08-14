# Socket.IO Real-time Sync Test Guide

## Quick Start (Socket.IO Only)

### 1. Start the Socket.IO Server
```bash
cd socket
npm install
npm run socket-only
```

### 2. Start the Frontend
```bash
cd app
npm run dev
```

## Test Your Original Real-time Sync Logic

### 3. Test File Creation Sync
1. Open the app in **two different browser tabs**
2. Join the same room in both tabs
3. Create a file in **Tab 1** using the "+" button in Files tab
4. **Expected Result**: The file should appear in **Tab 2** immediately
5. Check console for: "Emitting file-create event" and "Remote file created"

### 4. Test Real-time Code Editing
1. Open the same file in both tabs (click on the file)
2. Type some code in **Tab 1**
3. **Expected Result**: The code should appear in **Tab 2** in real-time
4. Check console for: "Code change in room..." and "Received remote code update"

### 5. Test File Deletion
1. Delete a file in **Tab 1** (right-click → Delete)
2. **Expected Result**: The file should disappear from **Tab 2** immediately
3. Check console for: "File deleted in room..." and "Remote file deleted"

### 6. Test File Renaming
1. Rename a file in **Tab 1** (right-click → Rename)
2. **Expected Result**: The file name should update in **Tab 2** immediately
3. Check console for: "File renamed in room..." and "Remote file renamed"

### 7. Test Folder Creation
1. Click the "+ Folder" button in the IDE file explorer
2. **Expected Result**: The folder should appear in all tabs
3. Check console for: "Emitting file-create event from IDE (folder)"

## Expected Console Messages

### Socket.IO Server:
- ✅ Client connected: [socket-id]
- 👥 Socket [socket-id] joined room: [room-id]
- 📄 File created in room [room-id]: [filename]
- 📝 Code change in room [room-id], file [file-id] by [user-id]
- 👆 Cursor move in room [room-id], file [file-id] by [user-id]

### Browser Console:
- Connected to Socket.io server
- Emitting file-create event: {roomId, file}
- Remote file created: [filename]
- Received remote code update: [file-id] from: [user-id]

## Troubleshooting

### If file creation doesn't sync:
1. Check browser console for Socket.IO connection errors
2. Verify Socket.IO server is running on port 3001
3. Check if users are joining the same room
4. Look for "Emitting file-create event" in console

### If real-time editing doesn't work:
1. Check browser console for "Code change in room..." messages
2. Verify Socket.IO connection is established
3. Check for "Received remote code update" messages

### If nothing works:
1. Run the test script: `cd socket && npm run test`
2. Check server logs for any errors
3. Restart the Socket.IO server

## Your Original Logic is Now Working

✅ **File Creation**: Uses your original `socket.emit('file-create', { roomId, file })`
✅ **Code Changes**: Uses your original `socket.emit('code-change', { roomId, fileId, code, sender })`
✅ **Cursor Position**: Uses your original `socket.emit('cursor-move', { roomId, fileId, position, sender })`
✅ **Messages**: Uses your original `socket.emit('message', { roomId, message })`

The system now uses your original Socket.IO logic for all real-time sync operations! 
# Yjs Collaborative Editing Setup

This setup provides real-time collaborative code editing using Yjs and Monaco Editor.

## What's New

- **CollaborativeCodeEditor**: A new component that replaces the standard Monaco Editor with a Yjs-powered collaborative version
- **Yjs WebSocket Server**: A separate server that handles Yjs document synchronization
- **Dual Server Setup**: Both Socket.IO (for chat, file management) and Yjs (for code editing) servers run simultaneously

## Files Created/Modified

### New Files:
- `socket/yjs-server.js` - Yjs WebSocket server
- `socket/start-servers.js` - Script to run both servers
- `app/src/components/room/CollaborativeCodeEditor.tsx` - Collaborative editor component
- `socket/YJS_SETUP.md` - This file

### Modified Files:
- `socket/package.json` - Added Yjs dependencies and scripts
- `app/src/components/ide/EditorTabs.tsx` - Now uses CollaborativeCodeEditor

## Setup Instructions

### 1. Install Dependencies

In the `socket` directory:
```bash
npm install
```

### 2. Start the Servers

You have several options:

**Option A: Start both servers with one command**
```bash
npm run both
```

**Option B: Start both servers in development mode (with auto-restart)**
```bash
npm run both-dev
```

**Option C: Start servers individually**
```bash
# Terminal 1 - Socket.IO server
npm run dev

# Terminal 2 - Yjs server  
npm run yjs
```

### 3. Verify Servers are Running

- Socket.IO server should be on port 3001 (or SOCKET_PORT from .env)
- Yjs WebSocket server should be on port 1234 (or YJS_PORT from .env)

You should see:
```
Socket.IO server running on port 3001
Yjs WebSocket server running on port 1234
```

## How It Works

1. **CollaborativeCodeEditor** connects to the Yjs WebSocket server using a unique room name: `${roomId}-${fileId}`
2. Each file gets its own Yjs document for real-time collaboration
3. Multiple users can edit the same file simultaneously with conflict resolution
4. The existing Socket.IO server continues to handle chat, file management, and other features

## Features

- ✅ Real-time collaborative editing
- ✅ Conflict resolution using CRDT (Conflict-free Replicated Data Types)
- ✅ Cursor position sharing
- ✅ No flickering or focus loss issues
- ✅ Maintains existing Socket.IO functionality for chat and file management

## Troubleshooting

### Server won't start
- Check if ports 3001 and 1234 are available
- Ensure all dependencies are installed: `npm install`

### Collaborative editing not working
- Verify both servers are running
- Check browser console for connection errors
- Ensure you're using the CollaborativeCodeEditor component

### Connection issues
- Check that the WebSocket URL in CollaborativeCodeEditor matches your Yjs server
- Default URL: `ws://localhost:1234`

## Environment Variables

Add these to your `.env` file if you want to customize ports:
```
SOCKET_PORT=3001
YJS_PORT=1234
``` 
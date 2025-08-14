# Collaborative Code Editor - Server Setup

This directory contains the server components for the real-time collaborative code editor with Yjs integration.

## 🚀 Quick Start

### Option 1: Start Both Servers Together (Recommended)
```bash
cd socket
npm run both
```

### Option 2: Start with Auto-restart (Development)
```bash
cd socket
npm run both-dev
```

### Option 3: Start Servers Separately
```bash
# Terminal 1 - Socket.IO Server
cd socket
npm run dev

# Terminal 2 - Yjs Server  
cd socket
npm run yjs-dev
```

## 🔧 What's New

### ✅ Fixed Issues
- **File/Folder Creation Sync**: Files created in one tab now appear in all other tabs
- **Real-time Code Editing**: Yjs integration provides true collaborative editing
- **Unified File State**: Single source of truth for file management
- **Improved Connection Stability**: Heartbeat mechanism and better error handling
- **Better Error Recovery**: Automatic reconnection with exponential backoff

### 🆕 Features
- **CollaborativeCodeEditor**: Yjs-powered real-time code editor
- **File Content Sync**: File content changes sync across all clients
- **Robust Yjs Server**: Enhanced with heartbeat, logging, and error handling
- **Improved Socket.IO Server**: Better file operation handling and logging
- **Unified IDE Layout**: Single file explorer that works with both tabs

## 🏗️ Architecture

### Servers
1. **Socket.IO Server** (port 3001) - Handles file operations, user presence, and chat
2. **Yjs WebSocket Server** (port 1234) - Handles real-time code synchronization

### Components
- **IDELayout**: Unified file explorer and editor interface
- **CollaborativeCodeEditor**: Yjs-powered Monaco editor
- **FilesTabContent**: File management with real-time sync
- **FileComponent**: Individual file operations

## 📊 Testing Connections

To verify both servers are running correctly:

```bash
cd socket
npm run test
```

This will test both WebSocket connections and show the status.

## 🔍 Troubleshooting

### Real-time Code Sync Not Working

1. **Check if Yjs server is running:**
   ```bash
   cd socket
   npm run test
   ```

2. **Check browser console for errors:**
   - Open browser dev tools
   - Look for WebSocket connection errors
   - Check for "Yjs WebSocket connected" messages

3. **Verify ports are not in use:**
   ```bash
   # Windows
   netstat -ano | findstr :1234
   netstat -ano | findstr :3001
   
   # Mac/Linux
   lsof -i :1234
   lsof -i :3001
   ```

4. **Restart servers:**
   ```bash
   # Kill existing processes
   # Then restart
   npm run both
   ```

### File Operations Not Syncing

1. **Check Socket.IO server:**
   - Ensure it's running on port 3001
   - Check browser console for Socket.IO connection status

2. **Verify room joining:**
   - Check if users are properly joining the same room
   - Look for "Client connected" messages in server logs

### Yjs Connection Issues

1. **Check Yjs server status:**
   - Visit: `http://localhost:1234` (should show "Yjs WebSocket Server is running")
   - Check server logs for connection messages

2. **Browser console errors:**
   - Look for WebSocket connection failures
   - Check for CORS errors

3. **Network issues:**
   - Ensure firewall allows connections to port 1234
   - Check if proxy is blocking WebSocket connections

## 🛠️ Common Issues

### Port Already in Use
```bash
# Windows - Find process using port
netstat -ano | findstr :1234
taskkill /PID <PID> /F

# Mac/Linux - Find process using port
lsof -i :1234
kill -9 <PID>
```

### CORS Errors
- Ensure frontend URL is correctly configured in server.js
- Check if both servers have proper CORS settings

### WebSocket Connection Failed
- Check firewall settings
- Verify server is accessible from browser
- Ensure no proxy is blocking WebSocket connections

## 📈 Server Logs

Both servers provide detailed logging:

### Socket.IO Server
- Client connections and disconnections
- File operations (create, delete, rename)
- Room events and user presence
- Periodic stats every minute

### Yjs Server
- Document creation and management
- Sync operations and client connections
- Heartbeat monitoring
- Periodic stats every minute

## 📁 File Structure

```
socket/
├── server.js              # Socket.IO server
├── yjs-server.js          # Yjs WebSocket server
├── start-servers.js       # Script to run both servers
├── test-connection.js     # Connection test script
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 📦 Dependencies

### Production
- `socket.io` - Real-time communication
- `ws` - WebSocket server for Yjs
- `yjs` - CRDT for collaborative editing
- `express` - HTTP server
- `dotenv` - Environment variables

### Development
- `concurrently` - Run multiple servers
- `nodemon` - Auto-restart for development

## 🚀 Deployment

### Environment Variables
Create a `.env` file in the socket directory:

```env
SOCKET_PORT=3001
YJS_PORT=1234
FRONTEND_URL=http://localhost:3000
```

### Production Setup
1. Install dependencies: `npm install`
2. Set environment variables
3. Start servers: `npm run both`
4. Ensure ports are accessible

## 🔄 Development Workflow

1. **Start servers:** `npm run both-dev`
2. **Make changes** to server code
3. **Servers auto-restart** with nodemon
4. **Test changes** in browser
5. **Check logs** for any issues

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review server logs for error messages
3. Verify both servers are running
4. Check browser console for client-side errors
5. Ensure all dependencies are installed

## 🎯 Next Steps

- [ ] Add file persistence to Yjs documents
- [ ] Implement user cursors and selections
- [ ] Add file versioning and history
- [ ] Implement conflict resolution
- [ ] Add file sharing and permissions 
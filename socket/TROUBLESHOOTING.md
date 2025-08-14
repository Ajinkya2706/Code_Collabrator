# Troubleshooting Guide

## Yjs Server Connection Issues

### Problem: "Yjs server not connected. Check if server is running on port 1234"

**Solution:**

1. **Start the Yjs server:**
   ```bash
   cd socket
   npm run yjs-start
   ```

2. **Or start both servers together:**
   ```bash
   cd socket
   npm run both-simple
   ```

3. **Verify the server is running:**
   - Check terminal output for: `✅ Yjs WebSocket server running on port 1234`
   - Visit: `http://localhost:1234` (should show "Yjs WebSocket Server is running")

### Problem: WebSocket connection fails

**Solutions:**

1. **Check if port 1234 is available:**
   ```bash
   # Windows
   netstat -an | findstr :1234
   
   # If port is in use, kill the process or change the port
   ```

2. **Change Yjs server port:**
   ```bash
   # Set environment variable
   set YJS_PORT=1235
   npm run yjs-start
   ```

3. **Update frontend connection URL:**
   In `app/src/components/room/CollaborativeCodeEditor.tsx`, change:
   ```typescript
   const provider = new CustomWebSocketProvider(
     'ws://localhost:1235', // Change port here
     `${roomId}-${fileId}`,
     doc
   );
   ```

## File/Folder Creation Issues

### Problem: Files and folders not created simultaneously

**Solutions:**

1. **Ensure both servers are running:**
   ```bash
   cd socket
   npm run both-simple
   ```

2. **Check Socket.IO connection:**
   - Open browser console
   - Look for Socket.IO connection messages
   - Verify room joining: "Socket [id] joined room: [roomId]"

3. **Check file operation events:**
   - Create a file/folder
   - Check console for: "File created from FilesTabContent:" or "File created from IDE:"
   - Verify Socket.IO events are emitted

### Problem: Real-time sync not working

**Solutions:**

1. **Verify Yjs connection:**
   - Check browser console for "Yjs WebSocket connected successfully"
   - Look for "Yjs received message:" logs

2. **Check document synchronization:**
   - Open browser console
   - Look for "Client [id] joining document: [roomId-fileId]"
   - Verify sync messages: "sync-step-1", "sync-step-2"

3. **Test with multiple browsers:**
   - Open the same room in two different browsers
   - Create/edit files in one browser
   - Verify changes appear in the other browser

## Server Startup Commands

### Development Mode (with auto-restart)
```bash
cd socket
npm run both-dev
```

### Production Mode
```bash
cd socket
npm run both
```

### Simple Mode (recommended for testing)
```bash
cd socket
npm run both-simple
```

### Individual Servers
```bash
# Terminal 1 - Socket.IO server
cd socket
npm run dev

# Terminal 2 - Yjs server
cd socket
npm run yjs-start
```

## Debugging Steps

### 1. Check Server Status
```bash
# Check if servers are running
curl http://localhost:3001/health
curl http://localhost:1234
```

### 2. Check Browser Console
- Open Developer Tools (F12)
- Look for connection messages
- Check for error messages

### 3. Check Network Tab
- Open Developer Tools → Network
- Look for WebSocket connections
- Verify WebSocket messages

### 4. Test WebSocket Connection
```bash
# Test Yjs server
cd socket
node test-connection.js
```

## Common Error Messages

### "WebSocket connection failed"
- Server not running on port 1234
- Firewall blocking the connection
- Wrong WebSocket URL

### "Socket.IO connection failed"
- Socket.IO server not running on port 3001
- CORS issues
- Network connectivity problems

### "File not found"
- File ID mismatch between IDE and file list
- Database sync issues
- Socket.IO events not properly handled

## Environment Variables

Create a `.env` file in the `socket` directory:
```env
SOCKET_PORT=3001
YJS_PORT=1234
FRONTEND_URL=http://localhost:3000
```

## Performance Tips

1. **Use simple mode for development:**
   ```bash
   npm run both-simple
   ```

2. **Monitor server logs:**
   - Watch for connection/disconnection messages
   - Check for error messages
   - Monitor file operation events

3. **Test with minimal setup:**
   - Start with one file
   - Test basic operations first
   - Gradually add complexity

## Still Having Issues?

1. **Check the logs:**
   - Server console output
   - Browser console
   - Network tab

2. **Restart servers:**
   ```bash
   # Stop all servers (Ctrl+C)
   # Then restart
   npm run both-simple
   ```

3. **Clear browser cache:**
   - Hard refresh (Ctrl+Shift+R)
   - Clear browser data
   - Try incognito mode

4. **Check dependencies:**
   ```bash
   npm install
   ```

5. **Verify file structure:**
   - Ensure all files are in correct locations
   - Check import paths
   - Verify component props 
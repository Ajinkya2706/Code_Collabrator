# ZegoCloud Setup Guide

## Prerequisites

1. Create a ZegoCloud account at [https://www.zegocloud.com/](https://www.zegocloud.com/)
2. Create a new project in the ZegoCloud console
3. Get your App ID and Server Secret from the project settings

## Environment Variables Setup

Create a `.env.local` file in the `app` directory with the following variables:

```env
# ZegoCloud Configuration
NEXT_PUBLIC_ZEGOCLOUD_APP_ID=your_zego_app_id_here
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=your_mongodb_uri_here
```

Also create a `.env` file in the `socket` directory:

```env
# ZegoCloud Configuration
ZEGOCLOUD_APP_ID=your_zego_app_id_here
ZEGOCLOUD_SERVER_SECRET=your_zego_server_secret_here

# Server Configuration
SOCKET_PORT=3001
FRONTEND_URL=http://localhost:3000
```

## Steps to Configure

1. **Get ZegoCloud Credentials:**
   - Go to [ZegoCloud Console](https://console.zegocloud.com/)
   - Create a new project or use existing one
   - Copy the App ID and Server Secret

2. **Update Environment Files:**
   - Replace `your_zego_app_id_here` with your actual App ID
   - Replace `your_zego_server_secret_here` with your actual Server Secret
   - The Server Secret must be exactly 32 characters long

3. **Start the Servers:**
   ```bash
   # Terminal 1: Start the socket server
   cd socket
   npm install
   npm start

   # Terminal 2: Start the Next.js app
   cd app
   npm install
   npm run dev
   ```

4. **Test Video Call:**
   - Navigate to a room in your app
   - Go to the "Video Call" tab
   - Click "Join Call" to test the video functionality

## Troubleshooting

### Common Issues:

1. **"ZegoCloud App ID is not configured"**
   - Make sure you have created `.env.local` in the app directory
   - Verify the App ID is correctly set

2. **"Server secret must be 32 characters"**
   - Check that your Server Secret is exactly 32 characters long
   - Copy it carefully from the ZegoCloud console

3. **"Failed to join call"**
   - Ensure the socket server is running on port 3001
   - Check that both environment files are properly configured
   - Verify your camera and microphone permissions in the browser

4. **Token generation errors**
   - Check the socket server logs for detailed error messages
   - Verify all environment variables are set correctly

### Debug Mode:

To enable debug logging, add this to your socket server `.env`:

```env
DEBUG=true
```

This will show detailed logs about token generation and API calls.

## Security Notes

- Never commit your `.env` files to version control
- Keep your Server Secret secure and private
- Use different App IDs for development and production
- Consider using environment-specific configurations

## Production Deployment

For production deployment:

1. Set up proper environment variables on your hosting platform
2. Use HTTPS URLs for both frontend and backend
3. Configure CORS properly for your production domain
4. Consider using a CDN for better performance 
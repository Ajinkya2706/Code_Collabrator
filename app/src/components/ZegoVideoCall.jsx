// src/components/ZegoVideoCall.jsx

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Settings, Users, Signal } from "lucide-react";
import { toast } from "sonner";

const appID = parseInt(process.env.NEXT_PUBLIC_ZEGOCLOUD_APP_ID, 10);
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

function randomID(len = 5) {
  let result = '';
  const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
  const maxPos = chars.length;
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

const ZegoVideoCall = ({ roomID, userID, userName, audioOnly = false }) => {
  const callContainer = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);



  useEffect(() => {
    if (!roomID || !userID || !userName) {
      setError("Missing required parameters: roomID, userID, or userName");
      return;
    }

    if (!appID) {
      setError("ZegoCloud App ID is not configured. Please check your environment variables.");
      return;
    }

    let zpInstance = null;
    const joinZegoRoom = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Dynamic import for SSR compatibility
        const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
        
        // Fetch the production token from your backend
        const res = await axios.get(`${BACKEND_URL}/api/get-zego-token`, {
          params: { roomID, userID, userName },
        });
        
        if (!res.data.token) {
          throw new Error("No token received from server");
        }
        
        const token = res.data.token;
        
        // For production:
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
          appID,
          token,
          roomID,
          userID,
          userName
        );
        
        zpInstance = ZegoUIKitPrebuilt.create(kitToken);
        let scenarioMode = ZegoUIKitPrebuilt.GroupCall;
        if (audioOnly) scenarioMode = ZegoUIKitPrebuilt.OneONoneCall;
        
        zpInstance.joinRoom({
          container: callContainer.current,
          sharedLinks: [
            {
              name: 'Personal link',
              url:
                window.location.protocol + '//' +
                window.location.host + window.location.pathname +
                '?roomID=' + roomID,
            },
          ],
          scenario: {
            mode: scenarioMode,
          },
          showScreenSharingButton: !audioOnly,
          showPreJoinView: true,
          showUserList: true,
          showLeavingView: true,
          showNonVideoUser: true,
          showOnlyAudioUser: audioOnly,
          layout: {
            mode: audioOnly ? 'auto' : 'grid',
            width: '100%',
            height: '100%',
          },
          branding: {
            logoURL: 'https://your-logo-url.com/logo.png', // Optional: Add your logo
          },
          preJoinViewConfig: {
            title: audioOnly ? 'Audio Call' : 'Video Call',
            invitationLink: window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID,
          },
          // Let ZegoCloud handle permissions automatically
          turnCameraOn: !audioOnly,
          turnMicrophoneOn: true,
        });
        
        setIsConnected(true);
        setIsLoading(false);
        toast.success(`Joined ${audioOnly ? 'audio' : 'video'} call successfully!`);
      } catch (err) {
        console.error("ZegoCloud error:", err);
        setError(err.response?.data?.error || err.message || "Failed to join call");
        setIsLoading(false);
        toast.error("Failed to join call. Please try again.");
        
        if (callContainer.current) {
          callContainer.current.innerHTML = `
            <div class="flex items-center justify-center h-full bg-gray-900 text-red-400">
              <div class="text-center">
                <AlertCircle class="w-12 h-12 mx-auto mb-4" />
                <p class="text-lg font-semibold mb-2">Failed to join call</p>
                <p class="text-sm text-gray-400">${err.response?.data?.error || err.message || "Unknown error"}</p>
              </div>
            </div>
          `;
        }
      }
    };
    
    joinZegoRoom();
    
    return () => {
      if (callContainer.current) callContainer.current.innerHTML = "";
      if (zpInstance && zpInstance.destroy) zpInstance.destroy();
      setIsConnected(false);
    };
  }, [roomID, userID, userName, audioOnly]);

  if (error) {
    return (
      <Card className="h-full bg-gray-900 border-gray-700">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {audioOnly ? 'Audio Call Error' : 'Video Call Error'}
            </h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Check if ZegoCloud App ID is configured</p>
              <p>• Ensure the socket server is running on port 3001</p>
              <p>• Allow {audioOnly ? 'microphone' : 'camera and microphone'} permissions when prompted</p>
              <p>• Check your internet connection</p>
              <p>• Try refreshing the page and joining again</p>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="h-full bg-gray-900 border-gray-700">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white mb-2">
              Connecting to {audioOnly ? 'audio' : 'video'} call...
            </p>
            <p className="text-sm text-gray-400">
              Please allow {audioOnly ? 'microphone' : 'camera and microphone'} access when prompted
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      ref={callContainer}
      style={{ width: "100%", height: "100%", minHeight: 400 }}
      className="bg-gray-900 rounded-lg overflow-hidden"
    />
  );
};

export default ZegoVideoCall;

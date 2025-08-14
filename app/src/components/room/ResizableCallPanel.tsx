"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Video, Mic, MicOff, VideoOff, PhoneOff, Copy, Share2, AlertCircle, Users, Settings, MessageSquare, Monitor } from "lucide-react";
import { toast } from "sonner";
import ZegoVideoCall from "../ZegoVideoCall";
import { cn } from "@/lib/utils";

interface ResizableCallPanelProps {
  roomID: string;
  userID: string;
  userName: string;
  audioOnly?: boolean;
  onClose?: () => void;
}

const ResizableCallPanel: React.FC<ResizableCallPanelProps> = ({
  roomID,
  userID,
  userName,
  audioOnly = false,
  onClose
}) => {
  const [isInCall, setIsInCall] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState(1);
  const [callDuration, setCallDuration] = useState(0);
  const zegoContainerRef = useRef<HTMLDivElement>(null);

  const copyRoomLink = () => {
    const roomLink = `${window.location.origin}/room/${roomID}`;
    navigator.clipboard.writeText(roomLink);
    toast.success("Room link copied to clipboard!");
  };

  const handleJoinCall = () => {
    setIsInCall(true);
    toast.success(`Joining ${audioOnly ? 'audio' : 'video'} call...`);
  };

  const handleLeaveCall = () => {
    setIsInCall(false);
    toast.info("Left the call");
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(isMuted ? "Microphone enabled" : "Microphone muted");
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    toast.info(isVideoOff ? "Camera enabled" : "Camera disabled");
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast.info(isScreenSharing ? "Screen sharing stopped" : "Screen sharing started");
  };

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isInCall) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        {/* Custom Call Header */}
        <div className="flex items-center justify-between p-4 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                audioOnly 
                  ? "bg-gradient-to-r from-blue-500 to-purple-600" 
                  : "bg-gradient-to-r from-purple-500 to-pink-600"
              )}>
                {audioOnly ? (
                  <Phone className="w-5 h-5 text-white" />
                ) : (
                  <Video className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {audioOnly ? 'Audio Call' : 'Video Call'}
                </h2>
                <div className="flex items-center space-x-2 text-sm">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
                    Live
                  </Badge>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">{formatDuration(callDuration)}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">{participants} participant{participants !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={copyRoomLink}
              className="bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50 backdrop-blur-sm"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button
              size="sm"
              onClick={handleLeaveCall}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <PhoneOff className="w-4 h-4 mr-2" />
              Leave
            </Button>
          </div>
        </div>

        {/* Custom Call Content */}
        <div className="flex-1 relative bg-gray-900/50 backdrop-blur-sm">
          {/* Hidden ZegoCloud container for functionality */}
          <div 
            ref={zegoContainerRef}
            className="absolute inset-0 opacity-0 pointer-events-none"
            style={{ zIndex: -1 }}
          >
            <ZegoVideoCall 
              roomID={roomID} 
              userID={userID} 
              userName={userName}
              audioOnly={audioOnly}
            />
          </div>

          {/* Custom Video Display */}
          <div className="h-full flex flex-col items-center justify-center p-6">
            {audioOnly ? (
              // Audio Call UI
              <div className="text-center space-y-6">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-16 h-16 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Audio Call Active</h3>
                  <p className="text-gray-400">Crystal clear voice communication</p>
                </div>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{participants} online</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Connected</span>
                  </div>
                </div>
              </div>
            ) : (
              // Video Call UI
              <div className="w-full h-full flex flex-col">
                <div className="flex-1 bg-gray-800/50 rounded-lg border border-gray-700/50 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                      <Video className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Video Call Active</h3>
                      <p className="text-gray-400">HD video with screen sharing</p>
                    </div>
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{participants} online</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Connected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Custom Control Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-800/90 backdrop-blur-sm border-t border-gray-700/50">
            <div className="flex items-center justify-center space-x-4">
              {/* Mute Button */}
              <Button
                size="lg"
                variant="outline"
                onClick={toggleMute}
                className={cn(
                  "w-12 h-12 rounded-full p-0",
                  isMuted 
                    ? "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30" 
                    : "bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50"
                )}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>

              {/* Video Toggle (only for video calls) */}
              {!audioOnly && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={toggleVideo}
                  className={cn(
                    "w-12 h-12 rounded-full p-0",
                    isVideoOff 
                      ? "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30" 
                      : "bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50"
                  )}
                >
                  {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </Button>
              )}

              {/* Screen Share (only for video calls) */}
              {!audioOnly && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={toggleScreenShare}
                  className={cn(
                    "w-12 h-12 rounded-full p-0",
                    isScreenSharing 
                      ? "bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30" 
                      : "bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50"
                  )}
                >
                  <Monitor className="w-5 h-5" />
                </Button>
              )}

              {/* Chat Button */}
              <Button
                size="lg"
                variant="outline"
                className="w-12 h-12 rounded-full p-0 bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50"
              >
                <MessageSquare className="w-5 h-5" />
              </Button>

              {/* Settings Button */}
              <Button
                size="lg"
                variant="outline"
                className="w-12 h-12 rounded-full p-0 bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50"
              >
                <Settings className="w-5 h-5" />
              </Button>

              {/* Leave Call Button */}
              <Button
                size="lg"
                onClick={handleLeaveCall}
                className="w-12 h-12 rounded-full p-0 bg-red-500 hover:bg-red-600"
              >
                <PhoneOff className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          {audioOnly ? (
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
              <Video className="w-8 h-8 text-white" />
            </div>
          )}
          <div className="text-left">
            <h2 className="text-2xl font-bold text-white">
              {audioOnly ? 'Audio Call' : 'Video Call'}
            </h2>
            <p className="text-gray-400">
              {audioOnly ? 'Crystal clear voice communication' : 'HD video with screen sharing'}
            </p>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        {audioOnly ? (
          <>
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Mic className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white">Crystal Clear Audio</h4>
                    <p className="text-sm text-gray-400">High-quality voice communication with noise cancellation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white">Multi-User Support</h4>
                    <p className="text-sm text-gray-400">Connect with multiple collaborators simultaneously</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Video className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white">HD Video Quality</h4>
                    <p className="text-sm text-gray-400">High-definition video streaming with adaptive quality</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white">Screen Sharing</h4>
                    <p className="text-sm text-gray-400">Share your screen with others in real-time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Join Button */}
      <Button
        size="lg"
        onClick={handleJoinCall}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg mb-6"
      >
        <div className="flex items-center">
          {audioOnly ? (
            <Phone className="w-6 h-6 mr-3" />
          ) : (
            <Video className="w-6 h-6 mr-3" />
          )}
          Join {audioOnly ? 'Audio' : 'Video'} Call
        </div>
      </Button>

      {/* Action Buttons */}
      <div className="flex space-x-4 mb-6">
        <Button
          variant="outline"
          onClick={copyRoomLink}
          className="flex-1 bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 backdrop-blur-sm"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Link
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowShareModal(true)}
          className="flex-1 bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 backdrop-blur-sm"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Info Card */}
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
            <div className="text-left">
              <h4 className="text-sm font-semibold text-white mb-2">How it works</h4>
              <p className="text-sm text-gray-400">
                Click "Join {audioOnly ? 'Audio' : 'Video'} Call" to start. You'll be prompted to allow {audioOnly ? 'microphone' : 'camera and microphone'} access. 
                The call will connect through ZegoCloud for optimal quality with our beautiful custom interface.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResizableCallPanel;

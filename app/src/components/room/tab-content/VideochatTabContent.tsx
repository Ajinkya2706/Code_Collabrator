"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Users,
  Clock,
  Signal,
  Settings,
  Maximize,
  Minimize,
  Copy,
  Share2,
  Phone,
  PhoneOff,
  MoreHorizontal,
  AlertCircle
} from "lucide-react";
import { useSession } from "next-auth/react";
import ZegoVideoCall from "@/components/ZegoVideoCall";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const VideochatTabContent: React.FC<{ roomID: string; userID: string; userName: string }> = ({
  roomID,
  userID,
  userName,
}) => {
  const { data: session } = useSession();
  const [isInCall, setIsInCall] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');
  const [showShareModal, setShowShareModal] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    toast.info(isFullscreen ? "Exited fullscreen" : "Entered fullscreen");
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}/room/${roomID}`;
    navigator.clipboard.writeText(link);
    toast.success("Room link copied to clipboard!");
  };

  const getConnectionQualityIcon = () => {
    switch (connectionQuality) {
      case 'excellent':
        return <Signal className="w-4 h-4 text-green-500" />;
      case 'good':
        return <Signal className="w-4 h-4 text-yellow-500" />;
      case 'poor':
        return <Signal className="w-4 h-4 text-red-500" />;
      default:
        return <Signal className="w-4 h-4 text-green-500" />;
    }
  };

  const getConnectionQualityText = () => {
    switch (connectionQuality) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'poor':
        return 'Poor';
      default:
        return 'Excellent';
    }
  };

  const handleJoinCall = () => {
    setIsInCall(true);
    toast.success("Joining video call...");
  };

  const handleLeaveCall = () => {
    setIsInCall(false);
    toast.info("Left the video call");
  };

  if (isInCall) {
    return (
      <div className={cn("h-full flex flex-col", isFullscreen && "fixed inset-0 z-50 bg-black")}>
        {/* Call Header */}
        <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Video className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-white">Video Call</h2>
            </div>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              {getConnectionQualityIcon()}
              <span className="ml-1">{getConnectionQualityText()}</span>
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={toggleFullscreen}
              className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              onClick={handleLeaveCall}
              className="bg-red-500 hover:bg-red-600"
            >
              <PhoneOff className="w-4 h-4 mr-2" />
              Leave Call
            </Button>
          </div>
        </div>

        {/* Video Call Content */}
        <div className="flex-1 relative bg-gray-900">
          {/* ZegoCloud Video Call Component */}
          <div className="w-full h-full">
            <ZegoVideoCall 
              roomID={roomID} 
              userID={userID} 
              userName={userName}
              audioOnly={false}
            />
          </div>

          {/* Additional Actions */}
          <div className="absolute top-6 right-6">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={copyRoomLink}
                className="bg-gray-800/90 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowShareModal(true)}
                className="bg-gray-800/90 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Video className="w-6 h-6 text-purple-500" />
          <div>
            <h2 className="text-xl font-semibold text-white">Video Call</h2>
            <p className="text-sm text-gray-400">Real-time video communication with ZegoCloud</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
          {getConnectionQualityIcon()}
          <span className="ml-1">{getConnectionQualityText()}</span>
        </Badge>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          {/* Call Icon */}
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Video className="w-12 h-12 text-white" />
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Start Video Call</h3>
            <p className="text-gray-400">
              Join the video call powered by ZegoCloud for high-quality video communication
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <Video className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <p className="text-gray-300">HD Video Quality</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="text-gray-300">Multi-User Support</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <Signal className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <p className="text-gray-300">Low Latency</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <Settings className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <p className="text-gray-300">Advanced Controls</p>
            </div>
          </div>

          {/* Join Call Button */}
          <Button
            size="lg"
            onClick={handleJoinCall}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center">
              <Video className="w-5 h-5 mr-2" />
              Join Video Call
            </div>
          </Button>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={copyRoomLink}
              className="flex-1 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowShareModal(true)}
              className="flex-1 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Info Card */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="text-left">
                  <h4 className="text-sm font-medium text-white mb-1">How it works</h4>
                  <p className="text-xs text-gray-400">
                    Click "Join Video Call" to start. You'll be prompted to allow camera and microphone access. 
                    The call will connect through ZegoCloud for optimal video quality.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideochatTabContent;

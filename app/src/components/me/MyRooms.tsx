"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Users, 
  Clock, 
  FolderOpen,
  MoreVertical,
  Settings,
  Share2
} from "lucide-react";
import { toast } from "sonner";
import { getRooms, deleteRoom } from "@/services/room-services";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Room {
  _id: string;
  name: string;
  roomId: string;
  createdAt: string;
  createdBy: string;
  files: string[];
}

const MyRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await getRooms(session?.user?.id || "");
      if (response && response.status === 200) {
        setRooms(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    setCreating(true);
    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const newRoom = await response.json();
        setRooms([newRoom, ...rooms]);
        toast.success("Room created successfully!");
        router.push(`/room/${newRoom.roomId}`);
      } else {
        toast.error("Failed to create room");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      const response = await deleteRoom(roomId);
      if (response && response.status === 200) {
        setRooms(rooms.filter((room) => room.roomId !== roomId));
        toast.success("Room deleted successfully!");
      } else {
        toast.error("Failed to delete room");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("Failed to delete room");
    }
  };

  const handleCopyRoomId = (roomId: string) => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied to clipboard!");
  };

  const handleShareRoom = (roomId: string) => {
    const shareUrl = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Room link copied to clipboard!");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Rooms</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your collaborative coding spaces
          </p>
        </div>
        <Button
          onClick={handleCreateRoom}
          disabled={creating}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          {creating ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating...
            </div>
          ) : (
            <div className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              New Room
            </div>
          )}
        </Button>
      </div>

      {/* Rooms Grid */}
      {rooms.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No rooms yet
            </h3>
            <p className="text-gray-500 dark:text-gray-500 text-center mb-6 max-w-md">
              Create your first collaborative coding room to start working with your team
            </p>
            <Button
              onClick={handleCreateRoom}
              disabled={creating}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Room
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card key={room._id} className="group hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {room.name}
                    </CardTitle>
                    <div className="flex items-center mt-2 space-x-2">
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Active
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {room.roomId}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleCopyRoomId(room.roomId)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Room ID
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShareRoom(room.roomId)}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Room
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/room/${room.roomId}`)}>
                        <Settings className="w-4 h-4 mr-2" />
                        Room Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteRoom(room.roomId)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Room
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDate(room.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>1 member</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => router.push(`/room/${room.roomId}`)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Go to Room
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyRoomId(room.roomId)}
                    className="px-3"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRooms;

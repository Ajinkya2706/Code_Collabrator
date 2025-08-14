"use client";
import React, { useState, useEffect, useRef, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSocket } from "@/providers/SocketProvider";
import { useSession } from "next-auth/react";
import { getMessages, createMessage } from "@/services/message-service";
import { useParams } from "next/navigation";
import { IconUsers, IconPointFilled, IconSend } from "@tabler/icons-react";
import { toast } from "sonner";

interface IUser {
  _id: string;
  name: string;
  profile: string; // URL to the user's profile picture
}

type Message = {
  _id: string;
  message: string;
  sender: IUser;
  roomId: string;
};

const ChatTabContent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { socket, isConnected, collaborators } = useSocket();
  const { data: session } = useSession();
  const params = useParams();
  const roomId = params.roomId as string;
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !session?.user?.id) return;

    setIsSending(true);
    try {
      const res = await createMessage(roomId, newMessage);
      if (res.status === 201) {
        setNewMessage("");
        // Optionally add the new message to the list immediately
        setMessages((prev) => [...prev, res.data]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const fetchMessages = async () => {
    if (!roomId) return;
    
    setIsLoading(true);
    try {
      const res = await getMessages(roomId);
      if (res.status === 200) {
        setMessages(res.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Don't show error toast for initial load, just log it
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (roomId) {
      fetchMessages();
    }
  }, [roomId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableArea = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollableArea) {
        scrollableArea.scrollTop = scrollableArea.scrollHeight;
      }
    }
  }, [messages]);

  // LISTEN TO MESSAGES
  useEffect(() => {
    if (roomId && isConnected && socket) {
      // Listen for new messages from other users
      const handleNewMessage = ({ message }: { message: Message }) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      socket.on("new-message", handleNewMessage);

      return () => {
        socket.off("new-message", handleNewMessage);
      };
    }
  }, [roomId, isConnected, socket]);

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Chat header */}
      <div className="flex items-center p-4 border-b border-gray-800">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src="/placeholder-avatar.jpg" />
          <AvatarFallback className="bg-gray-700 text-white">
            <IconUsers size={14} />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-sm font-medium text-white whitespace-nowrap">
            <span className="text-gray-400">Room/ </span>
            {roomId}
          </h3>
          <p className="text-[10px] text-gray-400 flex items-center gap-1">
            <IconPointFilled size={16} className="text-green-500" />
            {collaborators.length || 0} people online
          </p>
        </div>
      </div>

      {/* Chat messages - flex-1 allows it to expand to fill available space */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {isLoading ? (
          <div className="space-y-4">
            {/* First message - left side */}
            <div className="flex items-start gap-2">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div>
                <Skeleton className="h-12 w-[220px] rounded-lg" />
              </div>
            </div>

            {/* Second message - right side */}
            <div className="flex items-start gap-2 justify-end">
              <div className="text-right">
                <Skeleton className="h-12 w-[200px] rounded-lg" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
            </div>

            {/* Third message - left side */}
            <div className="flex items-start gap-2">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div>
                <Skeleton className="h-12 w-[220px] rounded-lg" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message, idx) => (
              <div
                key={message._id || idx}
                className={`flex items-start gap-2 ${
                  message.sender._id === session?.user?.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.sender._id !== session?.user?.id && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={message.sender.profile} />
                    <AvatarFallback className="bg-gray-700 text-white text-xs">
                      {message.sender.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender._id === session?.user?.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-100"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.sender.name} •{" "}
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {message.sender._id === session?.user?.id && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={message.sender.profile} />
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                      {message.sender.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Chat input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            disabled={isSending}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!newMessage.trim() || isSending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <IconSend size={16} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatTabContent;

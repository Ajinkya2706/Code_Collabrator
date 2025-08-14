'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { getUser } from "@/services/auth-services";
import { useSession } from "next-auth/react";

interface IUser {
  _id: string;
  name: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomId: string) => void;
  emitCodeChange: (data: {
    roomId: string;
    fileId: string;
    code: string;
    sender: string;
  }) => void;
  emitCursorMove: (data: {
    roomId: string;
    fileId: string;
    position: any;
    sender: string;
  }) => void;
  emitMessage: (data: { roomId: string; message: any }) => void;
  emitFileUpdate: (data: {
    roomId: string;
    fileId: string;
    content: string;
    sender: string;
  }) => void;
  collaborators: IUser[];
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  onFileUpdate?: (fileId: string, content: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  joinRoom: () => {},
  emitCodeChange: () => {},
  emitCursorMove: () => {},
  emitMessage: () => {},
  emitFileUpdate: () => {},
  collaborators: [],
  connectionStatus: 'disconnected',
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [collaborators, setCollaborators] = useState<IUser[]>([]);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const user = getUser();
  const { data: session } = useSession();

  // Enhanced Socket.IO connection with better error handling
  const connectSocket = useCallback(() => {
    if (socket) {
      socket.disconnect();
    }

    setConnectionStatus('connecting');
    console.log('🔌 Attempting to connect to Socket.IO server...');

    const socketInstance = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001",
      {
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: true,
        forceNew: true,
      }
    );

    socketInstance.on("connect", () => {
      console.log("✅ Connected to Socket.IO server");
      setIsConnected(true);
      setConnectionStatus('connected');
      setReconnectAttempts(0);
      
      // Show success toast only on initial connection
      if (reconnectAttempts > 0) {
        toast.success("Reconnected to server");
      }
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("🔌 Disconnected from Socket.IO server:", reason);
      setIsConnected(false);
      setConnectionStatus('disconnected');
      
      if (reason === 'io server disconnect') {
        // Server disconnected us, try to reconnect
        console.log('🔄 Server disconnected, attempting to reconnect...');
        socketInstance.connect();
      }
    });

    socketInstance.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
      setConnectionStatus('error');
      setReconnectAttempts(prev => prev + 1);
      
      if (reconnectAttempts === 0) {
      toast.error("Failed to connect to server");
      } else if (reconnectAttempts < 5) {
        toast.error(`Connection failed (attempt ${reconnectAttempts + 1})`);
      }
    });

    socketInstance.on("reconnect", (attemptNumber) => {
      console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
      setConnectionStatus('connected');
      toast.success("Reconnected to server");
    });

    socketInstance.on("reconnect_attempt", (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}`);
      setConnectionStatus('connecting');
    });

    socketInstance.on("reconnect_error", (error) => {
      console.error("❌ Reconnection error:", error);
      setConnectionStatus('error');
    });

    socketInstance.on("reconnect_failed", () => {
      console.error("❌ Reconnection failed after all attempts");
      setConnectionStatus('error');
      toast.error("Failed to reconnect to server");
    });

    setSocket(socketInstance);

    return socketInstance;
  }, [reconnectAttempts]);

  useEffect(() => {
    const socketInstance = connectSocket();

    return () => {
      if (socketInstance) {
      socketInstance.disconnect();
      }
    };
  }, [connectSocket]);

  const joinRoom = useCallback((roomId: string) => {
    console.log('SocketProvider: joinRoom called with roomId:', roomId, 'socket:', !!socket, 'isConnected:', isConnected, 'session:', !!session);

    if (socket && isConnected && session?.user) {
      console.log('SocketProvider: Joining room:', roomId, 'with user:', session.user.name);
      socket.emit("join-room", {
        roomId,
        user: {
          _id: session.user.id,
          name: session.user.name || "Anonymous",
        },
      });
    } else {
      console.log('SocketProvider: Cannot join room - missing requirements:', {
        hasSocket: !!socket,
        isConnected,
        hasSession: !!session,
        connectionStatus
      });
    }
  }, [socket, isConnected, session, connectionStatus]);

  const emitCodeChange = useCallback((data: {
    roomId: string;
    fileId: string;
    code: string;
    sender: string;
  }) => {
    console.log('SocketProvider: emitCodeChange called with data:', {
      roomId: data.roomId,
      fileId: data.fileId,
      codeLength: data.code.length,
      sender: data.sender
    }, 'socket:', !!socket, 'isConnected:', isConnected, 'status:', connectionStatus);
    
    if (socket && isConnected) {
      console.log('SocketProvider: Emitting code-change event to server');
      socket.emit("code-change", data);
    } else {
      console.log('SocketProvider: Cannot emit code change - not connected');
      if (connectionStatus === 'error') {
        toast.error("Connection lost. Changes may not sync.");
      }
    }
  }, [socket, isConnected, connectionStatus]);

  const emitCursorMove = useCallback((data: {
    roomId: string;
    fileId: string;
    position: any;
    sender: string;
  }) => {
    if (socket && isConnected) {
      socket.emit("cursor-move", data);
    }
  }, [socket, isConnected]);

  const emitMessage = useCallback((data: { roomId: string; message: any }) => {
    if (socket && isConnected) {
      socket.emit("message", data);
    }
  }, [socket, isConnected]);

  const emitFileUpdate = useCallback((data: {
    roomId: string;
    fileId: string;
    content: string;
    sender: string;
  }) => {
    if (socket && isConnected) {
      socket.emit("file-update", data);
    }
  }, [socket, isConnected]);

  useEffect(() => {
    if (socket) {
      socket.on("collaborators-update", (users) => {
        console.log('👥 Collaborators updated:', users);
        setCollaborators(users);
      });

      // Listen for global file updates
      socket.on("file-update", (data: { fileId: string; content: string; sender: string }) => {
        console.log('📄 Global file update received:', { 
          fileId: data.fileId, 
          contentLength: data.content.length,
          sender: data.sender 
        });
        
        // Emit a custom event that components can listen to
        const event = new CustomEvent('file-update', { 
          detail: { fileId: data.fileId, content: data.content, sender: data.sender } 
        });
        window.dispatchEvent(event);
      });

      return () => {
        socket.off("collaborators-update");
        socket.off("file-update");
      };
    }
  }, [socket]);

  // Auto-reconnect logic
  useEffect(() => {
    if (connectionStatus === 'error' && reconnectAttempts < 5) {
      const timeout = setTimeout(() => {
        console.log('🔄 Attempting auto-reconnect...');
        connectSocket();
      }, 2000 * (reconnectAttempts + 1)); // Exponential backoff

      return () => clearTimeout(timeout);
    }
  }, [connectionStatus, reconnectAttempts, connectSocket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinRoom,
        emitCodeChange,
        emitCursorMove,
        emitMessage,
        emitFileUpdate,
        collaborators,
        connectionStatus,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

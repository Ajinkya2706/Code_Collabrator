"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, Code, MessageCircle, Users, Video, Settings, FileText, Palette, Terminal, Plus, Folder, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import CollaborativeCodeEditor from "@/components/room/CollaborativeCodeEditor";
import ResizableCallPanel from "@/components/room/ResizableCallPanel";
import ChatTabContent from "@/components/room/tab-content/ChatTabContent";
import CollaboratorsTabContent from "@/components/room/tab-content/CollaboratorsTabContent";
import FilesTabContent from "@/components/room/tab-content/FilesTabContent";
import SettingsTabContent from "@/components/room/tab-content/SettingsTabContent";
import Whiteboard from "@/components/Whiteboard";
import FileCreationSidebar from "@/components/room/FileCreationSidebar";
import { IFile } from "@/types/types";
import { useSocket } from "@/providers/SocketProvider";
import Link from "next/link";
import IDETerminal from "@/components/room/IDETerminal";

const page = () => {
  const { roomId } = useParams();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("code");
  const [showTerminal, setShowTerminal] = useState(false);
  const [showFileSidebar, setShowFileSidebar] = useState(true); // Start with file sidebar open
  const [showCanvas, setShowCanvas] = useState(false);
  const [activeFile, setActiveFile] = useState<IFile | null>(null);
  const [files, setFiles] = useState<IFile[]>([]);
  const { socket, isConnected } = useSocket();

  // Navigation items for the small left sidebar
  const navItems = [
    { tab: "code", label: "Code", icon: Code },
    { tab: "chat", label: "Chat", icon: MessageCircle },
    { tab: "calling", label: "Audio Call", icon: Phone },
    { tab: "video", label: "Video Call", icon: Video },
    { tab: "collaborators", label: "Collaborators", icon: Users },
    { tab: "files", label: "Files", icon: FileText },
    { tab: "settings", label: "Settings", icon: Settings },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Hide terminal and canvas when switching tabs
    setShowTerminal(false);
    setShowCanvas(false);
  };

  const handleActiveFileChange = (file: IFile) => {
    setActiveFile(file);
  };

  const handleCodeChange = (code: string) => {
    if (activeFile && socket) {
      socket.emit("code-change", {
        roomId,
        fileId: activeFile._id,
        content: code,
      });
    }
  };

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else if (status === "unauthenticated") {
      window.location.href = "/login";
    } else {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (socket && roomId) {
      // Join room
      socket.emit("join-room", { roomId });

      // Listen for remote file creation
      const handleRemoteFileCreate = ({ file }: { file: IFile }) => {
        setFiles(prev => [...prev, file]);
      };

      // Listen for remote file deletion
      const handleRemoteFileDelete = ({ fileId }: { fileId: string }) => {
        setFiles(prev => prev.filter(f => f._id !== fileId));
        if (activeFile?._id === fileId) {
          setActiveFile(null);
        }
      };

      // Listen for remote file rename
      const handleRemoteFileRename = ({ fileId, newName }: { fileId: string, newName: string }) => {
        setFiles(prev => prev.map(f => 
          f._id === fileId ? { ...f, name: newName } : f
        ));
        if (activeFile?._id === fileId) {
          setActiveFile(prev => prev ? { ...prev, name: newName } : null);
        }
      };

      // Listen for remote code changes
      const handleRemoteCodeChange = ({ fileId, content }: { fileId: string; content: string }) => {
        setFiles(prev => prev.map(f => 
          f._id === fileId ? { ...f, content } : f
        ));
        if (activeFile?._id === fileId) {
          setActiveFile(prev => prev ? { ...prev, content } : null);
        }
      };

      // Listen for global file updates
      const handleGlobalFileUpdate = (event: CustomEvent) => {
        const { fileId, content } = event.detail;
        setFiles(prev => prev.map(f => 
          f._id === fileId ? { ...f, content } : f
        ));
        if (activeFile?._id === fileId) {
          setActiveFile(prev => prev ? { ...prev, content } : null);
        }
      };

      // Listen for file list updates
      const handleFileListUpdate = ({ files: updatedFiles }: { files: IFile[] }) => {
        setFiles(updatedFiles);
      };

      // Listen for user join/leave
      const handleUserJoined = ({ user }: { user: any }) => {
        console.log("User joined:", user);
      };

      const handleUserLeft = ({ user }: { user: any }) => {
        console.log("User left:", user);
      };

      // Listen for room info
      const handleRoomInfo = ({ room }: { room: any }) => {
        console.log("Room info:", room);
      };

      // Listen for error
      const handleError = ({ message }: { message: string }) => {
        console.error("Socket error:", message);
      };

      // Listen for connection status
      const handleConnect = () => {
        console.log("Connected to socket server");
      };

      const handleDisconnect = () => {
        console.log("Disconnected from socket server");
      };

      // Add event listeners
      socket.on("file-created", handleRemoteFileCreate);
      socket.on("file-deleted", handleRemoteFileDelete);
      socket.on("file-renamed", handleRemoteFileRename);
      socket.on("code-changed", handleRemoteCodeChange);
      socket.on("file-list-updated", handleFileListUpdate);
      socket.on("user-joined", handleUserJoined);
      socket.on("user-left", handleUserLeft);
      socket.on("room-info", handleRoomInfo);
      socket.on("error", handleError);
      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);

      // Listen for global file updates
      window.addEventListener("file-updated", handleGlobalFileUpdate as EventListener);

      // Cleanup
      return () => {
        socket.off("file-created", handleRemoteFileCreate);
        socket.off("file-deleted", handleRemoteFileDelete);
        socket.off("file-renamed", handleRemoteFileRename);
        socket.off("code-changed", handleRemoteCodeChange);
        socket.off("file-list-updated", handleFileListUpdate);
        socket.off("user-joined", handleUserJoined);
        socket.off("user-left", handleUserLeft);
        socket.off("room-info", handleRoomInfo);
        socket.off("error", handleError);
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        window.removeEventListener("file-updated", handleGlobalFileUpdate as EventListener);
      };
    }
  }, [socket, roomId, activeFile]);

  // Load files on component mount
  useEffect(() => {
    const loadFiles = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}/files`);
        if (response.ok) {
          const data = await response.json();
          setFiles(data);
          if (data.length > 0 && !activeFile) {
            setActiveFile(data[0]);
          }
        }
      } catch (error) {
        console.error("Failed to load files:", error);
      }
    };

    if (roomId) {
      loadFiles();
    }
  }, [roomId, activeFile]);

  if (loading || status === "loading") {
    return <LoadingSpinner />;
  }

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please Sign In</h1>
          <Link href="/login" className="text-purple-400 hover:text-purple-300">
            Sign In
          </Link>
        </div>
      </div>
    );
  }



  return (
    <div className="flex h-screen w-full bg-background">
      {/* Small Left Sidebar - Icons Only */}
      <div className="w-16 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 space-y-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">&lt;&gt;</span>
          </div>
        </div>

        {/* Navigation Icons */}
        {navItems.map((item) => (
          <button
            key={item.tab}
            onClick={() => handleTabChange(item.tab)}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
              activeTab === item.tab
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            )}
            title={item.label}
          >
            <item.icon size={20} />
          </button>
        ))}


      </div>

      {/* File Creation Sidebar - Bigger and more professional */}
      <FileCreationSidebar
        files={files}
        activeFile={activeFile}
        onFileChange={handleActiveFileChange}
        onFileCreate={(file) => setFiles(prev => [...prev, file])}
        onFileDelete={(fileId) => setFiles(prev => prev.filter(f => f._id !== fileId))}
        onFileRename={(fileId, newName) => setFiles(prev => prev.map(f => f._id === fileId ? { ...f, name: newName } : f))}
        isOpen={showFileSidebar}
        onClose={() => setShowFileSidebar(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
          {/* Left side - IDE Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">&lt;&gt;</span>
              </div>
              <div>
                <h1 className="text-white font-semibold">Collaborative IDE</h1>
                <p className="text-xs text-gray-400">Real-time code editing</p>
              </div>
            </div>
          </div>

          {/* Center - Connection Status */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
              <span className={cn(
                "text-sm font-medium",
                isConnected ? "text-green-400" : "text-red-400"
              )}>
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center space-x-3">
            {/* Live Button */}
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs">Live</span>
              </div>
            </Badge>

            {/* File Explorer Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFileSidebar(!showFileSidebar)}
              className="bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20"
            >
              <Folder className="w-4 h-4 mr-2" />
              Files
            </Button>

            {/* Terminal Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTerminal(!showTerminal)}
              className={cn(
                "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
                showTerminal && "bg-blue-500/20 text-blue-300"
              )}
            >
              <Terminal className="w-4 h-4 mr-2" />
              Terminal
            </Button>

            {/* Canvas Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCanvas(!showCanvas)}
              className={cn(
                "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
                showCanvas && "bg-purple-500/20 text-purple-300"
              )}
            >
              <Palette className="w-4 h-4 mr-2" />
              Canvas
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Content with Resizable Panels */}
        <div className="flex-1 flex">
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            {/* Left Panel - Tab Content */}
            <ResizablePanel defaultSize={showCanvas || showTerminal ? 70 : 100} minSize={30}>
              <div className="h-full bg-gray-900">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                  <TabsList className="bg-gray-800 border-b border-gray-700 rounded-none">
                    <TabsTrigger value="code" className="data-[state=active]:bg-gray-700">
                      <Code className="w-4 h-4 mr-2" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="data-[state=active]:bg-gray-700">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </TabsTrigger>
                    <TabsTrigger value="calling" className="data-[state=active]:bg-gray-700">
                      <Phone className="w-4 h-4 mr-2" />
                      Audio Call
                    </TabsTrigger>
                    <TabsTrigger value="video" className="data-[state=active]:bg-gray-700">
                      <Video className="w-4 h-4 mr-2" />
                      Video Call
                    </TabsTrigger>
                    <TabsTrigger value="collaborators" className="data-[state=active]:bg-gray-700">
                      <Users className="w-4 h-4 mr-2" />
                      Collaborators
                    </TabsTrigger>
                    <TabsTrigger value="files" className="data-[state=active]:bg-gray-700">
                      <FileText className="w-4 h-4 mr-2" />
                      Files
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="data-[state=active]:bg-gray-700">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex-1 overflow-hidden">
                    <TabsContent value="code" className="h-full m-0">
                      <CollaborativeCodeEditor
                        roomId={roomId as string}
                        fileId={activeFile?._id || ""}
                        initialCode={activeFile?.content || ""}
                        language={activeFile?.language || "javascript"}
                        onCodeChange={handleCodeChange}
                      />
                    </TabsContent>

                    <TabsContent value="chat" className="h-full m-0">
                      <ChatTabContent />
                    </TabsContent>

                    <TabsContent value="calling" className="h-full m-0">
                      <ResizableCallPanel 
                        roomID={roomId as string}
                        userID={session?.user?.id || ""}
                        userName={session?.user?.name || "Anonymous"}
                        audioOnly={true}
                      />
                    </TabsContent>

                    <TabsContent value="video" className="h-full m-0">
                      <ResizableCallPanel 
                        roomID={roomId as string}
                        userID={session?.user?.id || ""}
                        userName={session?.user?.name || "Anonymous"}
                        audioOnly={false}
                      />
                    </TabsContent>

                    <TabsContent value="collaborators" className="h-full m-0">
                      <CollaboratorsTabContent />
                    </TabsContent>

                    <TabsContent value="files" className="h-full m-0">
                      <FilesTabContent 
                        files={files}
                        activeFile={activeFile}
                        onChangeActiveFile={handleActiveFileChange}
                        onFileCreate={(file) => setFiles(prev => [...prev, file])}
                        onFileDelete={(fileId) => setFiles(prev => prev.filter(f => f._id !== fileId))}
                        onFileRename={(fileId, newName) => setFiles(prev => prev.map(f => f._id === fileId ? { ...f, name: newName } : f))}
                      />
                    </TabsContent>

                    <TabsContent value="settings" className="h-full m-0">
                      <SettingsTabContent />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </ResizablePanel>

            {/* Right Panel - Canvas or Terminal */}
            {(showCanvas || showTerminal) && (
              <>
                <ResizableHandle />
                <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                  {showCanvas && (
                    <div className="h-full bg-white border-l border-gray-800">
                      <div className="h-full flex flex-col">
                        {/* Canvas Header */}
                        <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
                          <div className="flex items-center space-x-2">
                            <Palette className="w-4 h-4 text-purple-500" />
                            <h2 className="text-sm font-semibold text-white">Canvas</h2>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowCanvas(false)}
                            className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 text-xs"
                          >
                            Close
                          </Button>
                        </div>
                        {/* Canvas Content */}
                        <div className="flex-1">
                          <Whiteboard roomId={roomId as string} />
                        </div>
                      </div>
                    </div>
                  )}
                  {showTerminal && (
                    <div className="h-full bg-gray-900 border-l border-gray-800">
                      <div className="h-full flex flex-col">
                        {/* Terminal Header */}
                        <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
                          <div className="flex items-center space-x-2">
                            <Terminal className="w-4 h-4 text-blue-500" />
                            <h2 className="text-sm font-semibold text-white">Terminal</h2>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowTerminal(false)}
                            className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 text-xs"
                          >
                            Close
                          </Button>
                        </div>
                        {/* Terminal Content */}
                        <div className="flex-1">
                          <IDETerminal isOpen={showTerminal} onClose={() => setShowTerminal(false)} />
                        </div>
                      </div>
                    </div>
                  )}
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>


      </div>
    </div>
  );
};

export default page;

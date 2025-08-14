'use client';
import React, { useState } from "react";
import CollaborativeCodeEditor from "@/components/room/CollaborativeCodeEditor";
import IDETerminal from "./Terminal";
import { IFile } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Terminal as TerminalIcon, X } from "lucide-react";

interface IDELayoutProps {
  activeFile: IFile | null;
  roomId: string;
  onCodeChange?: (code: string) => void;
  onFileOperation?: (operation: string, path: string) => void;
}

const IDELayout: React.FC<IDELayoutProps> = ({
  activeFile,
  roomId,
  onCodeChange,
  onFileOperation,
}) => {
  const [showTerminal, setShowTerminal] = useState(false);

  const handleFileOperation = (operation: string, path: string) => {
    if (onFileOperation) {
      onFileOperation(operation, path);
    }
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Terminal Toggle */}
      <div className="flex items-center justify-between p-2 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTerminal(!showTerminal)}
            className="text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <TerminalIcon className="w-4 h-4 mr-2" />
            {showTerminal ? "Hide Terminal" : "Show Terminal"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {activeFile ? (
          <div className="flex-1">
            <CollaborativeCodeEditor
              key={activeFile._id}
              roomId={roomId}
              fileId={activeFile._id}
              initialCode={activeFile.content || ""}
              language={activeFile.language || "javascript"}
              onCodeChange={onCodeChange}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-900 text-gray-400">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl font-bold">&lt;&gt;</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Welcome to Collaborative IDE</h2>
              <p className="text-gray-400 mb-6">Select a file from the explorer to start coding</p>
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Real-time collaboration enabled</span>
              </div>
            </div>
          </div>
        )}

        {/* Terminal */}
        {showTerminal && (
          <div className="h-64 border-t border-gray-800">
            <IDETerminal
              roomId={roomId}
              onFileOperation={handleFileOperation}
              height="100%"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default IDELayout; 
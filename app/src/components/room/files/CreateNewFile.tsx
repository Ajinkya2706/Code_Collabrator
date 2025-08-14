import React, { useRef, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getLanguageNameFromFileName } from "@/lib/getLanguageName";
import { saveFile } from "@/services/file-services";
import { useSocket } from "@/providers/SocketProvider";
import { FileText, Plus, Sparkles, Loader2 } from "lucide-react";

interface CreateNewFileProps {
  onClose: () => void;
  onFileCreate: (file: any) => void;
}

const CreateNewFile: React.FC<CreateNewFileProps> = ({
  onClose,
  onFileCreate,
}) => {
  const { roomId } = useParams();
  const { socket, isConnected } = useSocket();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCreateFile = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isCreating) {
      const trimmedFileName = fileName.trim();
      if (trimmedFileName) {
        setIsCreating(true);
        
        // Create the new file object
        const newFile = {
          _id: "temp-" + Date.now(),
          name: trimmedFileName,
          content: "",
          language: getLanguageNameFromFileName(trimmedFileName),
          roomId: roomId as string,
          createdBy: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // Emit file creation event to other clients FIRST
        if (isConnected && socket && roomId) {
          console.log('Emitting file-create event:', { roomId, file: newFile });
          socket.emit('file-create', { roomId, file: newFile });
        }
        
        // Save to database
        try {
        const res = await saveFile(newFile, roomId as string);
        if (res.status === 201) {
            // Use the saved file data
          onFileCreate(res.data);
          } else {
            // Use the temporary file data
            onFileCreate(newFile);
          }
        } catch (error) {
          console.error('Error saving file:', error);
          // Use the temporary file data even if save fails
          onFileCreate(newFile);
        }
        
        setFileName('');
        setIsCreating(false);
        onClose();
        }
      }
  };

  const handleBlur = () => {
    // Only close if not creating and input is empty
    if (!isCreating && !fileName.trim()) {
      onClose();
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="relative">
        {/* Input Field */}
        <div className="relative flex items-center">
          <div className="absolute left-3 text-gray-400">
            {isCreating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
          </div>
          
          <input
          ref={inputRef}
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name (e.g., index.js)"
            className={`w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 ${
              isCreating ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          onKeyDown={handleCreateFile}
            onBlur={handleBlur}
            disabled={isCreating}
          />
          
          {/* Create Button */}
          <button
            onClick={() => handleCreateFile({ key: 'Enter' } as React.KeyboardEvent)}
            disabled={isCreating || !fileName.trim()}
            className={`absolute right-2 p-1.5 rounded-md transition-all duration-200 ${
              isCreating || !fileName.trim()
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/20'
            }`}
            title="Create file (Enter)"
          >
            {isCreating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
        
        {/* Helper Text */}
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Sparkles className="w-3 h-3" />
          <span>Press Enter to create, or click the + button</span>
        </div>
        
        {/* File Type Preview */}
        {fileName.trim() && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-gray-500 dark:text-gray-400">File type:</span>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-md font-medium">
              {getLanguageNameFromFileName(fileName.trim())}
            </span>
      </div>
        )}
      </div>
    </div>
  );
};

export default CreateNewFile;

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IFile } from "@/types/types";
import { Plus, Folder, File as FileIcon, MoreVertical, Edit, Trash2, FolderPlus, Terminal, Code } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { createFile, deleteFile, updateFile } from "@/services/file-services";
import { useParams } from "next/navigation";
import { getUser } from "@/services/auth-services";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface FilesTabContentProps {
  files: IFile[];
  activeFile: IFile | null;
  onChangeActiveFile: (file: IFile) => void;
  onFileCreate: (file: IFile) => void;
  onFileDelete: (fileId: string) => void;
  onFileRename: (fileId: string, newName: string) => void;
}

const FilesTabContent: React.FC<FilesTabContentProps> = ({
  files,
  activeFile,
  onChangeActiveFile,
  onFileCreate,
  onFileDelete,
  onFileRename,
}) => {
  const [newFileName, setNewFileName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingFileName, setEditingFileName] = useState("");
  const [terminalCommand, setTerminalCommand] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("files");
  const params = useParams();
  const roomId = params.roomId as string;
  const user = getUser();
  const { data: session } = useSession();

  // Terminal command execution
  const executeTerminalCommand = async (command: string) => {
    if (!command.trim()) return;

    try {
      const response = await fetch('/api/terminal/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: command.trim(),
          roomId,
          cwd: process.cwd(),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setTerminalOutput(prev => [...prev, `$ ${command}`, data.output]);
      } else {
        setTerminalOutput(prev => [...prev, `$ ${command}`, `Error: ${data.error}`]);
      }
    } catch (error) {
      console.error('Failed to execute command:', error);
      setTerminalOutput(prev => [...prev, `$ ${command}`, `Error: Failed to execute command`]);
    }
    
    setTerminalCommand("");
  };

  const handleTerminalKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeTerminalCommand(terminalCommand);
    }
  };

  const clearTerminal = () => {
    setTerminalOutput([]);
  };

  const handleCreateFile = async () => {
    if (!newFileName.trim()) return;

    setIsCreating(true);
    try {
      const res = await createFile(roomId, newFileName, "javascript");
      if (res.status === 201) {
        onFileCreate(res.data);
        setNewFileName("");
        toast.success("File created successfully!");
      } else {
        toast.error("Failed to create file");
      }
    } catch (error: any) {
      console.error("Error creating file:", error);
      toast.error(error.response?.data?.message || "Failed to create file");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    setIsCreatingFolder(true);
    try {
      // Ensure folder name ends with /
      const folderName = newFolderName.trim().endsWith('/') 
        ? newFolderName.trim() 
        : `${newFolderName.trim()}/`;
      
      console.log("Creating folder:", { roomId, name: folderName, language: "folder" });
      
      // Create a folder by using a special language type
      const res = await createFile(roomId, folderName, "folder");
      console.log("Folder creation response:", res);
      
      if (res.status === 201) {
        onFileCreate(res.data);
        setNewFolderName("");
        toast.success("Folder created successfully!");
      } else {
        console.error("Folder creation failed:", res);
        toast.error("Failed to create folder");
      }
    } catch (error: any) {
      console.error("Error creating folder:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create folder";
      toast.error(errorMessage);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const res = await deleteFile(fileId);
      if (res.status === 200) {
        onFileDelete(fileId);
        toast.success("File deleted successfully!");
      } else {
        toast.error("Failed to delete file");
      }
    } catch (error: any) {
      console.error("Error deleting file:", error);
      toast.error(error.response?.data?.message || "Failed to delete file");
    }
  };

  const handleRenameFile = async (fileId: string, newName: string) => {
    try {
      const res = await updateFile(fileId, { name: newName });
      if (res.status === 200) {
        onFileRename(fileId, newName);
        setEditingFileId(null);
        setEditingFileName("");
        toast.success("File renamed successfully!");
      } else {
        toast.error("Failed to rename file");
      }
    } catch (error: any) {
      console.error("Error renaming file:", error);
      toast.error(error.response?.data?.message || "Failed to rename file");
    }
  };

  const startEditing = (file: IFile) => {
    setEditingFileId(file._id);
    setEditingFileName(file.name);
  };

  const getFileIcon = (fileName: string, language?: string) => {
    if (isFolder(fileName, language)) {
      return <Folder className="w-4 h-4 text-blue-500" />;
    }
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return <FileIcon className="w-4 h-4 text-yellow-500" />;
      case 'ts':
      case 'tsx':
        return <FileIcon className="w-4 h-4 text-blue-600" />;
      case 'html':
        return <FileIcon className="w-4 h-4 text-orange-500" />;
      case 'css':
        return <FileIcon className="w-4 h-4 text-purple-500" />;
      case 'json':
        return <FileIcon className="w-4 h-4 text-green-500" />;
      case 'md':
        return <FileIcon className="w-4 h-4 text-gray-500" />;
      default:
        return <FileIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const isFolder = (fileName: string, language?: string) => {
    return fileName.endsWith('/') || language === 'folder';
  };

  const getFolderPath = (fileName: string) => {
    return fileName.substring(0, fileName.lastIndexOf('/') + 1);
  };

  const getFileName = (fileName: string) => {
    if (fileName.endsWith('/')) {
      return fileName.substring(0, fileName.length - 1).split('/').pop() || fileName;
    }
    return fileName.split('/').pop() || fileName;
  };

  const handleCreateFileInFolder = async (folderPath: string) => {
    const fileName = prompt("Enter file name:");
    if (!fileName) return;

    const fullPath = `${folderPath}${fileName}`;
    setIsCreating(true);
    try {
      const res = await createFile(roomId, fullPath, "javascript");
      if (res.status === 201) {
        onFileCreate(res.data);
        toast.success("File created successfully!");
      } else {
        toast.error("Failed to create file");
      }
    } catch (error: any) {
      console.error("Error creating file:", error);
      toast.error(error.response?.data?.message || "Failed to create file");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateFolderInFolder = async (parentFolderPath: string) => {
    const folderName = prompt("Enter folder name:");
    if (!folderName) return;

    const fullPath = `${parentFolderPath}${folderName}/`;
    setIsCreatingFolder(true);
    try {
      const res = await createFile(roomId, fullPath, "folder");
      if (res.status === 201) {
        onFileCreate(res.data);
        toast.success("Folder created successfully!");
      } else {
        toast.error("Failed to create folder");
      }
    } catch (error: any) {
      console.error("Error creating folder:", error);
      toast.error(error.response?.data?.message || "Failed to create folder");
    } finally {
      setIsCreatingFolder(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="bg-gray-800 border-b border-gray-700 rounded-none">
          <TabsTrigger value="files" className="data-[state=active]:bg-gray-700">
            <FileIcon className="w-4 h-4 mr-2" />
            Files
          </TabsTrigger>
          <TabsTrigger value="terminal" className="data-[state=active]:bg-gray-700">
            <Terminal className="w-4 h-4 mr-2" />
            Terminal
          </TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-gray-700">
            <Plus className="w-4 h-4 mr-2" />
            Create
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          {/* Files Tab */}
          <TabsContent value="files" className="h-full m-0">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-white font-semibold mb-2">Project Files</h3>
                <p className="text-gray-400 text-sm">Manage your project files and folders</p>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-2">
                  {files.length === 0 ? (
                    <div className="text-center py-8">
                      <Folder className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No files yet. Create your first file!</p>
                    </div>
                  ) : (
                    files.map((file) => (
                      <div
                        key={file._id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                          activeFile?._id === file._id
                            ? "bg-purple-600/20 border border-purple-500/30"
                            : "bg-gray-800 hover:bg-gray-700"
                        )}
                        onClick={() => onChangeActiveFile(file)}
                      >
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.name, file.language)}
                          <div>
                            <span className="text-white font-medium">
                              {getFileName(file.name)}
                            </span>
                            {isFolder(file.name, file.language) && (
                              <span className="text-gray-400 text-sm ml-2">
                                {getFolderPath(file.name)}
                              </span>
                            )}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-gray-800 border-gray-700">
                            <DropdownMenuItem
                              onClick={() => startEditing(file)}
                              className="text-gray-300 hover:bg-gray-700"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            {isFolder(file.name, file.language) && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleCreateFileInFolder(file.name)}
                                  className="text-gray-300 hover:bg-gray-700"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Create File
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleCreateFolderInFolder(file.name)}
                                  className="text-gray-300 hover:bg-gray-700"
                                >
                                  <FolderPlus className="w-4 h-4 mr-2" />
                                  Create Folder
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDeleteFile(file._id)}
                              className="text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          {/* Terminal Tab */}
          <TabsContent value="terminal" className="h-full m-0">
            <div className="h-full flex flex-col bg-gray-900">
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Terminal</h3>
                  <Button variant="outline" size="sm" onClick={clearTerminal} className="text-gray-400">
                    Clear
                  </Button>
                </div>
                <p className="text-gray-400 text-sm">Execute commands in your project directory</p>
              </div>
              
              <div className="flex-1 p-4">
                <div className="h-full bg-black rounded-lg p-4 font-mono text-sm">
                  <ScrollArea className="h-full">
                    <div className="space-y-1">
                      {terminalOutput.length === 0 && (
                        <div className="text-green-400">
                          <div>Welcome to the Web IDE Terminal!</div>
                          <div>Type your commands below and press Enter to execute.</div>
                        </div>
                      )}
                      {terminalOutput.map((line, index) => (
                        <div key={index} className={cn(
                          "whitespace-pre-wrap",
                          line.startsWith('$ ') ? "text-blue-400" : "text-green-400"
                        )}>
                          {line}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="mt-4 flex items-center space-x-2">
                  <span className="text-green-400 font-mono">$</span>
                  <Input
                    value={terminalCommand}
                    onChange={(e) => setTerminalCommand(e.target.value)}
                    onKeyPress={handleTerminalKeyPress}
                    placeholder="Enter command..."
                    className="flex-1 bg-gray-800 border-gray-700 text-white font-mono"
                  />
                  <Button onClick={() => executeTerminalCommand(terminalCommand)} size="sm">
                    Execute
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Create Tab */}
          <TabsContent value="create" className="h-full m-0">
            <div className="h-full flex flex-col bg-gray-900">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-white font-semibold">Create New</h3>
                <p className="text-gray-400 text-sm">Create new files and folders</p>
              </div>
              
              <div className="flex-1 p-4 space-y-6">
                {/* Create File */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <FileIcon className="w-4 h-4 mr-2" />
                    Create New File
                  </h4>
                  <div className="space-y-3">
                    <Input
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder="Enter file name (e.g., index.js)"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Button 
                      onClick={handleCreateFile} 
                      disabled={isCreating || !newFileName.trim()}
                      className="w-full"
                    >
                      {isCreating ? "Creating..." : "Create File"}
                    </Button>
                  </div>
                </div>

                {/* Create Folder */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <Folder className="w-4 h-4 mr-2" />
                    Create New Folder
                  </h4>
                  <div className="space-y-3">
                    <Input
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Enter folder name"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Button 
                      onClick={handleCreateFolder} 
                      disabled={isCreatingFolder || !newFolderName.trim()}
                      className="w-full"
                    >
                      {isCreatingFolder ? "Creating..." : "Create Folder"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default FilesTabContent;

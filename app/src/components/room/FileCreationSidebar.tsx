"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IFile } from "@/types/types";
import { Plus, Folder, File as FileIcon, MoreVertical, Edit, Trash2, FolderPlus, X, Code, FileText, Image, Database, Settings, ChevronRight, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { createFile, deleteFile, updateFile } from "@/services/file-services";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface FileCreationSidebarProps {
  files: IFile[];
  activeFile: IFile | null;
  onFileChange: (file: IFile) => void;
  onFileCreate: (file: IFile) => void;
  onFileDelete: (fileId: string) => void;
  onFileRename: (fileId: string, newName: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FileCreationSidebar: React.FC<FileCreationSidebarProps> = ({
  files,
  activeFile,
  onFileChange,
  onFileCreate,
  onFileDelete,
  onFileRename,
  isOpen,
  onClose,
}) => {
  const [newFileName, setNewFileName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingFileName, setEditingFileName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const params = useParams();
  const roomId = params.roomId as string;

  const languageOptions = [
    { value: "javascript", label: "JavaScript", icon: Code },
    { value: "typescript", label: "TypeScript", icon: Code },
    { value: "html", label: "HTML", icon: FileText },
    { value: "css", label: "CSS", icon: FileText },
    { value: "json", label: "JSON", icon: Database },
    { value: "md", label: "Markdown", icon: FileText },
    { value: "py", label: "Python", icon: Code },
    { value: "java", label: "Java", icon: Code },
    { value: "cpp", label: "C++", icon: Code },
    { value: "c", label: "C", icon: Code },
    { value: "php", label: "PHP", icon: Code },
    { value: "rb", label: "Ruby", icon: Code },
    { value: "go", label: "Go", icon: Code },
    { value: "rs", label: "Rust", icon: Code },
    { value: "sql", label: "SQL", icon: Database },
    { value: "xml", label: "XML", icon: FileText },
    { value: "yaml", label: "YAML", icon: FileText },
    { value: "toml", label: "TOML", icon: FileText },
    { value: "sh", label: "Shell", icon: Settings },
    { value: "bat", label: "Batch", icon: Settings },
    { value: "ps1", label: "PowerShell", icon: Settings },
  ];

  const handleCreateFile = async () => {
    if (!newFileName.trim()) return;

    setIsCreating(true);
    try {
      const res = await createFile(roomId, newFileName, selectedLanguage);
      if (res.status === 201) {
        onFileCreate(res.data);
        setNewFileName("");
        setShowCreateMenu(false);
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
      const folderName = newFolderName.trim().endsWith('/') 
        ? newFolderName.trim() 
        : `${newFolderName.trim()}/`;
      
      const res = await createFile(roomId, folderName, "folder");
      
      if (res.status === 201) {
        onFileCreate(res.data);
        setNewFolderName("");
        setShowCreateMenu(false);
        setExpandedFolders(prev => new Set([...prev, folderName]));
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

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderName)) {
        newSet.delete(folderName);
      } else {
        newSet.add(folderName);
      }
      return newSet;
    });
  };

  const getFileIcon = (fileName: string, language?: string) => {
    if (isFolder(fileName, language)) {
      return <Folder className="w-4 h-4 text-blue-500" />;
    }
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return <Code className="w-4 h-4 text-yellow-500" />;
      case 'ts':
      case 'tsx':
        return <Code className="w-4 h-4 text-blue-600" />;
      case 'html':
        return <FileText className="w-4 h-4 text-orange-500" />;
      case 'css':
      case 'scss':
      case 'sass':
        return <FileText className="w-4 h-4 text-purple-500" />;
      case 'json':
        return <Database className="w-4 h-4 text-green-500" />;
      case 'md':
        return <FileText className="w-4 h-4 text-gray-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <Image className="w-4 h-4 text-pink-500" />;
      case 'py':
        return <Code className="w-4 h-4 text-blue-400" />;
      case 'java':
        return <Code className="w-4 h-4 text-red-500" />;
      case 'cpp':
      case 'c':
        return <Code className="w-4 h-4 text-blue-700" />;
      case 'php':
        return <Code className="w-4 h-4 text-purple-600" />;
      case 'rb':
        return <Code className="w-4 h-4 text-red-400" />;
      case 'go':
        return <Code className="w-4 h-4 text-cyan-500" />;
      case 'rs':
        return <Code className="w-4 h-4 text-orange-600" />;
      case 'sql':
        return <Database className="w-4 h-4 text-blue-500" />;
      case 'xml':
        return <FileText className="w-4 h-4 text-orange-400" />;
      case 'yaml':
      case 'yml':
        return <FileText className="w-4 h-4 text-green-400" />;
      case 'toml':
        return <FileText className="w-4 h-4 text-blue-300" />;
      case 'sh':
      case 'bat':
      case 'ps1':
        return <Settings className="w-4 h-4 text-gray-600" />;
      default:
        return <FileIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const isFolder = (fileName: string, language?: string) => {
    return fileName.endsWith('/') || language === 'folder';
  };

  const getFileName = (fileName: string) => {
    if (fileName.endsWith('/')) {
      return fileName.substring(0, fileName.length - 1).split('/').pop() || fileName;
    }
    return fileName.split('/').pop() || fileName;
  };

  const renderFileTree = (fileList: IFile[], level = 0) => {
    return fileList.map((file) => {
      const isFolderFile = isFolder(file.name, file.language);
      const fileName = getFileName(file.name);
      const isExpanded = expandedFolders.has(file.name);
      const isActive = activeFile?._id === file._id;

      return (
        <div key={file._id} className="select-none">
          <div
            className={cn(
              "flex items-center px-2 py-1 cursor-pointer hover:bg-gray-700/50 transition-colors",
              isActive && "bg-blue-600/20 border-r-2 border-blue-500",
              level > 0 && "ml-4"
            )}
            onClick={() => {
              if (isFolderFile) {
                toggleFolder(file.name);
              } else {
                onFileChange(file);
              }
            }}
          >
            {/* Indentation */}
            <div className="flex items-center" style={{ width: level * 16 }}>
              {level > 0 && <div className="w-4 h-4 border-l border-gray-600" />}
            </div>

            {/* Folder expand/collapse icon */}
            {isFolderFile && (
              <div className="w-4 h-4 mr-1">
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                )}
              </div>
            )}

            {/* File/Folder icon */}
            <div className="w-4 h-4 mr-2">
              {getFileIcon(file.name, file.language)}
            </div>

            {/* File name */}
            <span className={cn(
              "text-sm truncate flex-1",
              isActive ? "text-white font-medium" : "text-gray-300"
            )}>
              {fileName}
            </span>

            {/* Context menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-3 h-3" />
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

          {/* Render children if folder is expanded */}
          {isFolderFile && isExpanded && (
            <div className="ml-4">
              {renderFileTree(
                fileList.filter(f => 
                  f.name.startsWith(file.name) && 
                  f.name !== file.name &&
                  f.name.split('/').length === file.name.split('/').length
                ),
                level + 1
              )}
            </div>
          )}
        </div>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      {/* Header */}
      <div className="h-12 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4">
        <h3 className="text-white font-semibold text-sm flex items-center">
          <Folder className="w-4 h-4 mr-2 text-blue-500" />
          EXPLORER
        </h3>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className="text-gray-400 hover:text-white h-6 w-6 p-0"
            title="New File/Folder"
          >
            <Plus className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Create Menu */}
      {showCreateMenu && (
        <div className="p-4 border-b border-gray-800 bg-gray-950">
          <h4 className="text-white font-medium mb-3 text-sm">Create New</h4>
          
          {/* Create File */}
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">File Type</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">File Name</label>
              <Input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="e.g., index.js"
                className="bg-gray-800 border-gray-700 text-white text-xs h-8"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateFile();
                  }
                }}
              />
            </div>
            
            <Button 
              onClick={handleCreateFile} 
              disabled={isCreating || !newFileName.trim()}
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700 h-8 text-xs"
            >
              {isCreating ? "Creating..." : "Create File"}
            </Button>
          </div>

          {/* Create Folder */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Folder Name</label>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g., components"
                className="bg-gray-800 border-gray-700 text-white text-xs h-8"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateFolder();
                  }
                }}
              />
            </div>
            
            <Button 
              onClick={handleCreateFolder} 
              disabled={isCreatingFolder || !newFolderName.trim()}
              size="sm"
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 h-8 text-xs"
            >
              {isCreatingFolder ? "Creating..." : "Create Folder"}
            </Button>
          </div>
        </div>
      )}

      {/* Files Tree */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {files.length === 0 ? (
            <div className="text-center py-8">
              <Folder className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-1">No files yet</p>
              <p className="text-xs text-gray-500">Create your first file to get started</p>
            </div>
          ) : (
            <div className="space-y-1">
              {renderFileTree(files)}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Rename Modal */}
      {editingFileId && (
        <div className="p-4 border-t border-gray-800 bg-gray-950">
          <h4 className="text-white font-medium mb-3 text-sm">Rename File</h4>
          <div className="space-y-3">
            <Input
              value={editingFileName}
              onChange={(e) => setEditingFileName(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleRenameFile(editingFileId, editingFileName);
                }
              }}
            />
            <div className="flex space-x-2">
              <Button
                onClick={() => handleRenameFile(editingFileId, editingFileName)}
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Rename
              </Button>
              <Button
                onClick={() => {
                  setEditingFileId(null);
                  setEditingFileName("");
                }}
                size="sm"
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileCreationSidebar; 
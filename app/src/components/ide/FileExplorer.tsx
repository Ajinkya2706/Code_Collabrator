import React, { useState } from 'react';
import { IDEFileNode, FileType } from './types';
import { generateId } from './utils';
import { 
  FileText, 
  Folder, 
  FolderOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  ChevronDown,
  File,
  FileCode,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileType2
} from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface FileExplorerProps {
  tree: IDEFileNode[];
  onSelect: (id: string) => void;
  onAdd: (parentId: string | null, type: FileType) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  selectedId: string | null;
}

// Get file icon based on file extension
const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return <FileCode className="w-4 h-4 text-yellow-500" />;
    case 'html':
    case 'htm':
      return <FileCode className="w-4 h-4 text-orange-500" />;
    case 'css':
    case 'scss':
    case 'sass':
      return <FileCode className="w-4 h-4 text-blue-500" />;
    case 'json':
      return <FileCode className="w-4 h-4 text-green-500" />;
    case 'md':
    case 'txt':
      return <FileText className="w-4 h-4 text-gray-500" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return <FileImage className="w-4 h-4 text-purple-500" />;
    case 'mp4':
    case 'avi':
    case 'mov':
      return <FileVideo className="w-4 h-4 text-red-500" />;
    case 'mp3':
    case 'wav':
    case 'flac':
      return <FileAudio className="w-4 h-4 text-pink-500" />;
    case 'zip':
    case 'rar':
    case '7z':
      return <FileArchive className="w-4 h-4 text-orange-600" />;
    default:
      return <File className="w-4 h-4 text-gray-400" />;
  }
};

const FileNode: React.FC<{
  node: IDEFileNode;
  onSelect: (id: string) => void;
  onAdd: (parentId: string | null, type: FileType) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  selectedId: string | null;
  level: number;
}> = ({ node, onSelect, onAdd, onDelete, onRename, selectedId, level }) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(node.name);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRename = () => {
    if (newName.trim() && newName !== node.name) {
      onRename(node.id, newName.trim());
    }
    setIsRenaming(false);
  };

  const isSelected = selectedId === node.id;
  const isFolder = node.type === 'folder';

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={`group ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
          onClick={() => onSelect(node.id)}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {/* Expand/Collapse arrow for folders */}
          {isFolder && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="mr-1 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          )}
          {/* File/Folder Icon */}
          <div className="mr-2 flex-shrink-0">
            {isFolder ? (
              isExpanded ? (
                <FolderOpen className="w-4 h-4 text-blue-500" />
              ) : (
                <Folder className="w-4 h-4 text-blue-500" />
              )
            ) : (
              getFileIcon(node.name)
            )}
          </div>
          {/* File/Folder Name */}
          <div className="flex-1 min-w-0">
            {isRenaming ? (
              <input
                className="bg-transparent border-b border-blue-400 outline-none w-full text-sm px-1 py-0.5 rounded"
                value={newName}
                autoFocus
                onChange={e => setNewName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleRename();
                  if (e.key === 'Escape') setIsRenaming(false);
                }}
              />
            ) : (
              <span 
                className="truncate text-sm font-medium"
                onDoubleClick={() => setIsRenaming(true)}
                title={node.name}
              >
                {node.name}
              </span>
            )}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        {isFolder && (
          <>
            <ContextMenuItem onClick={() => onAdd(node.id, 'file')}>Add File</ContextMenuItem>
            <ContextMenuItem onClick={() => onAdd(node.id, 'folder')}>Add Folder</ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}
        <ContextMenuItem onClick={() => setIsRenaming(true)}>Rename</ContextMenuItem>
        <ContextMenuItem onClick={() => { if (window.confirm('Are you sure you want to delete this?')) onDelete(node.id); }} className="text-red-600">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

const renderTree = (
  nodes: IDEFileNode[],
  props: Omit<React.ComponentProps<typeof FileNode>, 'node' | 'level'>,
  level = 0
) =>
  nodes.map(node => (
    <FileNode key={node.id} {...props} node={node} level={level} />
  ));

const FileExplorer: React.FC<FileExplorerProps> = ({ tree, onSelect, onAdd, onDelete, onRename, selectedId }) => {
  return (
    <div className="w-64 min-w-[180px] max-w-[320px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-full flex flex-col shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" />
          <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">Files</span>
        </div>
        <div className="flex gap-1">
          <button
            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition-colors"
            title="Add file"
            onClick={() => onAdd(null, 'file')}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors"
            title="Add folder"
            onClick={() => onAdd(null, 'folder')}
          >
            <Folder className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* File Tree */}
      <div className="flex-1 overflow-y-auto py-2">
        {tree.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No files yet</p>
            <p className="text-xs mt-1">Create your first file to get started</p>
          </div>
        ) : (
          renderTree(tree, { onSelect, onAdd, onDelete, onRename, selectedId })
        )}
      </div>
    </div>
  );
};

export default FileExplorer; 
import React, { useState } from "react";
import { getFileIcon } from "@/lib/getFileIcon";
import { deleteFile } from "@/services/file-services";
import { Input } from "@/components/ui/input";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface FileComponentProps {
  fileName: string;
  fileId: string;
  onFileDelete: (fileId: string) => void;
  onFileRename?: (fileId: string, newName: string) => void;
}

export const FileComponent: React.FC<FileComponentProps> = ({
  fileName,
  fileId,
  onFileDelete,
  onFileRename,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newFileName, setNewFileName] = useState(fileName);

  const handleRename = () => {
    if (newFileName.trim() && newFileName !== fileName && onFileRename) {
      onFileRename(fileId, newFileName.trim());
    }
    setIsRenaming(false);
  };

  const handleRenameClick = () => {
    setIsRenaming(true);
    setNewFileName(fileName);
  };

  if (isRenaming) {
    return (
      <div className="flex items-center gap-2 w-full p-2">
        <div>{getFileIcon(fileName)}</div>
        <Input
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleRename();
            } else if (e.key === "Escape") {
              setIsRenaming(false);
              setNewFileName(fileName);
    }
          }}
          onBlur={handleRename}
          autoFocus
          className="h-6 text-sm"
        />
      </div>
    );
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex items-center gap-2 w-full p-2">
        <div>{getFileIcon(fileName)}</div>
        <div>{fileName}</div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem inset onClick={handleRenameClick}>
          Rename
          <ContextMenuShortcut>F2</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem inset>
          Save
          <ContextMenuShortcut></ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem inset variant="destructive" onClick={() => onFileDelete(fileId)}>
          Delete
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-44">
            <ContextMenuItem>Save Page...</ContextMenuItem>
            <ContextMenuItem>Create Shortcut...</ContextMenuItem>
            <ContextMenuItem>Name Window...</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer Tools</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
};

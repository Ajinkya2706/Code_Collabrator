export type FileType = 'file' | 'folder';

export interface IDEFileNode {
  id: string;
  name: string;
  type: FileType;
  children?: IDEFileNode[];
  parentId?: string;
  content?: string; // Only for files
}

export interface OpenTab {
  id: string;
  name: string;
  content: string;
  language: string;
  isDirty: boolean;
}

export interface EditorState {
  openTabs: OpenTab[];
  activeTabId: string | null;
  splitView: boolean;
} 
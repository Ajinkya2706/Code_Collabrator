import { IDEFileNode } from './types';

export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function findNodeById(tree: IDEFileNode[], id: string): IDEFileNode | null {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.type === 'folder' && node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function updateNodeById(tree: IDEFileNode[], id: string, updater: (node: IDEFileNode) => void): IDEFileNode[] {
  return tree.map(node => {
    if (node.id === id) {
      const newNode = { ...node };
      updater(newNode);
      return newNode;
    }
    if (node.type === 'folder' && node.children) {
      return { ...node, children: updateNodeById(node.children, id, updater) };
    }
    return node;
  });
}

export function deleteNodeById(tree: IDEFileNode[], id: string): IDEFileNode[] {
  return tree.filter(node => {
    if (node.id === id) return false;
    if (node.type === 'folder' && node.children) {
      node.children = deleteNodeById(node.children, id);
    }
    return true;
  });
}

export function detectLanguage(filename: string): string {
  if (filename.endsWith('.js')) return 'javascript';
  if (filename.endsWith('.ts')) return 'typescript';
  if (filename.endsWith('.py')) return 'python';
  if (filename.endsWith('.json')) return 'json';
  if (filename.endsWith('.css')) return 'css';
  if (filename.endsWith('.html')) return 'html';
  if (filename.endsWith('.md')) return 'markdown';
  return 'plaintext';
} 
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useSocket } from '@/providers/SocketProvider';
import { useSession } from "next-auth/react";
import { 
  Wifi, 
  WifiOff, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Code,
  Zap,
  Activity,
  Play,
  Bug
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Dynamically import Monaco Editor to avoid SSR issues
const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[#1e1e1e]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  ),
});

interface CollaborativeCodeEditorProps {
  roomId: string;
  fileId: string;
  initialCode: string;
  language: string;
  onCodeChange?: (code: string) => void;
}

const CollaborativeCodeEditor: React.FC<CollaborativeCodeEditorProps> = ({
  roomId,
  fileId,
  initialCode,
  language,
  onCodeChange,
}) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
  const [collaboratorsCount, setCollaboratorsCount] = useState(0);
  const { socket, isConnected: socketConnected, emitCodeChange, emitCursorMove, collaborators } = useSocket();
  const { data: session } = useSession();

  // Debouncing for code changes
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastEmittedCodeRef = useRef<string>('');

  useEffect(() => {
    setIsConnected(socketConnected);
    setCollaboratorsCount(collaborators.length);
  }, [socketConnected, collaborators]);

  // Debounced code change emission
  const debouncedEmitCodeChange = useCallback((code: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const userId = session?.user?.id;
      if (socketConnected && roomId && userId && code !== lastEmittedCodeRef.current) {
        console.log('🔄 Emitting debounced code change:', { 
          roomId, 
          fileId, 
          codeLength: code.length,
          sender: userId 
        });
        
        setSyncStatus('syncing');
        emitCodeChange({
          roomId,
          fileId,
          code,
          sender: userId,
        });
        lastEmittedCodeRef.current = code;
        
        // Reset sync status after a short delay
        setTimeout(() => setSyncStatus('synced'), 500);
      }
    }, 300); // 300ms debounce
  }, [socketConnected, roomId, session?.user, fileId, emitCodeChange]);

  // Enhanced code change handler with global updates
  const handleCodeChange = useCallback((value: string) => {
    if (!socket || !isConnected) return;

    const userId = (session?.user as any)?.id;
    const timestamp = Date.now();

    // Emit to current room for real-time sync
    emitCodeChange({
      roomId,
      fileId,
      code: value,
      sender: userId,
    });

    // Emit global file update for cross-file sync
    if (socket && isConnected) {
      socket.emit("file-update", {
        roomId,
        fileId,
        content: value,
        sender: userId,
        timestamp,
      });
    }

    // Update parent callback
    if (onCodeChange) {
      onCodeChange(value);
    }

    lastEmittedCodeRef.current = value;
    console.log('📤 Emitted code change:', { 
      fileId, 
      codeLength: value.length,
      timestamp 
    });
  }, [socket, isConnected, roomId, fileId, session?.user?.id, emitCodeChange, onCodeChange]);

  const handleEditorDidMount = async (editor: any) => {
    editorRef.current = editor;
    monacoRef.current = editor; // Keep monacoRef for now, though not used in new_code
    
    // Set initial content
    editor.setValue(initialCode);
    lastEmittedCodeRef.current = initialCode;

    // Handle local editor changes with enhanced logging
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      
      // Call the parent callback immediately for local updates
      if (onCodeChange) {
        onCodeChange(value);
      }
      
      // Emit code change via Socket.IO with debouncing
      debouncedEmitCodeChange(value);
    });

    // Handle cursor position changes
    editor.onDidChangeCursorPosition((e: any) => {
      const userId = session?.user?.id;
      if (socketConnected && roomId && userId) {
        emitCursorMove({
          roomId,
          fileId,
          position: e.position,
          sender: userId,
        });
      }
    });

    // Handle selection changes for better collaboration
    editor.onDidChangeCursorSelection((e: any) => {
      // You can emit selection changes here if needed
    });

    setIsEditorReady(true);
    console.log('✅ Editor mounted and ready for collaboration');
  };

  // Enhanced remote code updates handling
  useEffect(() => {
    if (!socket || !editorRef.current) return;

    const handleCodeUpdate = ({ fileId: remoteFileId, code, sender, timestamp }: { 
      fileId: string; 
      code: string; 
      sender: string;
      timestamp?: number;
    }) => {
      const userId = session?.user?.id;
      // Only update if not from this user and it's the same file
      if (sender === userId || remoteFileId !== fileId) return;
      
      console.log('📥 Received remote code update:', { 
        fileId, 
        sender, 
        codeLength: code.length,
        timestamp 
      });
      
      // Update the editor content
      if (editorRef.current) {
        const currentValue = editorRef.current.getValue();
        if (currentValue !== code) {
          console.log('🔄 Updating editor with remote code');
          
          // Temporarily disable change listener to avoid loops
          const model = editorRef.current.getModel();
          if (model) {
            model.setValue(code);
            lastEmittedCodeRef.current = code;
            
            // Call parent callback with updated content
            if (onCodeChange) {
              onCodeChange(code);
            }
          }
        }
      }
    };

    const handleCursorUpdate = ({ fileId: remoteFileId, position, sender, timestamp }: { 
      fileId: string; 
      position: any; 
      sender: string;
      timestamp?: number;
    }) => {
      const userId = session?.user?.id;
      // Only update if not from this user and it's the same file
      if (sender === userId || remoteFileId !== fileId) return;
      
      console.log('👆 Received remote cursor update:', { fileId, sender, timestamp });
      
      // You can implement cursor position visualization here
      // For now, we'll just log it
    };

    // Listen for room state updates (when joining)
    const handleRoomState = ({ files }: { files: Map<string, any> }) => {
      console.log('🏠 Received room state:', files);
      if (files.has(fileId)) {
        const fileData = files.get(fileId);
        if (fileData.content && editorRef.current) {
          const currentValue = editorRef.current.getValue();
          if (currentValue !== fileData.content) {
            console.log('🔄 Syncing with room state');
            editorRef.current.setValue(fileData.content);
            lastEmittedCodeRef.current = fileData.content;
            if (onCodeChange) {
              onCodeChange(fileData.content);
            }
          }
        }
      }
    };

    socket.on('code-update', handleCodeUpdate);
    socket.on('cursor-update', handleCursorUpdate);
    socket.on('room-state', handleRoomState);

    return () => {
      socket.off('code-update', handleCodeUpdate);
      socket.off('cursor-update', handleCursorUpdate);
      socket.off('room-state', handleRoomState);
    };
  }, [socket, session?.user, fileId, roomId, onCodeChange]);

  // Reset editor value when fileId or initialCode changes
  useEffect(() => {
    if (editorRef.current && typeof initialCode === 'string') {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== initialCode) {
        editorRef.current.setValue(initialCode);
        lastEmittedCodeRef.current = initialCode;
      }
    }
  }, [fileId, initialCode]);

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const getStatusIcon = () => {
    if (!isConnected) return <WifiOff className="w-4 h-4" />;
    switch (syncStatus) {
      case 'syncing': return <Clock className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    if (!isConnected) return 'bg-red-500/10 text-red-400 border-red-500/20';
    switch (syncStatus) {
      case 'syncing': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'error': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-green-500/10 text-green-400 border-green-500/20';
    }
  };

  const getStatusText = () => {
    if (!isConnected) return 'Disconnected';
    switch (syncStatus) {
      case 'syncing': return 'Syncing...';
      case 'error': return 'Sync Error';
      default: return 'Connected';
    }
  };

  const handleRunCode = async () => {
    if (!editorRef.current) return;
    
    const code = editorRef.current.getValue();
    const language = getLanguageFromExtension(initialCode?.split('.').pop() || ''); // Use initialCode for language detection
    
    try {
      // Create a temporary file to run
      const tempFileName = `temp_${Date.now()}.${getFileExtension(language)}`;
      
      // Execute code based on language
      let command = '';
      let output = '';
      
      switch (language) {
        case 'javascript':
        case 'js':
          command = `node -e "${code.replace(/"/g, '\\"')}"`;
          break;
        case 'python':
        case 'py':
          command = `python -c "${code.replace(/"/g, '\\"')}"`;
          break;
        case 'typescript':
        case 'ts':
          // For TypeScript, we'll need to compile first
          command = `echo "${code}" > temp.ts && npx tsc temp.ts && node temp.js`;
          break;
        default:
          toast.error(`Language ${language} is not supported for execution`);
          return;
      }
      
      const response = await fetch('/api/terminal/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command,
          roomId,
          cwd: '/tmp',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        output = result.output || 'Code executed successfully';
        
        // Show output in a modal or terminal
        toast.success('Code executed successfully!');
        console.log('Code output:', output);
        
        // You can also emit this to other users in the room
        if (socket && roomId) {
          socket.emit('code-executed', {
            roomId,
            fileId,
            output,
            language,
            executedBy: session?.user?.id
          });
        }
      } else {
        const error = await response.json();
        toast.error(`Execution failed: ${error.error || error.message}`);
      }
    } catch (error) {
      console.error('Code execution error:', error);
      toast.error('Failed to execute code');
    }
  };

  const handleDebugCode = () => {
    // TODO: Implement debugging
    toast.info('Debug feature coming soon!');
  };

  const getLanguageFromExtension = (extension: string): string => {
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'html': 'html',
      'htm': 'html',
      'css': 'css',
      'scss': 'css',
      'sass': 'css',
      'less': 'css',
      'json': 'json',
      'md': 'markdown',
      'txt': 'plaintext',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'scala': 'scala',
      'sql': 'sql',
      'sh': 'shell',
      'bash': 'shell',
      'dockerfile': 'dockerfile',
    };
    return languageMap[extension.toLowerCase()] || 'plaintext';
  };

  const getFileExtension = (language: string) => {
    switch (language) {
      case 'javascript': return 'js';
      case 'typescript': return 'ts';
      case 'python': return 'py';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'json': return 'json';
      default: return 'js';
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-900">
      {/* Enhanced Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gray-800 border-b border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left side - File info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-200">{fileId}</span>
            </div>
            <div className="w-px h-4 bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-gray-400 uppercase">{language}</span>
            </div>
          </div>

          {/* Center - Status indicators */}
          <div className="flex items-center gap-3">
            {/* Collaborators */}
            <Badge variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">
              <Users className="w-3 h-3 mr-1" />
              <span className="text-xs">{collaboratorsCount}</span>
            </Badge>

            {/* Connection Status */}
            <Badge variant="outline" className={getStatusColor()}>
              {getStatusIcon()}
              <span className="text-xs font-medium ml-1">{getStatusText()}</span>
            </Badge>

            {/* Activity Indicator */}
            {syncStatus === 'syncing' && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                <Activity className="w-3 h-3 animate-pulse mr-1" />
                <span className="text-xs font-medium">Live</span>
              </Badge>
            )}
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRunCode}
              className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              <Play className="w-3 h-3 mr-1" />
              <span className="text-xs">Run</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDebugCode}
              className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              <Bug className="w-3 h-3 mr-1" />
              <span className="text-xs">Debug</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Connection Error Banner */}
      {!isConnected && (
        <div className="absolute top-12 left-0 right-0 z-10 bg-red-500 text-white px-4 py-2 text-sm">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>Socket.IO not connected. Check if server is running on port 3001</span>
          </div>
        </div>
      )}
      
      {/* Editor Container */}
      <div className="w-full h-full" style={{ paddingTop: '48px' }}>
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={initialCode}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            folding: true,
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            tabSize: 2,
            insertSpaces: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            parameterHints: { enabled: true },
            hover: { enabled: true },
            contextmenu: true,
            mouseWheelZoom: true,
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            // Add more VS Code-like features
            find: { addExtraSpaceOnTop: false },
            links: true,
            colorDecorators: true,
          }}
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  );
};

export default CollaborativeCodeEditor; 
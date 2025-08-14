import React, { useEffect, useRef, useState } from 'react';
import 'xterm/css/xterm.css';

interface TerminalProps {
  height?: string;
  roomId?: string;
  onFileOperation?: (operation: string, path: string) => void;
}

const IDETerminal: React.FC<TerminalProps> = ({ 
  height = '200px', 
  roomId,
  onFileOperation 
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef<any>(null);
  const [currentDirectory, setCurrentDirectory] = useState('/project');
  const [isTerminalReady, setIsTerminalReady] = useState(false);

  // File operation commands
  const handleFileOperation = async (command: string) => {
    const parts = command.trim().split(' ');
    const operation = parts[0];
    const path = parts[1];

    if (!path) {
      term.current?.writeln('\r\nError: Path is required');
      return;
    }

    try {
      switch (operation) {
        case 'touch':
          // Create file
          if (onFileOperation) {
            onFileOperation('create', path);
            term.current?.writeln(`\r\nCreated file: ${path}`);
          }
          break;
        case 'mkdir':
          // Create directory
          if (onFileOperation) {
            onFileOperation('mkdir', path);
            term.current?.writeln(`\r\nCreated directory: ${path}`);
          }
          break;
        case 'rm':
          if (parts.includes('-rf')) {
            // Remove directory recursively
            const dirPath = parts[parts.indexOf('-rf') + 1];
            if (onFileOperation) {
              onFileOperation('rmdir', dirPath);
              term.current?.writeln(`\r\nRemoved directory: ${dirPath}`);
            }
          } else {
            // Remove file
            if (onFileOperation) {
              onFileOperation('delete', path);
              term.current?.writeln(`\r\nRemoved file: ${path}`);
            }
          }
          break;
        default:
          term.current?.writeln(`\r\nCommand not implemented: ${operation}`);
      }
    } catch (error) {
      term.current?.writeln(`\r\nError: ${error}`);
    }
  };

  // Execute shell commands
  const executeCommand = async (command: string) => {
    const parts = command.trim().split(' ');
    const cmd = parts[0];

    // Handle file operations
    if (['touch', 'mkdir', 'rm'].includes(cmd)) {
      await handleFileOperation(command);
      return;
    }

    // Handle built-in commands
    if (cmd === 'clear') {
      term.current?.clear();
      return;
    }

    if (cmd === 'pwd') {
      term.current?.writeln(`\r\n${currentDirectory}`);
      return;
    }

    if (cmd === 'ls') {
      term.current?.writeln('\r\nFiles in current directory:');
      term.current?.writeln('(Use file explorer to view files)');
      return;
    }

    if (cmd === 'help') {
      term.current?.writeln('\r\nAvailable commands:');
      term.current?.writeln('  touch <filename>  - Create a new file');
      term.current?.writeln('  mkdir <dirname>   - Create a new directory');
      term.current?.writeln('  rm <filename>     - Remove a file');
      term.current?.writeln('  rm -rf <dirname>  - Remove a directory');
      term.current?.writeln('  pwd               - Show current directory');
      term.current?.writeln('  ls                - List files');
      term.current?.writeln('  clear             - Clear terminal');
      term.current?.writeln('  help              - Show this help');
      term.current?.writeln('  npm <command>     - Run npm commands');
      term.current?.writeln('  node <script>     - Run Node.js scripts');
      return;
    }

    // Handle other commands via API
    try {
      const response = await fetch('/api/terminal/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command,
          roomId,
          cwd: currentDirectory,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.output) {
          term.current?.writeln(`\r\n${result.output}`);
        }
        if (result.newCwd) {
          setCurrentDirectory(result.newCwd);
        }
      } else {
        const error = await response.json();
        term.current?.writeln(`\r\nError: ${error.error || error.message}`);
      }
    } catch (error) {
      term.current?.writeln(`\r\nError executing command: ${error}`);
    }
  };

  useEffect(() => {
    let Terminal: any;
    let termInstance: any;
    let prompt: (() => void) | undefined;
    
    if (typeof window !== 'undefined' && terminalRef.current && !term.current) {
      import('xterm').then((mod) => {
        Terminal = mod.Terminal;
        termInstance = new Terminal({
          fontSize: 14,
          theme: {
            background: '#0a0a0a',
            foreground: '#ffffff',
            cursor: '#ffffff',
            selection: '#264f78',
            black: '#000000',
            red: '#e06c75',
            green: '#98c379',
            yellow: '#d19a66',
            blue: '#61afef',
            magenta: '#c678dd',
            cyan: '#56b6c2',
            white: '#ffffff',
            brightBlack: '#5c6370',
            brightRed: '#e06c75',
            brightGreen: '#98c379',
            brightYellow: '#d19a66',
            brightBlue: '#61afef',
            brightMagenta: '#c678dd',
            brightCyan: '#56b6c2',
            brightWhite: '#ffffff',
          },
          cursorBlink: true,
          cursorStyle: 'block',
          cols: 80,
          rows: 20,
          fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
          allowTransparency: true,
          scrollback: 1000,
        });
        
        term.current = termInstance;
        termInstance.open(terminalRef.current);
        
        // Welcome message
        termInstance.writeln('\x1b[1;36mWelcome to Code Collab Terminal!\x1b[0m');
        termInstance.writeln('\x1b[1;33mType "help" to see available commands\x1b[0m');
        termInstance.writeln(`\x1b[1;32mCurrent directory: ${currentDirectory}\x1b[0m`);
        termInstance.writeln('');
        
        prompt = () => {
          termInstance?.write(`\x1b[1;32m${currentDirectory}\x1b[0m\x1b[1;33m$\x1b[0m `);
        };
        prompt();
        
        let command = '';
        let commandHistory: string[] = [];
        let historyIndex = -1;
        let cursorPosition = 0;

        termInstance.onKey(({ key, domEvent }: any) => {
          if (domEvent.key === 'Enter') {
            if (command.trim()) {
              commandHistory.push(command.trim());
              historyIndex = commandHistory.length;
              executeCommand(command.trim());
            }
            command = '';
            cursorPosition = 0;
            prompt && prompt();
          } else if (domEvent.key === 'Backspace') {
            if (command.length > 0 && cursorPosition > 0) {
              command = command.slice(0, cursorPosition - 1) + command.slice(cursorPosition);
              cursorPosition--;
              termInstance?.write('\b \b');
            }
          } else if (domEvent.key === 'ArrowLeft') {
            if (cursorPosition > 0) {
              cursorPosition--;
              termInstance?.write('\x1b[D');
            }
          } else if (domEvent.key === 'ArrowRight') {
            if (cursorPosition < command.length) {
              cursorPosition++;
              termInstance?.write('\x1b[C');
            }
          } else if (domEvent.key === 'ArrowUp') {
            if (historyIndex > 0) {
              historyIndex--;
              const historyCommand = commandHistory[historyIndex] || '';
              // Clear current line and rewrite
              termInstance?.write('\r\x1b[K');
              termInstance?.write(`${currentDirectory}$ ${historyCommand}`);
              command = historyCommand;
              cursorPosition = command.length;
            }
          } else if (domEvent.key === 'ArrowDown') {
            if (historyIndex < commandHistory.length - 1) {
              historyIndex++;
              const historyCommand = commandHistory[historyIndex] || '';
              termInstance?.write('\r\x1b[K');
              termInstance?.write(`${currentDirectory}$ ${historyCommand}`);
              command = historyCommand;
              cursorPosition = command.length;
            } else if (historyIndex === commandHistory.length - 1) {
              historyIndex++;
              termInstance?.write('\r\x1b[K');
              termInstance?.write(`${currentDirectory}$ `);
              command = '';
              cursorPosition = 0;
            }
          } else if (domEvent.key === 'Tab') {
            // Auto-completion placeholder
            domEvent.preventDefault();
            termInstance?.write('  ');
            command += '  ';
            cursorPosition += 2;
          } else if (domEvent.key.length === 1) {
            // Insert character at cursor position
            command = command.slice(0, cursorPosition) + domEvent.key + command.slice(cursorPosition);
            cursorPosition++;
            termInstance?.write(domEvent.key);
          }
        });

        setIsTerminalReady(true);
      });
    }
    
    return () => {
      if (term.current) {
        term.current.dispose();
        term.current = null;
      }
    };
  }, [currentDirectory]);

  return (
    <div className="bg-zinc-900 border-t border-zinc-800 relative" style={{ height }}>
      <div className="absolute top-0 left-0 right-0 h-6 bg-zinc-800 flex items-center px-3 text-xs text-zinc-400">
        <span className="mr-2">Terminal</span>
        {isTerminalReady && (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
            <span>Ready</span>
          </div>
        )}
      </div>
      <div 
        ref={terminalRef} 
        style={{ 
          width: '100%', 
          height: 'calc(100% - 24px)', 
          marginTop: '24px',
          padding: '8px'
        }} 
      />
    </div>
  );
};

export default IDETerminal; 
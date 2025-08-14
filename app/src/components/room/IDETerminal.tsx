"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, X, Play, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface IDETerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TerminalOutput {
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

const IDETerminal: React.FC<IDETerminalProps> = ({ isOpen, onClose }) => {
  const [command, setCommand] = useState("");
  const [outputs, setOutputs] = useState<TerminalOutput[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableArea = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollableArea) {
        scrollableArea.scrollTop = scrollableArea.scrollHeight;
      }
    }
  }, [outputs]);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const executeCommand = async () => {
    if (!command.trim() || isExecuting) return;

    const currentCommand = command.trim();
    setIsExecuting(true);

    // Add command to outputs
    setOutputs(prev => [...prev, {
      type: 'command',
      content: `$ ${currentCommand}`,
      timestamp: new Date()
    }]);

    // Add to command history
    setCommandHistory(prev => [...prev, currentCommand]);
    setHistoryIndex(-1);

    try {
      const response = await fetch('/api/terminal/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: currentCommand,
          cwd: process.cwd(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOutputs(prev => [...prev, {
          type: 'output',
          content: data.output,
          timestamp: new Date()
        }]);
      } else {
        setOutputs(prev => [...prev, {
          type: 'error',
          content: data.error || 'Command failed',
          timestamp: new Date()
        }]);
        toast.error(data.error || 'Command failed');
      }
    } catch (error) {
      console.error('Failed to execute command:', error);
      setOutputs(prev => [...prev, {
        type: 'error',
        content: 'Failed to execute command. Please try again.',
        timestamp: new Date()
      }]);
      toast.error('Failed to execute command');
    } finally {
      setIsExecuting(false);
      setCommand("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand("");
      }
    }
  };

  const clearTerminal = () => {
    setOutputs([]);
    toast.success('Terminal cleared');
  };

  const getOutputColor = (type: TerminalOutput['type']) => {
    switch (type) {
      case 'command':
        return 'text-blue-400';
      case 'output':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="h-full bg-gray-900 flex flex-col transition-all duration-300 ease-in-out">
      {/* Terminal Header */}
      <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-gray-300 text-sm font-medium">&gt;_ Terminal</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearTerminal}
            className="text-gray-400 hover:text-white h-6 w-6 p-0 transition-colors duration-200"
            title="Clear terminal"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white h-6 w-6 p-0 transition-colors duration-200"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Terminal Output */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-1 font-mono text-sm">
          {outputs.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              <Terminal className="w-8 h-8 mx-auto mb-2" />
              <p>Terminal ready. Type a command to get started.</p>
              <p className="text-xs mt-1">Try: ls, pwd, npm install, etc.</p>
            </div>
          ) : (
            outputs.map((output, index) => (
              <div key={index} className={`${getOutputColor(output.type)} whitespace-pre-wrap`}>
                {output.content}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Terminal Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-2">
          <span className="text-green-400 font-mono text-sm">$</span>
          <Input
            ref={inputRef}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter command..."
            className="flex-1 bg-transparent border-none text-white font-mono text-sm focus:ring-0 focus:outline-none placeholder-gray-500 transition-all duration-200"
            disabled={isExecuting}
          />
          <Button
            onClick={executeCommand}
            disabled={!command.trim() || isExecuting}
            size="sm"
            className="bg-green-600 hover:bg-green-700 transition-colors duration-200"
          >
            <Play className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IDETerminal; 
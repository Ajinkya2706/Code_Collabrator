import React, { useState, useCallback, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import CollaborativeCodeEditor from '@/components/room/CollaborativeCodeEditor';
import { OpenTab } from './types';
import { useParams } from 'next/navigation';

interface EditorTabsProps {
  tabs: OpenTab[];
  activeTabId: string | null;
  onTabClick: (id: string) => void;
  onTabClose: (id: string) => void;
  onTabContentChange: (id: string, value: string) => void;
  splitView: boolean;
  onSplitToggle: () => void;
  onRunCode?: (code: string, language: string) => void;
}

const EditorTabs: React.FC<EditorTabsProps> = ({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
  onTabContentChange,
  splitView,
  onSplitToggle,
  onRunCode,
}) => {
  const params = useParams();
  const roomId = params.roomId as string;
  // Split view: allow user to pick which two tabs are shown
  const [splitTabIds, setSplitTabIds] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; tabId: string } | null>(null);
  const debounceTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Debounced content change handler
  const handleContentChange = useCallback((tabId: string, value: string) => {
    // Clear existing timeout for this tab
    if (debounceTimeouts.current[tabId]) {
      clearTimeout(debounceTimeouts.current[tabId]);
    }
    
    // Set new timeout
    debounceTimeouts.current[tabId] = setTimeout(() => {
      console.log('EditorTabs: Debounced content change for tab:', tabId);
      onTabContentChange(tabId, value);
    }, 300); // 300ms debounce
  }, [onTabContentChange]);

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      Object.values(debounceTimeouts.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);

  const handleTabRightClick = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, tabId });
  };

  const handleContextMenuAction = (action: string, tabId: string) => {
    if (action === 'close') onTabClose(tabId);
    if (action === 'closeOthers') {
      tabs.forEach(tab => { if (tab.id !== tabId) onTabClose(tab.id); });
    }
    if (action === 'closeAll') {
      tabs.forEach(tab => onTabClose(tab.id));
    }
    if (action === 'splitLeft') {
      setSplitTabIds([tabId, splitTabIds[1] || '']);
    }
    if (action === 'splitRight') {
      setSplitTabIds([splitTabIds[0] || '', tabId]);
    }
    setContextMenu(null);
  };

  let activeTabs: OpenTab[] = [];
  if (splitView && splitTabIds.length === 2 && splitTabIds.every(id => tabs.some(t => t.id === id))) {
    activeTabs = splitTabIds.map(id => tabs.find(t => t.id === id)!) as OpenTab[];
  } else if (splitView && tabs.length >= 2) {
    activeTabs = tabs.slice(0, 2);
    if (splitTabIds.length !== 2) setSplitTabIds([tabs[0].id, tabs[1].id]);
  } else {
    activeTabs = tabs.filter(tab => tab.id === activeTabId);
  }

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Tabs Bar */}
      <div className="flex items-center bg-gradient-to-r from-blue-100 via-fuchsia-100 to-pink-100 dark:from-blue-900 dark:via-fuchsia-900 dark:to-pink-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`flex items-center px-4 py-2 cursor-pointer border-r border-gray-200 dark:border-gray-700 transition-all duration-150 ${tab.id === activeTabId ? 'bg-white dark:bg-gray-900 font-bold shadow-md' : 'hover:bg-blue-50 dark:hover:bg-blue-800'}`}
            onClick={() => onTabClick(tab.id)}
            onContextMenu={e => handleTabRightClick(e, tab.id)}
            style={{ position: 'relative' }}
          >
            <span className="truncate max-w-[120px]">{tab.name}</span>
            {tab.isDirty && <span className="ml-1 text-blue-500">*</span>}
            <button
              className="ml-2 text-xs text-gray-500 hover:text-red-500"
              onClick={e => { e.stopPropagation(); onTabClose(tab.id); }}
              title="Close tab"
            >
              ×
            </button>
            {['js', 'ts', 'tsx', 'jsx'].some(ext => tab.name.endsWith(ext)) && onRunCode && (
              <button
                className="ml-2 px-1 py-0.5 text-xs bg-green-400 hover:bg-green-600 text-white rounded"
                onClick={e => { e.stopPropagation(); onRunCode(tab.content, tab.language); }}
                title="Run code"
              >
                ▶
              </button>
            )}
          </div>
        ))}
        <button
          className="ml-2 px-2 py-1 text-xs bg-gradient-to-r from-fuchsia-400 to-blue-400 text-white rounded hover:from-fuchsia-500 hover:to-blue-500 shadow"
          onClick={onSplitToggle}
          title="Toggle split view"
        >
          {splitView ? '🡸 Single' : '🡺 Split'}
        </button>
      </div>
      {/* Context Menu */}
      {contextMenu && (
        <div
          className="absolute z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg text-sm"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onMouseLeave={() => setContextMenu(null)}
        >
          <div className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer" onClick={() => handleContextMenuAction('close', contextMenu.tabId)}>Close</div>
          <div className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer" onClick={() => handleContextMenuAction('closeOthers', contextMenu.tabId)}>Close Others</div>
          <div className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer" onClick={() => handleContextMenuAction('closeAll', contextMenu.tabId)}>Close All</div>
          {splitView && <>
            <div className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer" onClick={() => handleContextMenuAction('splitLeft', contextMenu.tabId)}>Show Left</div>
            <div className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer" onClick={() => handleContextMenuAction('splitRight', contextMenu.tabId)}>Show Right</div>
          </>}
        </div>
      )}
      {/* Editor(s) */}
      <div className={`flex-1 flex ${splitView ? 'flex-row' : 'flex-col'} bg-gradient-to-br from-blue-50 via-fuchsia-50 to-pink-50 dark:from-blue-950 dark:via-fuchsia-950 dark:to-pink-950`}>
        {activeTabs.map(tab => (
          <div key={tab.id} className="flex-1 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
            <CollaborativeCodeEditor
              key={tab.id}
              roomId={roomId}
              fileId={tab.id}
              initialCode={tab.content}
              language={tab.language}
              onCodeChange={value => handleContentChange(tab.id, value || '')}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorTabs; 
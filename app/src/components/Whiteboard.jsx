import React from 'react';
import { Tldraw } from 'tldraw';
import { useSyncDemo } from '@tldraw/sync';
import 'tldraw/tldraw.css';

// Utility to get roomId from prop or fallback
function getRoomId(roomIdProp) {
  if (roomIdProp) return roomIdProp;
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    return url.searchParams.get('roomId') || 'default-room';
  }
  return 'default-room';
}

/**
 * Collaborative Whiteboard using tldraw + Yjs + y-websocket
 * @param {object} props
 * @param {string} [props.roomId] - Optional roomId, otherwise taken from URL
 */
export default function Whiteboard({ roomId }) {
  const _roomId = getRoomId(roomId);
  // This hook gives you a collaborative store for the given room
  const store = useSyncDemo({ roomId: `whiteboard-${_roomId}` });

  if (!store) {
    return <div>Loading whiteboard...</div>;
  }

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 500 }}>
      <Tldraw store={store} />
    </div>
  );
} 
import { useState, useEffect, useRef, useCallback } from 'react';

export const useWebSocket = (url) => {
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const heartbeatTimer = useRef(null);

  const clearTimers = useCallback(() => {
    if (reconnectTimer.current) { clearTimeout(reconnectTimer.current); reconnectTimer.current = null; }
    if (heartbeatTimer.current) { clearInterval(heartbeatTimer.current); heartbeatTimer.current = null; }
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) return;

    clearTimers();
    setError(null);

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setConnected(true);
        setError(null);
        heartbeatTimer.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'ping' }));
        }, 30000);
      };

      ws.onmessage = (event) => {
        try {
          const text = event.data;
          if (text === 'pong') return;
          const parsed = JSON.parse(text);
          setData(parsed);
        } catch (e) {
          console.error('WS parse error:', e);
        }
      };

      ws.onclose = () => {
        setConnected(false);
        clearTimers();
        reconnectTimer.current = setTimeout(() => connect(), 5000);
      };

      ws.onerror = (err) => {
        console.error('WS error:', err);
        setError('Connection failed');
        setConnected(false);
      };

      wsRef.current = ws;
    } catch (err) {
      setError(err.message);
      reconnectTimer.current = setTimeout(() => connect(), 5000);
    }
  }, [url, clearTimers]);

  const disconnect = useCallback(() => {
    clearTimers();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnected(false);
    setData(null);
  }, [clearTimers]);

  useEffect(() => {
    return () => {
      clearTimers();
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [clearTimers]);

  return { connected, data, error, connect, disconnect };
};
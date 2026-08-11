import { useState, useCallback } from 'react';

export const useAgent = () => {
  const [agentUrl, setAgentUrl] = useState('ws://localhost:8765');
  const [customIp, setCustomIp] = useState('');

  const updateUrl = useCallback(() => {
    if (customIp.trim()) {
      setAgentUrl(`ws://${customIp.trim()}:8765`);
    } else {
      setAgentUrl('ws://localhost:8765');
    }
  }, [customIp]);

  return { agentUrl, customIp, setCustomIp, updateUrl };
};


import { useState, useEffect } from 'react';

export interface WordStatus {
  [term: string]: 'correct' | 'incorrect' | undefined;
}

export function useWordStatus() {
  const [status, setStatus] = useState<WordStatus>({});

  useEffect(() => {
    const stored = localStorage.getItem('verbal-logic-status');
    if (stored) {
      setStatus(JSON.parse(stored));
    }
  }, []);

  const updateStatus = (term: string, isCorrect: boolean) => {
    const newStatus = { ...status, [term]: isCorrect ? 'correct' : 'incorrect' };
    setStatus(newStatus);
    localStorage.setItem('verbal-logic-status', JSON.stringify(newStatus));
  };

  const resetStatus = (terms?: string[]) => {
    if (terms) {
      const newStatus = { ...status };
      terms.forEach(term => {
        delete newStatus[term];
      });
      setStatus(newStatus);
      localStorage.setItem('verbal-logic-status', JSON.stringify(newStatus));
    } else {
      setStatus({});
      localStorage.removeItem('verbal-logic-status');
    }
  };

  return { status, updateStatus, resetStatus };
}

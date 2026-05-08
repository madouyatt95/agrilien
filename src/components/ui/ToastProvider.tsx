'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Check, AlertCircle, X } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  exit?: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exit: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, pointerEvents: 'none' }}>
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type} ${toast.exit ? 'exit' : ''}`} style={{ pointerEvents: 'auto' }}>
            {toast.type === 'success' ? <Check size={18} color="var(--success)" /> :
             toast.type === 'error' ? <AlertCircle size={18} color="var(--error)" /> :
             <AlertCircle size={18} color="var(--info)" />}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} style={{ padding: 4 }}>
              <X size={14} color="var(--text-light)" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() { return useContext(ToastContext); }

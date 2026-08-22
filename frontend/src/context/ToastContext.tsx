import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X, Check } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string, duration: number = 3500) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((title: string, message?: string) => showToast('success', title, message), [showToast]);
  const error = useCallback((title: string, message?: string) => showToast('error', title, message), [showToast]);
  const warning = useCallback((title: string, message?: string) => showToast('warning', title, message), [showToast]);
  const info = useCallback((title: string, message?: string) => showToast('info', title, message), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3.5 p-4 rounded-2xl shadow-2xl border transition-all duration-300 transform translate-y-0 backdrop-blur-xl animate-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-[#0a192f]/95 border-[#00f0ff]/40 text-slate-100 shadow-[0_10px_30px_rgba(0,240,255,0.15)]'
                : toast.type === 'error'
                ? 'bg-rose-950/95 border-rose-500/40 text-rose-100 shadow-[0_10px_30px_rgba(244,63,94,0.15)]'
                : toast.type === 'warning'
                ? 'bg-amber-950/95 border-amber-500/40 text-amber-100'
                : 'bg-slate-900/95 border-blue-500/40 text-blue-100'
            }`}
          >
            {/* Animated Modern Blue/Green Tick Mark Badge */}
            <div className="shrink-0">
              {toast.type === 'success' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00ffc2] to-[#00f0ff] p-[2px] shadow-md shadow-[#00f0ff]/30 flex items-center justify-center animate-in zoom-in-50 duration-200">
                  <div className="w-full h-full bg-[#0a192f] rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#00ffc2] stroke-[3]" />
                  </div>
                </div>
              )}
              {toast.type === 'error' && <XCircle className="w-6 h-6 text-rose-400" />}
              {toast.type === 'warning' && <AlertTriangle className="w-6 h-6 text-amber-400" />}
              {toast.type === 'info' && <Info className="w-6 h-6 text-blue-400" />}
            </div>

            <div className="flex-1">
              <h4 className="font-bold text-xs tracking-tight text-white flex items-center gap-1.5">
                {toast.title}
              </h4>
              {toast.message && <p className="text-[11px] text-slate-300 font-medium mt-0.5 leading-snug">{toast.message}</p>}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

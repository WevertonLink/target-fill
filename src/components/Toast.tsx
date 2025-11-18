import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import type { Toast as ToastType } from '../hooks/useToast';

interface ToastProps {
  toast: ToastType;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      // Start exit animation 300ms before removal
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, toast.duration - 300);

      // Cleanup timer on unmount
      return () => {
        clearTimeout(exitTimer);
      };
    }
  }, [toast.duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const icons = {
    success: <CheckCircle size={20} className="text-green-400" />,
    error: <XCircle size={20} className="text-red-400" />,
    warning: <AlertCircle size={20} className="text-yellow-400" />,
    info: <Info size={20} className="text-blue-400" />,
  };

  const styles = {
    success: 'bg-green-500/20 border-green-500/50 text-green-400',
    error: 'bg-red-500/20 border-red-500/50 text-red-400',
    warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
    info: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
  };

  return (
    <div
      className={`
        flex items-center gap-3 min-w-[300px] max-w-md
        px-4 py-3 rounded-lg border backdrop-blur-sm
        shadow-lg transition-all duration-300
        ${styles[toast.type]}
        ${isExiting
          ? 'opacity-0 translate-x-full'
          : 'opacity-100 translate-x-0'
        }
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex-shrink-0">
        {icons[toast.type]}
      </div>

      <p className="flex-1 text-sm font-medium text-white">
        {toast.message}
      </p>

      <button
        onClick={handleClose}
        className="flex-shrink-0 text-zinc-400 hover:text-white transition-colors"
        aria-label="Fechar"
      >
        <X size={18} />
      </button>
    </div>
  );
}

import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ConfirmModalProps {
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title,
  message,
  type = 'warning',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  const colors = {
    danger: { bg: 'bg-red-500/20', border: 'border-red-500', icon: 'text-red-400', btn: 'bg-red-500 hover:bg-red-600' },
    warning: { bg: 'bg-yellow-500/20', border: 'border-yellow-500', icon: 'text-yellow-400', btn: 'bg-yellow-500 hover:bg-yellow-600' },
    info: { bg: 'bg-blue-500/20', border: 'border-blue-500', icon: 'text-blue-400', btn: 'bg-blue-500 hover:bg-blue-600' },
    success: { bg: 'bg-green-500/20', border: 'border-green-500', icon: 'text-green-400', btn: 'bg-green-500 hover:bg-green-600' }
  };

  const color = colors[type];

  const Icon = type === 'danger' || type === 'warning' ? AlertTriangle : type === 'success' ? CheckCircle : Info;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[70]">
      <div className="bg-zinc-900 rounded-lg max-w-sm w-full border border-zinc-800 shadow-2xl">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
          <div className={`p-2 rounded-full ${color.bg} ${color.border} border`}>
            <Icon className={color.icon} size={24} />
          </div>
          <h3 className="font-bold text-white text-lg">{title}</h3>
        </div>
        
        <div className="p-4">
          <p className="text-zinc-300 text-sm leading-relaxed">{message}</p>
        </div>

        <div className="p-4 border-t border-zinc-800 flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 px-4 rounded-md font-medium transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 ${color.btn} text-white py-2.5 px-4 rounded-md font-medium transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

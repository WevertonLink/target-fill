import { X, Trash2, Copy, TestTube, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import NotificationListener from '../plugins/notificationListener';

interface DebugModalProps {
  onClose: () => void;
}

// Sistema global de logs
export const DebugLogger = {
  logs: [] as string[],
  listeners: new Set<() => void>(),

  log(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    this.logs.push(logEntry);

    // Mantém apenas os últimos 100 logs
    if (this.logs.length > 100) {
      this.logs.shift();
    }

    // Também loga no console
    console.log(logEntry);

    // Notifica listeners
    this.listeners.forEach(listener => listener());
  },

  error(message: string) {
    this.log(`❌ ERROR: ${message}`);
  },

  success(message: string) {
    this.log(`✅ ${message}`);
  },

  clear() {
    this.logs = [];
    this.listeners.forEach(listener => listener());
  },

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
};

export default function DebugModal({ onClose }: DebugModalProps) {
  const [logs, setLogs] = useState(DebugLogger.logs);

  useEffect(() => {
    const unsubscribe = DebugLogger.subscribe(() => {
      setLogs([...DebugLogger.logs]);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const copyLogs = () => {
    const logsText = logs.join('\n');
    navigator.clipboard.writeText(logsText).then(() => {
      alert('Logs copiados para a área de transferência!');
    });
  };

  const testNotification = async () => {
    try {
      DebugLogger.log('🧪 Iniciando teste de notificação...');
      await NotificationListener.sendTestNotification();
    } catch (error) {
      DebugLogger.error(`Erro ao testar notificação: ${error}`);
    }
  };

  const checkServiceStatus = async () => {
    try {
      DebugLogger.log('🔍 Verificando status do serviço...');
      const status = await NotificationListener.getServiceStatus();
      DebugLogger.log(`📊 Serviço habilitado: ${status.enabled}`);
      if (status.enabledListeners) {
        DebugLogger.log(`📋 Listeners: ${status.enabledListeners}`);
      }
    } catch (error) {
      DebugLogger.error(`Erro ao verificar status: ${error}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col z-50">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gold-400">🐛 Debug Console</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={checkServiceStatus}
            className="p-2 hover:bg-zinc-800 rounded-md transition-colors"
            title="Verificar status do serviço"
          >
            <Activity size={20} className="text-blue-400" />
          </button>
          <button
            onClick={testNotification}
            className="p-2 hover:bg-zinc-800 rounded-md transition-colors"
            title="Enviar notificação de teste"
          >
            <TestTube size={20} className="text-green-400" />
          </button>
          <button
            onClick={copyLogs}
            className="p-2 hover:bg-zinc-800 rounded-md transition-colors"
            title="Copiar logs"
          >
            <Copy size={20} className="text-zinc-400" />
          </button>
          <button
            onClick={() => {
              if (confirm('Limpar todos os logs?')) {
                DebugLogger.clear();
              }
            }}
            className="p-2 hover:bg-zinc-800 rounded-md transition-colors"
            title="Limpar logs"
          >
            <Trash2 size={20} className="text-zinc-400" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-md transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Logs Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-black font-mono text-xs">
        {logs.length === 0 ? (
          <div className="text-center text-zinc-600 py-8">
            Nenhum log ainda. Use o app e os logs aparecerão aqui.
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`${
                  log.includes('ERROR') || log.includes('❌')
                    ? 'text-red-400'
                    : log.includes('✅')
                    ? 'text-green-400'
                    : 'text-zinc-300'
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-zinc-900 border-t border-zinc-800 p-3 text-xs text-zinc-500">
        {logs.length} {logs.length === 1 ? 'log' : 'logs'} | Atualização automática
      </div>
    </div>
  );
}

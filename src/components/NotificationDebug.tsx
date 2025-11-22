import { useState, useEffect } from 'react';
import { Bug } from 'lucide-react';

export default function NotificationDebug() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Escutar evento de notificação
    const handler = (event: any) => {
      const log = `[${new Date().toLocaleTimeString()}] ${JSON.stringify(event.detail)}`;
      setLogs(prev => [...prev, log].slice(-10)); // Últimas 10
    };

    window.addEventListener('bankNotification', handler);
    
    // Teste manual
    const testInterval = setInterval(() => {
      const testEvent = new CustomEvent('bankNotification', {
        detail: {
          packageName: 'com.nu.production',
          title: 'Nubank',
          text: 'Você depositou R$ 100,00 em Caixinha: Casamento'
        }
      });
      window.dispatchEvent(testEvent);
    }, 5000);

    return () => {
      window.removeEventListener('bankNotification', handler);
      clearInterval(testInterval);
    };
  }, []);

  return (
    <div className="fixed bottom-20 right-4 bg-zinc-900 border border-gold-500 rounded-lg p-3 max-w-xs z-50">
      <div className="flex items-center gap-2 mb-2">
        <Bug className="text-gold-400" size={16} />
        <span className="text-white text-sm font-bold">Debug Notificações</span>
      </div>
      
      <div className="bg-zinc-800 rounded p-2 max-h-40 overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-zinc-500 text-xs">Aguardando notificações...</p>
        ) : (
          logs.map((log, i) => (
            <p key={i} className="text-green-400 text-xs font-mono mb-1">{log}</p>
          ))
        )}
      </div>
    </div>
  );
}

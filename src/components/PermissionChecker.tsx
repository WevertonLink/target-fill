import { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle } from 'lucide-react';

export default function PermissionChecker() {
  const [status, setStatus] = useState<string>('Verificando...');
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    checkPermission();
    
    // Verificar a cada 3 segundos
    const interval = setInterval(checkPermission, 3000);
    return () => clearInterval(interval);
  }, []);

  const checkPermission = async () => {
    try {
      const plugin = (window as any).NotificationListenerPlugin;
      
      if (!plugin) {
        setStatus('Plugin não encontrado');
        setHasPermission(false);
        return;
      }

      const result = await plugin.hasPermission();
      const granted = result.value === true;
      
      setHasPermission(granted);
      setStatus(granted ? 'Permissão ativa!' : 'Permissão negada');
    } catch (error) {
      setStatus(`Erro: ${error}`);
      setHasPermission(false);
    }
  };

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className={hasPermission ? 'text-green-400' : 'text-zinc-500'} size={24} />
          <div>
            <p className="text-white font-medium">Status de Detecção</p>
            <p className="text-zinc-400 text-sm">{status}</p>
          </div>
        </div>
        {hasPermission ? (
          <CheckCircle className="text-green-400" size={24} />
        ) : (
          <XCircle className="text-zinc-500" size={24} />
        )}
      </div>
      
      {!hasPermission && (
        <div className="mt-3 pt-3 border-t border-zinc-700">
          <p className="text-zinc-400 text-xs mb-2">Para ativar:</p>
          <ol className="text-zinc-500 text-xs space-y-1 list-decimal list-inside">
            <li>Vá em Configurações do Android</li>
            <li>Apps → Target-Fill</li>
            <li>Permissões especiais</li>
            <li>Acesso a notificações → Ativar</li>
          </ol>
        </div>
      )}
    </div>
  );
}

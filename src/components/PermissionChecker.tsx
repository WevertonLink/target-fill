import { useState, useEffect } from 'react';
import { registerPlugin } from '@capacitor/core';

interface NotificationListenerPlugin {
  checkPermission(): Promise<{ granted: boolean }>;
  requestPermission(): Promise<void>;
  getServiceStatus(): Promise<{ enabled: boolean; enabledListeners: string }>;
  sendTestNotification(): Promise<{ success: boolean }>;
}

const NotificationListener = registerPlugin<NotificationListenerPlugin>('NotificationListener');

export function PermissionChecker() {
  const [hasPermission, setHasPermission] = useState(false);
  const [serviceInfo, setServiceInfo] = useState<string>('');
  const [checking, setChecking] = useState(false);

  const checkPermission = async () => {
    setChecking(true);
    try {
      const result = await NotificationListener.checkPermission();
      setHasPermission(result.granted);
      
      const status = await NotificationListener.getServiceStatus();
      setServiceInfo(`Habilitado: ${status.enabled}\nListeners: ${status.enabledListeners}`);
      
      console.log('🔍 Permissão:', result.granted);
      console.log('📊 Status:', status);
    } catch (error) {
      console.error('❌ Erro ao verificar:', error);
    } finally {
      setChecking(false);
    }
  };

  const requestPermission = async () => {
    try {
      await NotificationListener.requestPermission();
      console.log('📱 Configurações abertas');
      
      // Aguarda um pouco e verifica novamente
      setTimeout(checkPermission, 2000);
    } catch (error) {
      console.error('❌ Erro ao solicitar:', error);
    }
  };

  const sendTest = async () => {
    try {
      console.log('🧪 Enviando teste...');
      await NotificationListener.sendTestNotification();
      console.log('✅ Teste enviado!');
    } catch (error) {
      console.error('❌ Erro no teste:', error);
      alert('Erro: ' + error);
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      <h3 className="text-lg font-bold mb-4 text-white">
        🔔 Status do Notification Listener
      </h3>

      <div className="space-y-3">
        <div className={`p-3 rounded ${hasPermission ? 'bg-green-900' : 'bg-red-900'}`}>
          <p className="font-semibold text-white">
            {hasPermission ? '✅ ATIVO' : '❌ INATIVO'}
          </p>
          <p className="text-sm text-gray-300 mt-1">
            {hasPermission 
              ? 'Pronto para detectar transações!' 
              : 'Permissão não concedida'}
          </p>
        </div>

        {serviceInfo && (
          <div className="p-3 bg-gray-800 rounded text-xs">
            <pre className="text-gray-300 whitespace-pre-wrap">{serviceInfo}</pre>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={checkPermission}
            disabled={checking}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded font-medium"
          >
            {checking ? '⏳ Verificando...' : '🔄 Verificar'}
          </button>

          {!hasPermission && (
            <button
              onClick={requestPermission}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded font-medium"
            >
              ⚙️ Ativar
            </button>
          )}

          {hasPermission && (
            <button
              onClick={sendTest}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium"
            >
              🧪 Testar
            </button>
          )}
        </div>

        {!hasPermission && (
          <div className="p-3 bg-yellow-900 rounded text-sm">
            <p className="font-semibold text-yellow-100 mb-2">📋 Como ativar:</p>
            <ol className="list-decimal list-inside space-y-1 text-yellow-200">
              <li>Toque em "⚙️ Ativar"</li>
              <li>Encontre "Target Fill" na lista</li>
              <li>Ative o switch</li>
              <li>Volte ao app</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

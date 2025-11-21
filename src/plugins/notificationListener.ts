import { registerPlugin, Capacitor } from '@capacitor/core';
import { DebugLogger } from '../components/DebugModal';

export interface TransactionData {
  amount: number;
  type: 'CREDIT' | 'DEBIT' | 'SAVINGS' | 'INVESTMENT' | 'OTHER';
  category: string;
  source: string;
  description?: string;
  rawText: string;
}

export interface NotificationListenerPlugin {
  /**
   * Solicita permissão para acessar notificações
   * Abre as configurações do sistema
   */
  requestPermission(): Promise<void>;

  /**
   * Verifica se a permissão foi concedida
   */
  checkPermission(): Promise<{ granted: boolean }>;

  /**
   * Inicia a escuta de notificações
   */
  startListening(): Promise<{ active: boolean }>;
}

// Wrapper que adiciona fallback e logging
const createNotificationListenerWrapper = (): NotificationListenerPlugin => {
  const plugin = registerPlugin<NotificationListenerPlugin>('NotificationListener', {
    web: () => ({
      async requestPermission() {
        console.warn('NotificationListener não disponível na web');
      },
      async checkPermission() {
        return { granted: false };
      },
      async startListening() {
        return { active: false };
      }
    })
  });

  // Wrapper com debug logging
  return {
    async requestPermission() {
      DebugLogger.log('Plugin: Tentando requestPermission...');
      try {
        await plugin.requestPermission();
        DebugLogger.success('Plugin: requestPermission OK');
      } catch (error: any) {
        DebugLogger.error(`Plugin: ${error?.message || error}`);
        throw error;
      }
    },
    async checkPermission() {
      try {
        const result = await plugin.checkPermission();
        DebugLogger.log(`Plugin: checkPermission = ${result.granted}`);
        return result;
      } catch (error: any) {
        DebugLogger.error(`Plugin checkPermission: ${error?.message || error}`);
        return { granted: false };
      }
    },
    async startListening() {
      try {
        const result = await plugin.startListening();
        DebugLogger.log(`Plugin: startListening = ${result.active}`);
        return result;
      } catch (error: any) {
        DebugLogger.error(`Plugin startListening: ${error?.message || error}`);
        return { active: false };
      }
    }
  };
};

const NotificationListener = createNotificationListenerWrapper();

export default NotificationListener;

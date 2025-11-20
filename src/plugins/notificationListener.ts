import { registerPlugin } from '@capacitor/core';

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

const NotificationListener = registerPlugin<NotificationListenerPlugin>('NotificationListener', {
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

export default NotificationListener;

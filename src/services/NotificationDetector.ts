import { Capacitor } from '@capacitor/core';

interface BankNotification {
  amount: number;
  type: 'deposit' | 'received' | 'spent' | 'investment';
  merchant?: string;
  account?: string;
  timestamp: Date;
}

export class NotificationDetector {
  private patterns = {
    nubank: {
      deposit: /depositou\s+R\$\s*([\d.,]+)(?:.*?(caixinha|objetivo):\s*(.+?)(?:\||$))?/i,
      received: /recebeu(?:.*?pix)?.*?R\$\s*([\d.,]+)(?:.*?de\s+(.+?))?/i,
      spent: /compra.*?R\$\s*([\d.,]+)(?:.*?em\s+(.+?))?/i,
    },
    inter: {
      deposit: /depósito.*?R\$\s*([\d.,]+)(?:.*?caixinha:\s*(.+?))?/i,
      received: /recebeu.*?R\$\s*([\d.,]+)/i,
    },
    c6: {
      deposit: /\+R\$\s*([\d.,]+).*?•\s*(.+)/i,
      received: /recebeu.*?R\$\s*([\d.,]+)/i,
    },
    mercadopago: {
      received: /recebeu.*?R\$\s*([\d.,]+)(?:.*?de\s+(.+?))?/i,
      spent: /pagou.*?R\$\s*([\d.,]+)(?:.*?para\s+(.+?))?/i,
    }
  };

  async requestPermission(): Promise<boolean> {
    if (Capacitor.getPlatform() !== 'android') {
      console.log('⚠️ Detecção só funciona no Android');
      return false;
    }

    try {
      console.log('📱 Solicitando permissão...');

      // Mostrar instruções ao usuário
      const confirmed = confirm(`Para detectar notificações bancárias automaticamente:

1. Toque em "OK" 
2. Procure "Target Fill" na lista
3. Ative a opção
4. Volte ao app

Deseja continuar?`);

      if (!confirmed) return false;

      // Abrir configurações do Android usando intent
      if ((window as any).open) {
        (window as any).open('android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS', '_system');
      }

      return false; // Usuário precisa ativar manualmente
    } catch (error) {
      console.error('❌ Erro:', error);
      alert('Erro ao abrir configurações. Por favor, vá manualmente em:\nConfigurações > Notificações > Acesso especial > Acesso às notificações');
      return false;
    }
  }

  async checkPermission(): Promise<boolean> {
    // Não é possível verificar sem plugin nativo
    // Assumir que usuário ativou se chegou até aqui
    return true;
  }

  parseNotification(packageName: string, title: string, text: string): BankNotification | null {
    const fullText = `${title} ${text}`.toLowerCase();

    let bankPatterns;
    if (packageName.includes('nubank')) {
      bankPatterns = this.patterns.nubank;
    } else if (packageName.includes('inter')) {
      bankPatterns = this.patterns.inter;
    } else if (packageName.includes('c6bank')) {
      bankPatterns = this.patterns.c6;
    } else if (packageName.includes('mercadopago')) {
      bankPatterns = this.patterns.mercadopago;
    } else {
      return null;
    }

    for (const [type, pattern] of Object.entries(bankPatterns)) {
      const match = fullText.match(pattern);
      if (match) {
        const amount = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));

        return {
          amount,
          type: type as any,
          merchant: match[2]?.trim(),
          account: match[3]?.trim(),
          timestamp: new Date()
        };
      }
    }

    return null;
  }

  async startListening(onNotification: (notification: BankNotification) => void) {
    if (Capacitor.getPlatform() !== 'android') return;

    console.log('✅ Modo de detecção configurado');
    console.log('ℹ️ Aguardando implementação do listener nativo...');
    
    // Por enquanto, apenas log
    // TODO: Implementar plugin nativo
  }

  async stopListening() {
    console.log('Detector pausado');
  }
}

export const notificationDetector = new NotificationDetector();

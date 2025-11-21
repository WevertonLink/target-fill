import { useEffect, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import NotificationListener, { TransactionData } from '../plugins/notificationListener';
import { DebugLogger } from '../components/DebugModal';

interface AutoRule {
  id: string;
  bankSource: string;
  transactionType: 'CREDIT' | 'DEBIT' | 'SAVINGS' | 'INVESTMENT' | 'OTHER';
  categoryKeyword?: string;
  targetGoalId: string;
  enabled: boolean;
}

export function useNotificationListener(onTransactionDetected: (transaction: TransactionData) => void) {
  const [hasPermission, setHasPermission] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [autoRules, setAutoRules] = useState<AutoRule[]>([]);

  useEffect(() => {
    // Carrega regras salvas
    const loadRules = () => {
      try {
        const saved = localStorage.getItem('target_fill_auto_rules');
        if (saved) {
          setAutoRules(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Erro ao carregar regras:', error);
      }
    };

    // Verifica permissão ao montar - com proteção contra crashes
    const checkPermission = async () => {
      try {
        const result = await NotificationListener.checkPermission();
        setHasPermission(result.granted);
        if (result.granted) {
          const status = await NotificationListener.startListening();
          setIsActive(status.active);
        }
      } catch (error) {
        console.error('Erro ao verificar permissão:', error);
        // Não fazer nada em caso de erro - evita crash
        setHasPermission(false);
        setIsActive(false);
      }
    };

    loadRules();

    // Verifica permissão com delay para dar tempo do app inicializar
    setTimeout(() => {
      checkPermission().catch(err => {
        console.error('Erro crítico ao verificar permissão:', err);
      });
    }, 1000);

    // Listener para broadcasts do Android
    let listenerHandle: any = null;
    CapacitorApp.addListener('appStateChange', ({ isActive }: { isActive: boolean }) => {
      if (isActive) {
        // Verifica permissão com delay para garantir que o Android atualizou
        setTimeout(() => {
          checkPermission().catch(err => {
            console.error('Erro ao verificar permissão após voltar ao app:', err);
          });
        }, 500);
      }
    }).then(handle => {
      listenerHandle = handle;
    }).catch(err => {
      console.error('Erro ao registrar listener de app state:', err);
    });

    // Listener para transações detectadas
    const handleTransactionDetected = (event: any) => {
      try {
        const transaction: TransactionData = typeof event.detail === 'string'
          ? JSON.parse(event.detail)
          : event.detail;

        console.log('Transação recebida:', transaction);
        onTransactionDetected(transaction);
      } catch (error) {
        console.error('Erro ao processar transação:', error);
      }
    };

    window.addEventListener('transactionDetected', handleTransactionDetected);

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
      window.removeEventListener('transactionDetected', handleTransactionDetected);
    };
  }, [onTransactionDetected]);

  const requestPermission = async () => {
    try {
      DebugLogger.log('Hook: Solicitando permissão...');
      await NotificationListener.requestPermission();
      DebugLogger.success('Hook: Permissão solicitada com sucesso');

      // Após o usuário voltar das configurações, verifica novamente
      setTimeout(async () => {
        DebugLogger.log('Hook: Verificando se permissão foi concedida...');
        const result = await NotificationListener.checkPermission();
        DebugLogger.log(`Hook: Permissão concedida: ${result.granted}`);
        setHasPermission(result.granted);
      }, 1000);
    } catch (error: any) {
      DebugLogger.error(`Hook: ${error?.message || error}`);
      throw error;
    }
  };

  const saveAutoRules = (rules: AutoRule[]) => {
    setAutoRules(rules);
    localStorage.setItem('target_fill_auto_rules', JSON.stringify(rules));
  };

  const addAutoRule = (rule: Omit<AutoRule, 'id'>) => {
    const newRule: AutoRule = {
      ...rule,
      id: Date.now().toString()
    };
    saveAutoRules([...autoRules, newRule]);
  };

  const removeAutoRule = (ruleId: string) => {
    saveAutoRules(autoRules.filter(r => r.id !== ruleId));
  };

  const toggleAutoRule = (ruleId: string) => {
    saveAutoRules(
      autoRules.map(r =>
        r.id === ruleId ? { ...r, enabled: !r.enabled } : r
      )
    );
  };

  const checkAutoRules = (transaction: TransactionData): string | null => {
    // Verifica se alguma regra se aplica
    for (const rule of autoRules) {
      if (!rule.enabled) continue;

      const matchesBank = rule.bankSource === 'all' || rule.bankSource === transaction.source;
      const matchesType = rule.transactionType === transaction.type;
      const matchesCategory = !rule.categoryKeyword ||
        transaction.category?.toLowerCase().includes(rule.categoryKeyword.toLowerCase()) ||
        transaction.description?.toLowerCase().includes(rule.categoryKeyword.toLowerCase());

      if (matchesBank && matchesType && matchesCategory) {
        return rule.targetGoalId;
      }
    }
    return null;
  };

  return {
    hasPermission,
    isActive,
    autoRules,
    requestPermission,
    addAutoRule,
    removeAutoRule,
    toggleAutoRule,
    checkAutoRules
  };
}

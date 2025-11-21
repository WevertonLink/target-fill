import { useEffect, useState } from 'react';
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
  const [isActive] = useState(false); // Desabilitado temporariamente
  const [autoRules, setAutoRules] = useState<AutoRule[]>([]);

  useEffect(() => {
    // Carrega regras salvas
    try {
      const saved = localStorage.getItem('target_fill_auto_rules');
      if (saved) {
        setAutoRules(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erro ao carregar regras:', error);
    }

    // TEMPORARIAMENTE DESABILITADO - para teste de crash
    console.log('NotificationListener desabilitado temporariamente para diagnóstico');
    console.log('Callback:', typeof onTransactionDetected);

    return () => {
      // Cleanup vazio
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

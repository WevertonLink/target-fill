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
  const [isActive, setIsActive] = useState(false);
  const [autoRules, setAutoRules] = useState<AutoRule[]>([]);

  useEffect(() => {
    console.log('🚀 [JS] useNotificationListener montado!');

    // Carrega regras salvas
    try {
      const saved = localStorage.getItem('target_fill_auto_rules');
      if (saved) {
        setAutoRules(JSON.parse(saved));
        console.log('📋 [JS] Regras carregadas:', JSON.parse(saved).length);
      }
    } catch (error) {
      console.error('Erro ao carregar regras:', error);
    }

    // Verifica permissão uma vez ao iniciar
    const checkInitialPermission = async () => {
      try {
        console.log('🔍 [JS] Verificando permissão inicial...');
        const result = await NotificationListener.checkPermission();
        console.log('🔐 [JS] Permissão:', result.granted);
        setHasPermission(result.granted);

        if (result.granted) {
          console.log('🎧 [JS] Iniciando listening...');
          const status = await NotificationListener.startListening();
          console.log('📡 [JS] Status do listening:', status.active);
          setIsActive(status.active);
        }
      } catch (error) {
        console.error('❌ [JS] Erro ao verificar permissão inicial:', error);
      }
    };

    checkInitialPermission();

    // Listener para transações detectadas
    const handleTransactionDetected = (event: any) => {
      try {
        console.log('🎯 [JS] Evento transactionDetected recebido!', event);

        const transaction: TransactionData = typeof event.detail === 'string'
          ? JSON.parse(event.detail)
          : event.detail;

        console.log('💰 [JS] Transação processada:', transaction);
        DebugLogger.log(`💰 Transação: R$ ${transaction.amount} - ${transaction.type} (${transaction.source})`);

        onTransactionDetected(transaction);
      } catch (error) {
        console.error('❌ [JS] Erro ao processar transação:', error);
        DebugLogger.error(`Erro ao processar transação: ${error}`);
      }
    };

    console.log('👂 [JS] Registrando listener para transactionDetected');
    window.addEventListener('transactionDetected', handleTransactionDetected);
    console.log('✅ [JS] Listener registrado com sucesso');

    return () => {
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
        try {
          DebugLogger.log('Hook: Verificando se permissão foi concedida...');
          const result = await NotificationListener.checkPermission();
          DebugLogger.log(`Hook: Permissão concedida: ${result.granted}`);
          setHasPermission(result.granted);
        } catch (err) {
          console.error('Erro ao verificar permissão:', err);
        }
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

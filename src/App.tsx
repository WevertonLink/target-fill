import { useState } from 'react';
import { Plus, Target, Menu, X, ArrowUpDown, Eye, EyeOff, Home, Grid3x3, LayoutList, Bell, Zap } from 'lucide-react';
import GoalCard from './components/GoalCard';
import GoalDetails from './components/GoalDetails';
import EditGoal from './components/EditGoal';
import ConfirmModal from './components/ConfirmModal';
import EmptyState from './components/EmptyState';
import ImageInput from './components/ImageInput';
import ToastContainer from './components/ToastContainer';
import StatsModal from './components/StatsModal';
import AchievementsModal from './components/AchievementsModal';
import TransactionModal from './components/TransactionModal';
import AutoRulesModal from './components/AutoRulesModal';
import { useToast } from './hooks/useToast';
import { useNotificationListener } from './hooks/useNotificationListener';
import type { Goal } from './types';
import type { TransactionData } from './plugins/notificationListener';

// Storage inline para evitar problemas de cache
const STORAGE_KEY = 'target_fill_goals';

const storage = {
  getGoals: (): Goal[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveGoals: (goals: Goal[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  },

  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'payments'>) => {
    const goals = storage.getGoals();
    const newGoal: Goal = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      payments: [],
      ...goal
    };
    goals.push(newGoal);
    storage.saveGoals(goals);
    return newGoal;
  },

  updateGoal: (id: string, updates: Partial<Goal>) => {
    const goals = storage.getGoals();
    const index = goals.findIndex(g => g.id === id);
    if (index !== -1) {
      goals[index] = { ...goals[index], ...updates };
      storage.saveGoals(goals);
      return goals[index];
    }
    return null;
  },

  deleteGoal: (id: string) => {
    const goals = storage.getGoals().filter(g => g.id !== id);
    storage.saveGoals(goals);
  },

  addPayment: (goalId: string, amount: string) => {
    const goals = storage.getGoals();
    const goal = goals.find(g => g.id === goalId);
    
    if (goal) {
      const newPayment = {
        id: `payment_${Date.now()}`,
        amount: parseFloat(amount),
        date: new Date().toISOString()
      };
      
      goal.payments.push(newPayment);
      storage.saveGoals(goals);
      return newPayment;
    }
    return null;
  },

  deletePayment: (goalId: string, paymentId: string) => {
    const goals = storage.getGoals();
    const goal = goals.find(g => g.id === goalId);
    
    if (goal) {
      goal.payments = goal.payments.filter(p => p.id !== paymentId);
      storage.saveGoals(goals);
      return true;
    }
    return false;
  }
};

type SortType = 'recent' | 'progress' | 'deadline' | 'amount';
type ViewMode = 'grid' | 'list';

interface ConfirmState {
  show: boolean;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  onConfirm: () => void;
}

function App() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      return storage.getGoals();
    } catch {
      return [];
    }
  });

  const [showWelcomeHub, setShowWelcomeHub] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGoalImage, setNewGoalImage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [sortBy, setSortBy] = useState<SortType>('recent');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmState>({
    show: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: () => {}
  });

  // Notification listener states
  const [detectedTransaction, setDetectedTransaction] = useState<TransactionData | null>(null);
  const [showAutoRulesModal, setShowAutoRulesModal] = useState(false);

  const toast = useToast();
  const notificationListener = useNotificationListener((transaction) => {
    // Callback quando uma transação é detectada
    const suggestedGoalId = notificationListener.checkAutoRules(transaction);

    if (suggestedGoalId) {
      // Regra automática encontrada - aplica direto e notifica
      const goal = goals.find(g => g.id === suggestedGoalId);
      if (goal) {
        handleAddPayment(suggestedGoalId, transaction.amount.toString());
        toast.success(`✓ R$ ${transaction.amount.toFixed(2)} adicionado automaticamente a "${goal.name}"`);
        return;
      }
    }

    // Sem regra - mostra modal de confirmação
    setDetectedTransaction(transaction);
  });

  const loadGoals = () => {
    try {
      const updatedGoals = storage.getGoals();
      setGoals(updatedGoals);

      if (selectedGoal) {
        const updatedSelectedGoal = updatedGoals.find(g => g.id === selectedGoal.id);
        setSelectedGoal(updatedSelectedGoal || null);
      }
    } catch (error) {
      console.error('Erro ao carregar:', error);
    }
  };

  const handleHomeClick = () => {
    // Fecha todos os modais e volta para o hub de boas-vindas
    setSelectedGoal(null);
    setEditingGoal(null);
    setShowCreateModal(false);
    setShowMenu(false);
    setShowWelcomeHub(true);
  };

  const handleGoToGoals = () => {
    // Vai para a seção de metas
    setShowWelcomeHub(false);
    setShowMenu(false);
  };

  const showConfirm = (title: string, message: string, type: 'danger' | 'warning' | 'info' | 'success', onConfirm: () => void) => {
    setConfirmModal({ show: true, title, message, type, onConfirm });
  };

  const hideConfirm = () => {
    setConfirmModal({ ...confirmModal, show: false });
  };

  const handleCreateGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const goalName = formData.get('name') as string;
      storage.addGoal({
        name: goalName,
        targetAmount: parseFloat(formData.get('amount') as string),
        imageUrl: newGoalImage,
        isPurchased: formData.get('mode') === 'purchased',
        deadline: (formData.get('deadline') as string) || undefined,
        category: (formData.get('category') as string) || undefined
      });

      loadGoals();
      setShowCreateModal(false);
      setNewGoalImage('');
      e.currentTarget.reset();
      setShowWelcomeHub(false); // Vai para a seção de metas após criar

      toast.success(`✓ Meta "${goalName}" criada com sucesso!`);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Não foi possível criar a meta');
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
  };

  const handleSaveEdit = (updates: Partial<Goal>) => {
    if (editingGoal) {
      try {
        storage.updateGoal(editingGoal.id, updates);
        loadGoals();
        setEditingGoal(null);
        toast.success('✓ Meta atualizada com sucesso!');
      } catch (error) {
        console.error('Erro:', error);
        toast.error('Não foi possível atualizar a meta');
      }
    }
  };

  const handleAddPayment = (goalId: string, amount: string) => {
    try {
      const payment = storage.addPayment(goalId, amount);
      loadGoals();

      if (payment) {
        const formattedAmount = payment.amount.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        toast.success(`✓ R$ ${formattedAmount} adicionados com sucesso!`);
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Não foi possível adicionar o pagamento');
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    showConfirm(
      'Excluir Meta',
      'Tem certeza que deseja excluir esta meta? Todos os pagamentos serão perdidos.',
      'danger',
      () => {
        try {
          storage.deleteGoal(goalId);
          loadGoals();
          hideConfirm();
          toast.success('✓ Meta excluída com sucesso!');
        } catch (error) {
          console.error('Erro:', error);
          toast.error('Não foi possível excluir a meta');
        }
      }
    );
  };

  const handleDeletePayment = (paymentId: string) => {
    if (!selectedGoal) return;

    try {
      const success = storage.deletePayment(selectedGoal.id, paymentId);
      loadGoals();

      if (success) {
        toast.success('✓ Pagamento excluído com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao excluir pagamento:', error);
      toast.error('Não foi possível excluir o pagamento');
    }
  };

  const handleTransactionConfirm = (goalId: string, amount: number) => {
    handleAddPayment(goalId, amount.toString());
    setDetectedTransaction(null);
  };

  const handleCreateRuleFromTransaction = (bankSource: string, type: string, goalId: string) => {
    notificationListener.addAutoRule({
      bankSource,
      transactionType: type as any,
      targetGoalId: goalId,
      enabled: true
    });
    toast.success('✓ Regra automática criada!');
  };

  const getSortedAndFilteredGoals = () => {
    let filtered = [...goals];

    if (hideCompleted) {
      filtered = filtered.filter(g => {
        const totalPaid = g.payments.reduce((sum, p) => sum + p.amount, 0);
        return totalPaid < g.targetAmount;
      });
    }

    switch (sortBy) {
      case 'progress':
        return filtered.sort((a, b) => {
          const progressA = a.payments.reduce((sum, p) => sum + p.amount, 0) / a.targetAmount;
          const progressB = b.payments.reduce((sum, p) => sum + p.amount, 0) / b.targetAmount;
          return progressB - progressA;
        });
      
      case 'deadline':
        return filtered.sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        });
      
      case 'amount':
        return filtered.sort((a, b) => {
          const remainingA = a.targetAmount - a.payments.reduce((sum, p) => sum + p.amount, 0);
          const remainingB = b.targetAmount - b.payments.reduce((sum, p) => sum + p.amount, 0);
          return remainingA - remainingB;
        });
      
      default:
        return filtered.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  };

  const displayGoals = getSortedAndFilteredGoals();

  const getStats = () => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => {
      const totalPaid = g.payments.reduce((sum, p) => sum + p.amount, 0);
      return totalPaid >= g.targetAmount;
    }).length;
    const totalPaid = goals.reduce((sum, g) => {
      return sum + g.payments.reduce((pSum, p) => pSum + p.amount, 0);
    }, 0);
    
    return { totalGoals, completedGoals, totalPaid };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-black text-white">
      <header
        className="bg-zinc-900 border-b border-zinc-800 p-4 sticky z-40"
        style={{ top: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo-icon.png"
              alt="Target-Fill"
              className="w-8 h-8 object-contain"
              style={{ filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.4))' }}
            />
            <h1 className="text-2xl font-bold text-gold-400">Target-Fill</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleHomeClick}
              className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-zinc-800 rounded-md transition-colors"
              title="Início"
              aria-label="Voltar para página inicial"
            >
              <Home size={24} className="text-gold-400" />
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gold-500 hover:bg-gold-600 active:scale-95 text-black font-semibold px-4 py-3 min-h-[44px] rounded-md flex items-center gap-2 transition-all"
              aria-label="Criar nova meta"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Nova Meta</span>
            </button>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-zinc-800 rounded-md transition-colors"
              aria-label={showMenu ? 'Fechar menu' : 'Abrir menu'}
            >
              {showMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {showMenu && (
          <div className="max-w-4xl mx-auto mt-3 bg-zinc-800 rounded-lg p-3 space-y-3">
            <div className="text-zinc-400 text-sm pb-2 border-b border-zinc-700">
              <p className="font-semibold text-gold-400 mb-1">📊 Estatísticas</p>
              <div className="pl-2 space-y-0.5 text-xs">
                <p>Metas: {stats.totalGoals} | Concluídas: {stats.completedGoals}</p>
                <p>Total investido: R$ {stats.totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>

            <div>
              <p className="font-semibold text-gold-400 mb-2 flex items-center gap-2">
                <ArrowUpDown size={16} />
                Ordenar por
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSortBy('recent');
                    setShowMenu(false);
                  }}
                  className={`px-3 py-2 rounded-md text-sm ${
                    sortBy === 'recent' 
                      ? 'bg-gold-500 text-black font-semibold' 
                      : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                  }`}
                >
                  Mais Recentes
                </button>
                <button
                  onClick={() => {
                    setSortBy('progress');
                    setShowMenu(false);
                  }}
                  className={`px-3 py-2 rounded-md text-sm ${
                    sortBy === 'progress' 
                      ? 'bg-gold-500 text-black font-semibold' 
                      : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                  }`}
                >
                  Maior Progresso
                </button>
                <button
                  onClick={() => {
                    setSortBy('deadline');
                    setShowMenu(false);
                  }}
                  className={`px-3 py-2 rounded-md text-sm ${
                    sortBy === 'deadline' 
                      ? 'bg-gold-500 text-black font-semibold' 
                      : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                  }`}
                >
                  Prazo Próximo
                </button>
                <button
                  onClick={() => {
                    setSortBy('amount');
                    setShowMenu(false);
                  }}
                  className={`px-3 py-2 rounded-md text-sm ${
                    sortBy === 'amount' 
                      ? 'bg-gold-500 text-black font-semibold' 
                      : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                  }`}
                >
                  Menor Valor
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-700 space-y-2">
              <button
                onClick={() => {
                  setHideCompleted(!hideCompleted);
                  setShowMenu(false);
                }}
                className={`w-full px-3 py-2 rounded-md text-sm flex items-center justify-between ${
                  hideCompleted
                    ? 'bg-gold-500 text-black font-semibold'
                    : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                }`}
              >
                <span className="flex items-center gap-2">
                  {hideCompleted ? <EyeOff size={16} /> : <Eye size={16} />}
                  Ocultar Concluídas
                </span>
                <span>{hideCompleted ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => {
                  setViewMode(viewMode === 'grid' ? 'list' : 'grid');
                  setShowMenu(false);
                }}
                className={`w-full px-3 py-2 rounded-md text-sm flex items-center justify-between ${
                  viewMode === 'grid'
                    ? 'bg-gold-500 text-black font-semibold'
                    : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                }`}
              >
                <span className="flex items-center gap-2">
                  {viewMode === 'grid' ? <Grid3x3 size={16} /> : <LayoutList size={16} />}
                  Visualização
                </span>
                <span>{viewMode === 'grid' ? 'Grid' : 'Lista'}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-zinc-700 space-y-2">
              <p className="font-semibold text-gold-400 mb-2 flex items-center gap-2">
                <Bell size={16} />
                Notificações Bancárias
              </p>

              {!notificationListener.hasPermission ? (
                <button
                  onClick={() => {
                    notificationListener.requestPermission();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 rounded-md text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                >
                  <Bell size={16} />
                  Ativar Detecção Automática
                </button>
              ) : (
                <>
                  <div className="bg-green-900/30 border border-green-700 rounded-md px-3 py-2 text-sm">
                    <div className="flex items-center gap-2 text-green-400">
                      <Bell size={16} />
                      <span className="font-medium">Detecção Ativa</span>
                    </div>
                    <p className="text-xs text-green-300 mt-1">
                      {notificationListener.autoRules.filter(r => r.enabled).length} regras ativas
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowAutoRulesModal(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-md text-sm bg-zinc-700 hover:bg-zinc-600 text-white flex items-center justify-center gap-2"
                  >
                    <Zap size={16} />
                    Gerenciar Regras
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {showWelcomeHub ? (
          <EmptyState
            onCreateClick={() => setShowCreateModal(true)}
            onViewGoalsClick={goals.length > 0 ? handleGoToGoals : undefined}
            onStatsClick={() => setShowStatsModal(true)}
            onAchievementsClick={() => setShowAchievementsModal(true)}
          />
        ) : (
          <>
            {displayGoals.length === 0 ? (
              <div className="text-center py-16">
                <Target size={64} className="text-zinc-700 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-zinc-600 mb-2">
                  Nenhuma meta para exibir
                </h2>
                <p className="text-zinc-500 mb-6">
                  Ajuste os filtros no menu
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid gap-3 grid-cols-2' : 'flex flex-col gap-4'}>
                {displayGoals.map(goal => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onAddPayment={handleAddPayment}
                    onDelete={handleDeleteGoal}
                    onEdit={handleEditGoal}
                    onClick={() => setSelectedGoal(goal)}
                    compact={viewMode === 'grid'}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto border border-zinc-800">
            <h2 className="text-2xl font-bold text-gold-400 mb-4">Nova Meta</h2>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ex: iPhone"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Valor (R$)</label>
                <input
                  type="number"
                  name="amount"
                  required
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <ImageInput 
                value={newGoalImage}
                onChange={setNewGoalImage}
              />

              <div>
                <label className="block text-sm font-medium mb-1">Prazo (opcional)</label>
                <input
                  type="date"
                  name="deadline"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Categoria (opcional)</label>
                <select
                  name="category"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="">Selecione...</option>
                  <option value="Eletrônicos">Eletrônicos</option>
                  <option value="Viagem">Viagem</option>
                  <option value="Educação">Educação</option>
                  <option value="Casa">Casa</option>
                  <option value="Veículo">Veículo</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Modo</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="mode" value="saving" defaultChecked />
                    <span>Juntando</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="mode" value="purchased" />
                    <span>Já comprei</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 active:scale-95 min-h-[48px] py-3 rounded-md transition-all font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gold-500 hover:bg-gold-600 active:scale-95 text-black font-semibold min-h-[48px] py-3 rounded-md transition-all"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedGoal && (
        <GoalDetails
          goal={selectedGoal}
          onClose={() => setSelectedGoal(null)}
          onDeletePayment={handleDeletePayment}
        />
      )}

      {editingGoal && (
        <EditGoal
          goal={editingGoal}
          onSave={handleSaveEdit}
          onClose={() => setEditingGoal(null)}
        />
      )}

      {confirmModal.show && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          type={confirmModal.type}
          onConfirm={() => {
            confirmModal.onConfirm();
            hideConfirm();
          }}
          onCancel={hideConfirm}
        />
      )}

      {showStatsModal && (
        <StatsModal
          goals={goals}
          onClose={() => setShowStatsModal(false)}
        />
      )}

      {showAchievementsModal && (
        <AchievementsModal
          goals={goals}
          onClose={() => setShowAchievementsModal(false)}
        />
      )}

      {detectedTransaction && (
        <TransactionModal
          transaction={detectedTransaction}
          goals={goals}
          suggestedGoalId={notificationListener.checkAutoRules(detectedTransaction) || undefined}
          onConfirm={handleTransactionConfirm}
          onIgnore={() => setDetectedTransaction(null)}
          onCreateRule={handleCreateRuleFromTransaction}
        />
      )}

      {showAutoRulesModal && (
        <AutoRulesModal
          goals={goals}
          rules={notificationListener.autoRules}
          onAddRule={notificationListener.addAutoRule}
          onRemoveRule={notificationListener.removeAutoRule}
          onToggleRule={notificationListener.toggleAutoRule}
          onClose={() => setShowAutoRulesModal(false)}
        />
      )}

      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
}

export default App;

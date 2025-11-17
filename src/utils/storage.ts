import type { Goal, Payment } from '../types';

const STORAGE_KEY = 'target_fill_goals';

export const storage = {
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
      const newPayment: Payment = {
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
  },

  exportData: () => {
    const goals = storage.getGoals();
    return JSON.stringify({ goals }, null, 2);
  },

  importData: (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.goals && Array.isArray(data.goals)) {
        storage.saveGoals(data.goals);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
};

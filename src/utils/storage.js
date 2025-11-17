const STORAGE_KEY = 'target_fill_goals';

export const storage = {
  getGoals: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveGoals: (goals) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  },

  addGoal: (goal) => {
    const goals = storage.getGoals();
    const newGoal = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      payments: [],
      ...goal
    };
    goals.push(newGoal);
    storage.saveGoals(goals);
    return newGoal;
  },

  updateGoal: (id, updates) => {
    const goals = storage.getGoals();
    const index = goals.findIndex(g => g.id === id);
    if (index !== -1) {
      goals[index] = { ...goals[index], ...updates };
      storage.saveGoals(goals);
    }
  },

  deleteGoal: (id) => {
    const goals = storage.getGoals().filter(g => g.id !== id);
    storage.saveGoals(goals);
  },

  addPayment: (goalId, amount) => {
    const goals = storage.getGoals();
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      goal.payments.push({
        id: Date.now().toString(),
        amount: parseFloat(amount),
        date: new Date().toISOString()
      });
      storage.saveGoals(goals);
    }
  }
};

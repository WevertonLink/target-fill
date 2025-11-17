export interface Payment {
  id: string;
  amount: number;
  date: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  payments: Payment[];
  imageUrl?: string;
  createdAt: string;
  isPurchased?: boolean;
  deadline?: string;
  category?: string;
}

export interface UserStats {
  totalGoals: number;
  completedGoals: number;
  totalPaid: number;
  currentStreak: number;
  lastPaymentDate?: string;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

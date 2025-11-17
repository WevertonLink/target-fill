import { X } from 'lucide-react';
import type { Goal } from '../types';

interface EditGoalProps {
  goal: Goal;
  onSave: (updates: Partial<Goal>) => void;
  onClose: () => void;
}

export default function EditGoal({ goal, onSave, onClose }: EditGoalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    onSave({
      name: formData.get('name') as string,
      targetAmount: parseFloat(formData.get('amount') as string),
      imageUrl: (formData.get('image') as string) || '',
      deadline: (formData.get('deadline') as string) || undefined,
      category: (formData.get('category') as string) || undefined
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gold-400">Editar Meta</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome da Meta</label>
            <input
              type="text"
              name="name"
              required
              defaultValue={goal.name}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Valor Total (R$)</label>
            <input
              type="number"
              name="amount"
              required
              step="0.01"
              min="0.01"
              defaultValue={goal.targetAmount}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL da Imagem (opcional)</label>
            <input
              type="url"
              name="image"
              defaultValue={goal.imageUrl}
              placeholder="https://..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prazo (opcional)</label>
            <input
              type="date"
              name="deadline"
              defaultValue={goal.deadline?.split('T')[0]}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categoria (opcional)</label>
            <select
              name="category"
              defaultValue={goal.category}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-gold-500"
            >
              <option value="">Selecione...</option>
              <option value="Eletrônicos">Eletrônicos</option>
              <option value="Viagem">Viagem</option>
              <option value="Educação">Educação</option>
              <option value="Saúde">Saúde</option>
              <option value="Casa">Casa</option>
              <option value="Veículo">Veículo</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-2 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-gold-500 hover:bg-gold-600 text-black font-semibold py-2 rounded-md"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

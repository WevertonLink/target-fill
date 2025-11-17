import { X, Calendar, DollarSign, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Goal } from '../types';

interface GoalDetailsProps {
  goal: Goal | null;
  onClose: () => void;
  onDeletePayment: (paymentId: string) => void;
}

export default function GoalDetails({ goal, onClose, onDeletePayment }: GoalDetailsProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (!goal) return null;

  const totalPaid = goal.payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = goal.targetAmount - totalPaid;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
        <div className="bg-zinc-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto border border-zinc-800">
          <div className="sticky top-0 bg-zinc-900 p-4 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gold-400">{goal.name}</h2>
            <button onClick={onClose} className="text-zinc-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div className="p-4">
            {goal.imageUrl && (
              <img 
                src={goal.imageUrl} 
                alt={goal.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}

            <div className="bg-zinc-800 rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-zinc-400">Valor total</span>
                <span className="text-white font-bold">R$ {goal.targetAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-zinc-400">Já pago</span>
                <span className="text-green-400 font-bold">R$ {totalPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Restante</span>
                <span className="text-gold-400 font-bold">R$ {remaining.toFixed(2)}</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3 text-gold-400">Histórico de Pagamentos</h3>
            
            {goal.payments.length === 0 ? (
              <p className="text-zinc-500 text-center py-4">Nenhum pagamento ainda</p>
            ) : (
              <div className="space-y-2">
                {[...goal.payments].reverse().map(payment => (
                  <div key={payment.id} className="bg-zinc-800 rounded-md p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2 flex-1">
                      <DollarSign size={18} className="text-gold-400" />
                      <span className="text-white font-semibold">R$ {payment.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-zinc-400 text-sm">
                        <Calendar size={14} />
                        <span>{new Date(payment.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <button
                        onClick={() => setConfirmDelete(payment.id)}
                        className="text-red-500 hover:text-red-400 p-1 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[60]">
          <div className="bg-zinc-900 rounded-lg max-w-sm w-full border border-zinc-800 shadow-2xl">
            <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-500/20 border border-red-500">
                <Trash2 className="text-red-400" size={24} />
              </div>
              <h3 className="font-bold text-white text-lg">Excluir Pagamento</h3>
            </div>
            
            <div className="p-4">
              <p className="text-zinc-300 text-sm leading-relaxed">
                Tem certeza que deseja excluir este pagamento? Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="p-4 border-t border-zinc-800 flex gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 px-4 rounded-md font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeletePayment(confirmDelete);
                  setConfirmDelete(null);
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 px-4 rounded-md font-medium transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

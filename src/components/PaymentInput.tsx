import { useState } from 'react';
import { DollarSign, X } from 'lucide-react';

interface PaymentInputProps {
  goalName: string;
  remaining: number;
  onConfirm: (amount: string) => void;
  onCancel: () => void;
}

export default function PaymentInput({ goalName, remaining, onConfirm, onCancel }: PaymentInputProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Digite um valor válido');
      return;
    }
    
    if (numAmount > remaining) {
      setError('Valor maior que o restante');
      return;
    }
    
    onConfirm(amount);
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
    setError('');
  };

  const quickAmounts = [50, 100, 200, 500];

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[70]">
      <div className="bg-zinc-900 rounded-lg max-w-sm w-full border border-zinc-800 shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gold-500/20 border border-gold-500">
              <DollarSign className="text-gold-400" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Dedicar Valor</h3>
              <p className="text-sm text-zinc-400">{goalName}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Info */}
          <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
            <p className="text-sm text-zinc-400">Falta dedicar:</p>
            <p className="text-2xl font-bold text-gold-400">
              R$ {remaining.toFixed(2)}
            </p>
          </div>

          {/* Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Quanto deseja dedicar?
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={remaining}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                placeholder="0.00"
                autoFocus
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white text-lg focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <span>⚠️</span> {error}
              </p>
            )}
          </div>

          {/* Quick amounts */}
          <div>
            <p className="text-sm text-zinc-400 mb-2">Valores rápidos:</p>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleQuickAmount(value)}
                  disabled={value > remaining}
                  className={`min-h-[44px] py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    value > remaining
                      ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-gold-400 border border-zinc-700 hover:border-gold-500 active:scale-95'
                  }`}
                >
                  R$ {value}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white min-h-[48px] py-3 px-4 rounded-lg font-medium transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-gold-500 hover:bg-gold-600 active:scale-95 text-black min-h-[48px] py-3 px-4 rounded-lg font-medium transition-all"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

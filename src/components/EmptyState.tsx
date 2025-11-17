import { Target, TrendingUp, DollarSign, Calendar } from 'lucide-react';

interface EmptyStateProps {
  onCreateClick: () => void;
}

export default function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gold-500/10 rounded-full animate-ping" />
          </div>
          <div className="relative flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center shadow-2xl shadow-gold-500/50">
              <Target size={64} className="text-black" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
          Comece sua jornada!
        </h2>
        
        <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
          Crie sua primeira meta e transforme seus sonhos em realidade
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 flex items-center gap-3 hover:border-gold-500/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
              <DollarSign className="text-gold-400" size={20} />
            </div>
            <div className="text-left">
              <p className="font-semibold text-white text-sm">Controle Total</p>
              <p className="text-zinc-500 text-xs">Acompanhe cada centavo investido</p>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 flex items-center gap-3 hover:border-gold-500/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="text-gold-400" size={20} />
            </div>
            <div className="text-left">
              <p className="font-semibold text-white text-sm">Progresso Visual</p>
              <p className="text-zinc-500 text-xs">Veja seu avanço em tempo real</p>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 flex items-center gap-3 hover:border-gold-500/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
              <Calendar className="text-gold-400" size={20} />
            </div>
            <div className="text-left">
              <p className="font-semibold text-white text-sm">Prazos & Metas</p>
              <p className="text-zinc-500 text-xs">Organize e priorize seus objetivos</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onCreateClick}
          className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-bold py-4 px-8 rounded-xl shadow-lg shadow-gold-500/50 hover:shadow-gold-500/70 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <Target size={24} />
          <span className="text-lg">Criar Primeira Meta</span>
        </button>

        {/* Subtitle */}
        <p className="mt-6 text-zinc-600 text-sm">
          É grátis e seus dados ficam seguros no seu dispositivo 🔒
        </p>
      </div>
    </div>
  );
}

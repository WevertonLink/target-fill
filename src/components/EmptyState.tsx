import { Target, TrendingUp, Trophy } from 'lucide-react';

interface EmptyStateProps {
  onCreateClick: () => void;
  onViewGoalsClick?: () => void;
  onStatsClick?: () => void;
  onAchievementsClick?: () => void;
}

export default function EmptyState({ onCreateClick, onViewGoalsClick, onStatsClick, onAchievementsClick }: EmptyStateProps) {
  return (
    <div className="h-[calc(100vh-160px)] flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-md w-full text-center flex flex-col justify-center">
        {/* Logo Limpa - Sem $ e sem estrelas */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Glow suave */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gold-500/20 rounded-full animate-pulse blur-2xl" />
          </div>
          
          {/* Círculos do target */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Círculo externo animado */}
            <div className="absolute w-32 h-32 rounded-full border-4 border-gold-500/30 animate-ping" style={{ animationDuration: '3s' }} />
            
            {/* Círculo médio */}
            <div className="absolute w-24 h-24 rounded-full border-4 border-gold-500/50" />
            
            {/* Círculo interno */}
            <div className="absolute w-16 h-16 rounded-full border-4 border-gold-500/70" />
            
            {/* Centro preenchido (SEM cifrão) */}
            <div className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 shadow-2xl shadow-gold-500/50" />
          </div>
        </div>

        {/* Title */}
        <div className="mb-2">
          <h2 className="text-3xl font-black mb-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 bg-clip-text text-transparent">
            Comece sua jornada!
          </h2>
          <div className="h-0.5 w-20 mx-auto bg-gradient-to-r from-transparent via-gold-500 to-transparent rounded-full" />
        </div>
        
        <p className="text-zinc-400 text-base mb-5 leading-relaxed">
          Transforme seus <span className="text-gold-400 font-semibold">sonhos</span> em <span className="text-gold-400 font-semibold">realidade</span>
        </p>

        {/* Botões funcionais */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {/* Ver Metas */}
          <button
            onClick={onViewGoalsClick}
            className="bg-gradient-to-b from-zinc-900 to-zinc-800 border border-zinc-700/50 rounded-lg p-3 flex flex-col items-center gap-1 hover:border-gold-500/50 transition-all hover:scale-105 active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center border border-gold-500/30">
              <Target className="text-gold-400" size={18} strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <p className="font-bold text-white text-xs leading-tight">Ver Metas</p>
              <p className="text-zinc-500 text-[10px] leading-tight">Criadas</p>
            </div>
          </button>

          {/* Estatísticas */}
          <button
            onClick={onStatsClick}
            className="bg-gradient-to-b from-zinc-900 to-zinc-800 border border-zinc-700/50 rounded-lg p-3 flex flex-col items-center gap-1 hover:border-gold-500/50 transition-all hover:scale-105 active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center border border-gold-500/30">
              <TrendingUp className="text-gold-400" size={18} strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <p className="font-bold text-white text-xs leading-tight">Estatísticas</p>
              <p className="text-zinc-500 text-[10px] leading-tight">Geral</p>
            </div>
          </button>

          {/* Conquistas */}
          <button
            onClick={onAchievementsClick}
            className="bg-gradient-to-b from-zinc-900 to-zinc-800 border border-zinc-700/50 rounded-lg p-3 flex flex-col items-center gap-1 hover:border-gold-500/50 transition-all hover:scale-105 active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center border border-gold-500/30">
              <Trophy className="text-gold-400" size={18} strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <p className="font-bold text-white text-xs leading-tight">Conquistas</p>
              <p className="text-zinc-500 text-[10px] leading-tight">Desbloqueadas</p>
            </div>
          </button>
        </div>

        {/* CTA Button */}
        <button
          onClick={onCreateClick}
          className="w-full bg-gradient-to-r from-gold-500 via-gold-600 to-gold-500 hover:from-gold-600 hover:via-gold-700 hover:to-gold-600 text-black font-bold py-3.5 px-6 rounded-xl shadow-2xl shadow-gold-500/50 hover:shadow-gold-500/70 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <Target size={20} strokeWidth={2.5} />
          <span className="text-base">Criar Primeira Meta</span>
        </button>

        {/* Subtitle */}
        <p className="mt-4 text-zinc-600 text-xs flex items-center justify-center gap-1.5">
          <span>🔒</span>
          <span>Dados seguros no seu dispositivo</span>
        </p>
      </div>
    </div>
  );
}

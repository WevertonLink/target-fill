import { Filter, X } from 'lucide-react';

interface FilteredEmptyStateProps {
  onClearFilters: () => void;
}

export default function FilteredEmptyState({ onClearFilters }: FilteredEmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center border-2 border-zinc-700">
        <Filter size={32} className="text-zinc-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-zinc-600 mb-2">
        Nenhuma meta encontrada
      </h2>
      
      <p className="text-zinc-500 mb-6">
        Ajuste os filtros no menu ou limpe-os para ver todas as metas
      </p>
      
      <button
        onClick={onClearFilters}
        className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
      >
        <X size={20} />
        Limpar Filtros
      </button>
    </div>
  );
}

import { Tag, X, Smartphone, Plane, BookOpen, Home, Car, Package } from 'lucide-react';

interface CategorySelectorProps {
  selected: string;
  onSelect: (category: string) => void;
  onClose: () => void;
}

const categories = [
  { value: '', label: 'Sem categoria', icon: Package },
  { value: 'Eletrônicos', label: 'Eletrônicos', icon: Smartphone },
  { value: 'Viagem', label: 'Viagem', icon: Plane },
  { value: 'Educação', label: 'Educação', icon: BookOpen },
  { value: 'Casa', label: 'Casa', icon: Home },
  { value: 'Veículo', label: 'Veículo', icon: Car },
  { value: 'Outro', label: 'Outro', icon: Tag },
];

export default function CategorySelector({ selected, onSelect, onClose }: CategorySelectorProps) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[70]">
      <div className="bg-zinc-900 rounded-lg max-w-md w-full border border-zinc-800 shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gold-500/20 border border-gold-500">
              <Tag className="text-gold-400" size={20} />
            </div>
            <h3 className="font-bold text-white text-lg">Selecione a Categoria</h3>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Categories */}
        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {categories.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => {
                onSelect(value);
                onClose();
              }}
              className={`w-full p-4 rounded-lg border transition-all flex items-center gap-3 ${
                selected === value
                  ? 'bg-gold-500/20 border-gold-500 text-gold-400'
                  : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:border-gold-500/50 hover:bg-zinc-800'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                selected === value ? 'bg-gold-500/30' : 'bg-zinc-700/50'
              }`}>
                <Icon size={20} />
              </div>
              <span className="font-medium">{label}</span>
              {selected === value && (
                <div className="ml-auto w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center">
                  <span className="text-black text-xs">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

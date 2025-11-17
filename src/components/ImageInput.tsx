import { useState } from 'react';
import { Image as ImageIcon, Link, X } from 'lucide-react';

interface ImageInputProps {
  value: string;
  onChange: (url: string) => void;
}

const suggestedImages = [
  { name: 'iPhone', url: 'https://images.unsplash.com/photo-1592286927505-34eddc61241e?w=400' },
  { name: 'Carro', url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400' },
  { name: 'Casa', url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400' },
  { name: 'Viagem', url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400' },
  { name: 'Notebook', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' },
  { name: 'Moto', url: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=400' },
];

export default function ImageInput({ value, onChange }: ImageInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Imagem (opcional)
      </label>

      {/* Preview da imagem */}
      {value && !imageError && (
        <div className="relative mb-3 rounded-lg overflow-hidden border border-zinc-700">
          <img 
            src={value} 
            alt="Preview"
            onError={() => setImageError(true)}
            className="w-full h-48 object-cover"
          />
          <button
            type="button"
            onClick={() => {
              onChange('');
              setImageError(false);
            }}
            className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 rounded-full backdrop-blur-sm"
          >
            <X size={16} className="text-white" />
          </button>
        </div>
      )}

      {/* Botões de ação */}
      {!value && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <ImageIcon size={20} />
            <span>Escolher imagem sugerida</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Link size={20} />
            <span>Inserir link personalizado</span>
          </button>
        </div>
      )}

      {/* Input customizado */}
      {showCustomInput && !value && (
        <div className="mt-3 space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onChange(e.currentTarget.value);
                  setShowCustomInput(false);
                }
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                if (input.value) {
                  onChange(input.value);
                  setShowCustomInput(false);
                }
              }}
              className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-black rounded-lg font-medium"
            >
              OK
            </button>
          </div>
          <p className="text-xs text-zinc-500">
            💡 Dica: Cole o link de uma imagem da internet (Google Imagens, Unsplash, etc)
          </p>
        </div>
      )}

      {/* Sugestões */}
      {showSuggestions && !value && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {suggestedImages.map((img) => (
            <button
              key={img.name}
              type="button"
              onClick={() => {
                onChange(img.url);
                setShowSuggestions(false);
              }}
              className="relative rounded-lg overflow-hidden border-2 border-zinc-700 hover:border-gold-500 transition-colors group"
            >
              <img 
                src={img.url} 
                alt={img.name}
                className="w-full h-24 object-cover"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-medium text-sm">{img.name}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Hidden input para formulário */}
      <input type="hidden" name="image" value={value} />
    </div>
  );
}

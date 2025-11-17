import { useState, useRef } from 'react';
import { Link, X, Upload } from 'lucide-react';

interface ImageInputProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageInput({ value, onChange }: ImageInputProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

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
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Upload size={20} />
            <span>Escolher imagem do dispositivo</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Link size={20} />
            <span>Inserir link da internet</span>
          </button>

          {/* Input de arquivo oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
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

      {/* Hidden input para formulário */}
      <input type="hidden" name="image" value={value} />
    </div>
  );
}

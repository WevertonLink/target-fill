import { X, Download, Upload, AlertTriangle } from 'lucide-react';
import { storage } from '../utils/storage';
import { useState } from 'react';

interface DataManagerProps {
  onClose: () => void;
  onImportSuccess: () => void;
}

export default function DataManager({ onClose, onImportSuccess }: DataManagerProps) {
  const [importError, setImportError] = useState<string | null>(null);

  const handleExport = () => {
    try {
      const data = storage.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `target-fill-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar dados');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string;
        const success = storage.importData(jsonData);
        
        if (success) {
          setImportError(null);
          alert('Dados importados com sucesso!');
          onImportSuccess();
          onClose();
        } else {
          setImportError('Arquivo inválido');
        }
      } catch {
        setImportError('Erro ao ler arquivo');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gold-400">Gerenciar Dados</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <button
              onClick={handleExport}
              className="w-full bg-gold-500 hover:bg-gold-600 text-black font-semibold py-3 rounded-md flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Exportar Dados (Backup)
            </button>
            <p className="text-xs text-zinc-500 mt-2">
              Baixa um arquivo JSON com todas as suas metas e estatísticas
            </p>
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <label className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2 cursor-pointer">
              <Upload size={20} />
              Importar Dados
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <p className="text-xs text-zinc-500 mt-2">
              Restaura dados de um backup anterior
            </p>
            {importError && (
              <div className="mt-2 p-2 bg-red-500/20 border border-red-500 rounded-md flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-400" />
                <span className="text-sm text-red-400">{importError}</span>
              </div>
            )}
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-md p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-500 font-semibold">Atenção</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Importar dados irá substituir todas as metas e estatísticas atuais
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

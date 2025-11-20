import { X, Bell, Zap, CheckCircle, Info } from 'lucide-react';

interface NotificationHelpModalProps {
  onClose: () => void;
}

export default function NotificationHelpModal({ onClose }: NotificationHelpModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-800">
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gold-400 flex items-center gap-2">
            <Bell size={24} />
            Detecção Automática de Transações
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-md transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* O que é */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Info className="text-blue-400" size={20} />
              <h3 className="text-lg font-semibold text-white">O que é?</h3>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">
              O Target-Fill pode detectar automaticamente notificações dos seus bancos e adicionar os valores nas suas metas de forma inteligente. Funciona com <strong className="text-gold-400">14 bancos brasileiros</strong>: Nubank, Inter, C6, Mercado Pago, PicPay, e mais!
            </p>
          </section>

          {/* Como Ativar */}
          <section className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="text-green-400" size={20} />
              <h3 className="text-lg font-semibold text-white">Como Ativar</h3>
            </div>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gold-500 text-black rounded-full flex items-center justify-center font-bold text-xs">1</span>
                <div>
                  <p className="text-white font-medium">Clique em "Ativar Detecção Automática"</p>
                  <p className="text-zinc-400 text-xs mt-1">Isso abrirá as configurações do Android</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gold-500 text-black rounded-full flex items-center justify-center font-bold text-xs">2</span>
                <div>
                  <p className="text-white font-medium">Procure por "Target-Fill" na lista</p>
                  <p className="text-zinc-400 text-xs mt-1">Role a tela até encontrar o app</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gold-500 text-black rounded-full flex items-center justify-center font-bold text-xs">3</span>
                <div>
                  <p className="text-white font-medium">Ative a permissão</p>
                  <p className="text-zinc-400 text-xs mt-1">Toque no app e ative o toggle</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gold-500 text-black rounded-full flex items-center justify-center font-bold text-xs">4</span>
                <div>
                  <p className="text-white font-medium">Volte ao app</p>
                  <p className="text-zinc-400 text-xs mt-1">Pronto! A detecção está ativa</p>
                </div>
              </li>
            </ol>
          </section>

          {/* Regras Automáticas */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="text-yellow-400" size={20} />
              <h3 className="text-lg font-semibold text-white">Regras Automáticas</h3>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed mb-3">
              Configure regras para aplicar transações automaticamente em metas específicas:
            </p>
            <div className="space-y-2 text-sm">
              <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                <p className="text-white font-medium mb-1">Exemplo 1: Depósitos em Caixinhas</p>
                <p className="text-zinc-400 text-xs">
                  "Toda vez que depositar na caixinha do Nubank, adicionar na meta 'Viagem'"
                </p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                <p className="text-white font-medium mb-1">Exemplo 2: Recebimentos PIX</p>
                <p className="text-zinc-400 text-xs">
                  "Todo PIX recebido no Inter, adicionar 50% na meta 'Reserva de Emergência'"
                </p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                <p className="text-white font-medium mb-1">Exemplo 3: Rendimentos</p>
                <p className="text-zinc-400 text-xs">
                  "Todos os rendimentos do Mercado Pago, adicionar na meta 'Investimento'"
                </p>
              </div>
            </div>
          </section>

          {/* Tipos de Transação */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="text-green-400" size={20} />
              <h3 className="text-lg font-semibold text-white">Tipos Detectados</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-3">
                <p className="text-green-400 font-medium">✓ Recebimentos</p>
                <p className="text-zinc-400 text-xs">PIX, TED, transferências</p>
              </div>
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-3">
                <p className="text-red-400 font-medium">✓ Gastos</p>
                <p className="text-zinc-400 text-xs">Compras, pagamentos</p>
              </div>
              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3">
                <p className="text-blue-400 font-medium">✓ Poupança</p>
                <p className="text-zinc-400 text-xs">Depósitos em caixinhas</p>
              </div>
              <div className="bg-gold-900/30 border border-gold-700 rounded-lg p-3">
                <p className="text-gold-400 font-medium">✓ Rendimentos</p>
                <p className="text-zinc-400 text-xs">Investimentos, juros</p>
              </div>
            </div>
          </section>

          {/* Bancos Suportados */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">14 Bancos Suportados</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Nubank
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Inter
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                C6 Bank
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Mercado Pago
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                Bradesco
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Banco do Brasil
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                Itaú
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Santander
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                PicPay
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                Neon
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                Next
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                Will Bank
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Caixa
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                Original
              </div>
            </div>
          </section>

          {/* Privacidade */}
          <section className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
            <p className="text-sm text-zinc-300">
              <strong className="text-gold-400">🔒 Privacidade:</strong> O Target-Fill só lê notificações de bancos. Nenhum dado é enviado para servidores externos. Tudo fica armazenado apenas no seu dispositivo.
            </p>
          </section>

          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="w-full bg-gold-500 hover:bg-gold-600 text-black font-semibold py-3 rounded-md transition-colors"
          >
            Entendi!
          </button>
        </div>
      </div>
    </div>
  );
}

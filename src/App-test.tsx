import { useState } from 'react';
import { Plus, Target } from 'lucide-react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <header className="bg-zinc-900 border-b border-zinc-800 p-4 rounded-lg mb-4">
        <div className="flex items-center gap-2">
          <Target className="text-gold-400" size={28} />
          <h1 className="text-2xl font-bold text-gold-400">Target-Fill</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto text-center py-16">
        <Target size={64} className="text-gold-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">App Carregado!</h2>
        <p className="text-zinc-400 mb-6">Clique para testar: {count}</p>
        <button
          onClick={() => setCount(count + 1)}
          className="bg-gold-500 hover:bg-gold-600 text-black font-semibold px-6 py-3 rounded-md flex items-center gap-2 mx-auto"
        >
          <Plus size={20} />
          Clique Aqui
        </button>
      </main>
    </div>
  );
}

export default App;

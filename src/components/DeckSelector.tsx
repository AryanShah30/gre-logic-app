
import { wordList } from '../data/words';
import { Download } from 'lucide-react';

interface DeckSelectorProps {
  onSelectMode: (mode: 'SupportContrast' | 'LogicNegative' | 'Extreme' | 'Reference') => void;
}

export function DeckSelector({ onSelectMode }: DeckSelectorProps) {
  const supportCount = wordList.filter(w => w.category === 'Support' || w.category === 'Contrast').length;
  const logicCount = wordList.filter(w => w.category === 'No Logic Change' || w.category === 'Negative').length;
  const extremeCount = wordList.filter(w => w.category === 'Extreme').length;
  const referenceCount = wordList.filter(w => w.category === 'Reference').length;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-md mx-auto px-6 space-y-6">
      
      <button 
        onClick={() => onSelectMode('SupportContrast')}
        className="w-full group bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-left"
      >
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-xl text-gray-900">Support vs Contrast</h3>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-gray-200 transition-colors">{supportCount}</span>
        </div>
      </button>

      <button 
        onClick={() => onSelectMode('LogicNegative')}
        className="w-full group bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-left"
      >
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-xl text-gray-900">Logic vs Negative</h3>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-gray-200 transition-colors">{logicCount}</span>
        </div>
      </button>

      <button 
        onClick={() => onSelectMode('Extreme')}
        className="w-full group bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-left"
      >
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-xl text-gray-900">Extreme Words</h3>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-gray-200 transition-colors">{extremeCount}</span>
        </div>
      </button>

      <button 
        onClick={() => onSelectMode('Reference')}
        className="w-full group bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-left"
      >
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-xl text-gray-900">Previously Referenced</h3>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-bold text-gray-500 group-hover:bg-gray-200 transition-colors">{referenceCount}</span>
        </div>
      </button>

      <div className="pt-8">
        <a 
          href="/Logic Support Contrast List.pdf" 
          download
          className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors px-4 py-2 rounded-full hover:bg-white/50"
        >
          <Download size={16} />
          Download Entire List
        </a>
      </div>
    </div>
  );
}

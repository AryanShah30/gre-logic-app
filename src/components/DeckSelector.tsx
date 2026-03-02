import ReactGA from 'react-ga4';
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
    <div className="flex-1 flex flex-col items-center justify-center w-full px-4 py-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-white/40 backdrop-blur-2xl px-6 py-5 md:px-8 md:py-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex flex-col space-y-3 md:space-y-4 relative z-10">
        
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">GRE Logic Flashcards</h2>
          <p className="text-xs text-gray-400 font-medium mt-2">
            Content source: <a 
              href="https://docs.google.com/spreadsheets/d/1jQ3olVKMXJThLp7j_S8Fh6g4sAibD11-vHeMnBKIsFM/edit?gid=0#gid=0" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-gray-600 underline decoration-gray-300 transition-colors"
            >
              GregMat
            </a>
          </p>
        </div>

        <button 
          onClick={() => {
            ReactGA.event({ category: 'Quiz', action: 'deck_selected', label: 'Support vs Contrast' });
            onSelectMode('SupportContrast');
          }}
          className="w-full group bg-white/70 backdrop-blur-md p-4 md:p-6 rounded-3xl shadow-sm border border-white/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-left"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base md:text-xl text-gray-900">Support vs Contrast</h3>
            <span className="px-3 py-1 rounded-full bg-white text-xs font-bold text-gray-600 shadow-sm transition-colors">{supportCount}</span>
          </div>
        </button>

        <button 
          onClick={() => {
            ReactGA.event({ category: 'Quiz', action: 'deck_selected', label: 'Logic vs Negative' });
            onSelectMode('LogicNegative');
          }}
          className="w-full group bg-white/70 backdrop-blur-md p-4 md:p-6 rounded-3xl shadow-sm border border-white/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-left"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base md:text-xl text-gray-900">Logic vs Negative</h3>
            <span className="px-3 py-1 rounded-full bg-white text-xs font-bold text-gray-600 shadow-sm transition-colors">{logicCount}</span>
          </div>
        </button>

        <button 
          onClick={() => {
            ReactGA.event({ category: 'Quiz', action: 'deck_selected', label: 'Extreme Words' });
            onSelectMode('Extreme');
          }}
          className="w-full group bg-white/70 backdrop-blur-md p-4 md:p-6 rounded-3xl shadow-sm border border-white/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-left"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base md:text-xl text-gray-900">Extreme Words</h3>
            <span className="px-3 py-1 rounded-full bg-white text-xs font-bold text-gray-600 shadow-sm transition-colors">{extremeCount}</span>
          </div>
        </button>

        <button 
          onClick={() => {
            ReactGA.event({ category: 'Quiz', action: 'deck_selected', label: 'Previously Referenced' });
            onSelectMode('Reference');
          }}
          className="w-full group bg-white/70 backdrop-blur-md p-4 md:p-6 rounded-3xl shadow-sm border border-white/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-left"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base md:text-xl text-gray-900">Previously Referenced</h3>
            <span className="px-3 py-1 rounded-full bg-white text-xs font-bold text-gray-600 shadow-sm transition-colors">{referenceCount}</span>
          </div>
        </button>

        <div className="pt-4">
          <a 
            href="/Logic Support Contrast List.pdf" 
            download
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-4 py-2 rounded-full hover:bg-white/50 w-fit mx-auto"
          >
            <Download size={16} />
            Download Entire List
          </a>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-400 text-center">
        Compiled by{' '}
        <a
          href="https://www.linkedin.com/in/aryanashah/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-800 underline decoration-gray-300 transition-colors font-medium"
        >
          Aryan Shah
        </a>
      </p>
    </div>
  );
}

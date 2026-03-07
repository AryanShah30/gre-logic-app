import ReactGA from 'react-ga4';
import { wordList } from '../data/words';
import { Menu } from 'lucide-react';

interface ReferenceSelectorProps {
  onSelectMode: (mode: 'ReferencePronoun' | 'ReferenceOther' | 'ReferenceInSomeCases') => void;
  onBack: () => void;
}

export function ReferenceSelector({ onSelectMode, onBack }: ReferenceSelectorProps) {
  const pronounCount = wordList.filter(w => w.category === 'Reference' && w.subCategory === 'Pronouns').length;
  const otherCount = wordList.filter(w => w.category === 'Reference' && w.subCategory === 'Other words').length;
  const inSomeCasesCount = wordList.filter(w => w.category === 'Reference' && w.subCategory === 'In some cases').length;

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full px-4 py-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-white/40 backdrop-blur-2xl px-6 py-5 md:px-8 md:py-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex flex-col space-y-3 md:space-y-4 relative z-10">

        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-white/50 text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Back"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Previously Referenced</h2>
        </div>

        <button
          onClick={() => {
            ReactGA.event({ category: 'Quiz', action: 'deck_selected', label: 'Reference – Pronouns' });
            onSelectMode('ReferencePronoun');
          }}
          className="w-full group bg-white/70 backdrop-blur-md p-4 md:p-6 rounded-3xl shadow-sm border border-white/40 hover:bg-fuchsia-50/60 hover:border-fuchsia-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-left"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base md:text-xl text-gray-900">Pronouns</h3>
            <span className="px-3 py-1 rounded-full bg-fuchsia-50 text-fuchsia-600 text-xs font-bold shadow-sm border border-fuchsia-100">{pronounCount}</span>
          </div>
        </button>

        <button
          onClick={() => {
            ReactGA.event({ category: 'Quiz', action: 'deck_selected', label: 'Reference – Other Words' });
            onSelectMode('ReferenceOther');
          }}
          className="w-full group bg-white/70 backdrop-blur-md p-4 md:p-6 rounded-3xl shadow-sm border border-white/40 hover:bg-teal-50/60 hover:border-teal-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-left"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base md:text-xl text-gray-900">Other Words</h3>
            <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs font-bold shadow-sm border border-teal-100">{otherCount}</span>
          </div>
        </button>

        <button
          onClick={() => {
            ReactGA.event({ category: 'Quiz', action: 'deck_selected', label: 'Reference – In Some Cases' });
            onSelectMode('ReferenceInSomeCases');
          }}
          className="w-full group bg-white/70 backdrop-blur-md p-4 md:p-6 rounded-3xl shadow-sm border border-white/40 hover:bg-rose-50/60 hover:border-rose-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-left"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base md:text-xl text-gray-900">In Some Cases</h3>
            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold shadow-sm border border-rose-100">{inSomeCasesCount}</span>
          </div>
        </button>

      </div>
    </div>
  );
}

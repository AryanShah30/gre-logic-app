
import { WordItem } from '../data/words';
import { BookOpen, X } from 'lucide-react';

interface CardProps {
  word: WordItem;
  showExample: boolean;
  hideAnswer?: boolean;
  status?: 'correct' | 'incorrect';
  onShowExample?: () => void; 
  onHideExample?: () => void; 
  categoryPill?: string;       
  categoryCorrect?: boolean;
}

export function Card({ word, showExample, hideAnswer, status, onShowExample, onHideExample, categoryPill, categoryCorrect }: CardProps) {
  const getBgColor = () => {
    if (showExample) return 'bg-white/80';
    if (status === 'correct') return 'bg-emerald-500/10 border-emerald-500/20';
    if (status === 'incorrect') return 'bg-rose-500/10 border-rose-500/20';
    return 'bg-white/60 border-white/20';
  };

  const getTextColor = () => {
    if (showExample) return 'text-gray-900';
    if (status === 'correct') return 'text-emerald-900';
    if (status === 'incorrect') return 'text-rose-900';
    return 'text-gray-900';
  };

  const getTermSize = () => {
    const len = word.term.length;
    if (len > 18) return 'text-2xl md:text-3xl';
    if (len > 10) return 'text-3xl md:text-4xl';
    return 'text-4xl md:text-5xl';
  };

  const renderExample = (text: string) => {
    const parts = text.split(/\*\*(.+?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="font-bold text-gray-900 italic">{part}</strong> : part
    );
  };

  const pillColor = categoryCorrect === true
    ? 'bg-emerald-100/80 text-emerald-700 border-emerald-200/60'
    : categoryCorrect === false
      ? 'bg-rose-100/80 text-rose-700 border-rose-200/60'
      : 'bg-gray-100/80 text-gray-500 border-gray-200/60';

  return (
    <div className={`w-full max-w-md h-56 md:h-72 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border flex flex-col items-center justify-center p-5 md:p-8 text-center transition-all duration-500 relative ${getBgColor()}`}>
      
      {!showExample && onShowExample && word.example && (
        <button
          onClick={onShowExample}
          className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold text-gray-500 hover:text-gray-800 bg-white/80 hover:bg-white shadow-sm border border-gray-200/70 backdrop-blur-sm transition-all duration-200"
        >
          <BookOpen size={12} />
          Example
        </button>
      )}
      {showExample && onHideExample && (
        <button
          onClick={onHideExample}
          className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold text-gray-500 hover:text-gray-800 bg-white/80 hover:bg-white shadow-sm border border-gray-200/70 backdrop-blur-sm transition-all duration-200"
        >
          <X size={11} />
          Hide
        </button>
      )}

      {categoryPill && (
        <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-[12px] font-bold border shadow-sm ${pillColor}`}>
          {categoryPill}
        </div>
      )}

      {!showExample ? (
        <h2 className={`font-bold tracking-tight transition-colors duration-500 ${getTermSize()} ${getTextColor()}`}>{word.term}</h2>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-300 w-full">
          <div className="mb-4">
            {status === 'incorrect' && !hideAnswer && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600 mb-3">
                Incorrect
              </span>
            )}
            
            {word.category !== 'Extreme' && !hideAnswer && (
              <>
                <div className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">Correct Answer</div>
                <div className="text-xl font-bold text-gray-900">{word.category}</div>
              </>
            )}
          </div>
          {word.example && (
            <p className="text-base md:text-xl text-gray-600 font-serif italic leading-relaxed">"{renderExample(word.example)}"</p>
          )}
        </div>
      )}
    </div>
  );
}


import { WordItem } from '../data/words';
import { cn } from '../lib/utils';

interface CardProps {
  word: WordItem;
  showExample: boolean;
  status?: 'correct' | 'incorrect';
}

export function Card({ word, showExample, status }: CardProps) {
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

  const isFlashcardMode = word.category === 'Extreme' || word.category === 'Reference';

  return (
    <div className={`w-full max-w-md h-72 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border flex flex-col items-center justify-center p-8 text-center transition-all duration-500 ${getBgColor()}`}>
      {!showExample ? (
        <h2 className={`text-5xl font-bold tracking-tight transition-colors duration-500 ${getTextColor()}`}>{word.term}</h2>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-300 w-full">
          <div className="mb-6">
            {!isFlashcardMode && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600 mb-3">
                Incorrect
              </span>
            )}
            
            {!isFlashcardMode && (
              <div className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">Correct Answer</div>
            )}
            
            <div className="text-xl font-bold text-gray-900">{word.category}</div>
            
            {word.subCategory && (
              <div className="text-sm font-medium text-gray-500 mt-1">{word.subCategory}</div>
            )}
          </div>
          <p className="text-xl text-gray-600 font-serif italic leading-relaxed">"{word.example}"</p>
        </div>
      )}
    </div>
  );
}

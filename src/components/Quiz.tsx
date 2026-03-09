
import { useState, useEffect, useMemo } from 'react';
import { WordItem, wordList, Category } from '../data/words';
import { Card } from './Card';
import { ArrowRight, Menu, RotateCcw, BarChart2, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useWordStatus } from '../hooks/useWordStatus';
import ReactGA from 'react-ga4';

interface QuizProps {
  mode: 'SupportContrast' | 'LogicNegative' | 'Extreme' | 'ReferencePronoun' | 'ReferenceOther' | 'ReferenceInSomeCases';
  onExit: () => void;
}

interface SessionStats {
  correct: string[];
  incorrect: string[];
}

export function Quiz({ mode, onExit }: QuizProps) {
  const [queue, setQueue] = useState<WordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxReachedIndex, setMaxReachedIndex] = useState(0);
  const [showExample, setShowExample] = useState(false);
  const [showExampleOnly, setShowExampleOnly] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats>({ correct: [], incorrect: [] });
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  const { status, updateStatus, resetStatus } = useWordStatus();

  const filteredWords = useMemo(() => {
    if (mode === 'SupportContrast') {
      return wordList.filter(w => w.category === 'Support' || w.category === 'Contrast');
    } else if (mode === 'LogicNegative') {
      return wordList.filter(w => w.category === 'No Logic Change' || w.category === 'Negative');
    } else if (mode === 'Extreme') {
      return wordList.filter(w => w.category === 'Extreme');
    } else if (mode === 'ReferencePronoun') {
      return wordList.filter(w => w.category === 'Reference' && w.subCategory === 'Pronouns');
    } else if (mode === 'ReferenceOther') {
      return wordList.filter(w => w.category === 'Reference' && w.subCategory === 'Other words');
    } else if (mode === 'ReferenceInSomeCases') {
      return wordList.filter(w => w.category === 'Reference' && w.subCategory === 'In some cases');
    }
    return [];
  }, [mode]);

  useEffect(() => {
    const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setCurrentIndex(0);
    setMaxReachedIndex(0);
    setShowExample(false);
    setShowExampleOnly(false);
    setIsTransitioning(false);
    setShowStats(false);
    setShowComplete(false);
    setSessionStats({ correct: [], incorrect: [] });
    ReactGA.event({ category: 'Quiz', action: 'quiz_started', label: mode });
  }, [filteredWords]);

  const currentWord = queue[currentIndex];
  const isFlashcardMode = mode === 'Extreme' || mode === 'ReferencePronoun' || mode === 'ReferenceOther' || mode === 'ReferenceInSomeCases';
  const isFinished = (currentIndex >= queue.length && queue.length > 0) || showComplete;
  const isReviewing = currentIndex < maxReachedIndex && !showComplete;
  const sessionResult = currentWord
    ? sessionStats.correct.includes(currentWord.term)
      ? 'correct'
      : sessionStats.incorrect.includes(currentWord.term)
        ? 'incorrect'
        : null
    : null;

  useEffect(() => {
    if (isFinished) {
      ReactGA.event({
        category: 'Quiz',
        action: 'quiz_completed',
        label: mode,
        value: sessionStats.correct.length
      });
    }
  }, [isFinished, mode, sessionStats.correct.length]);

  const handleAnswer = (selectedCategory: Category) => {
    if (!currentWord || isTransitioning) return;

    const isCorrect = currentWord.category === selectedCategory;
    
    updateStatus(currentWord.term, isCorrect);

    setSessionStats(prev => ({
      ...prev,
      correct: isCorrect ? [...prev.correct, currentWord.term] : prev.correct,
      incorrect: !isCorrect ? [...prev.incorrect, currentWord.term] : prev.incorrect
    }));

    if (isCorrect) {
      setIsTransitioning(true);
      setTimeout(() => {
        nextCard();
        setIsTransitioning(false);
      }, 700);
    } else {
      setShowExample(true);
      setShowExampleOnly(false);
    }
  };

  const prevCard = () => {
    if (currentIndex <= 0) return;
    setCurrentIndex(prev => prev - 1);
    setShowExample(false);
    setShowExampleOnly(false);
    ReactGA.event({ category: 'Quiz', action: 'card_reviewed', label: mode });
  };

  const goForward = () => {
    if (currentIndex >= maxReachedIndex) return;
    const next = currentIndex + 1;
    if (next >= maxReachedIndex) {
      if (maxReachedIndex >= queue.length) {
        setShowComplete(true);
        setShowExample(false);
        setShowExampleOnly(false);
      } else {
        nextCard();
      }
      return;
    }
    setCurrentIndex(next);
    setShowExample(false);
    setShowExampleOnly(false);
  };

  const nextCard = () => {
    const next = currentIndex + 1;
    setCurrentIndex(next);
    if (next > maxReachedIndex) setMaxReachedIndex(next);
    setShowExample(false);
    setShowExampleOnly(false);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress for this deck? This will clear your correct/incorrect history.')) {
      ReactGA.event({ category: 'Quiz', action: 'quiz_reset', label: mode });
      const termsToReset = filteredWords.map(w => w.term);
      resetStatus(termsToReset);
      handleRestart();
    }
  };

  const handleRestart = (fromCompletion = false) => {
    if (fromCompletion) {
      ReactGA.event({ category: 'Quiz', action: 'quiz_restarted', label: mode });
    }
    const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setCurrentIndex(0);
    setMaxReachedIndex(0);
    setShowExample(false);
    setShowExampleOnly(false);
    setShowStats(false);
    setShowComplete(false);
    setSessionStats({ correct: [], incorrect: [] });
  };

  const statsData = useMemo(() => {
    const data: Record<string, { correct: string[]; incorrect: string[] }> = {};
    
    filteredWords.forEach(word => {
      const key = `${word.category} - ${word.subCategory || 'General'}`;
      if (!data[key]) data[key] = { correct: [], incorrect: [] };
    });

    sessionStats.correct.forEach(term => {
      const word = filteredWords.find(w => w.term === term);
      if (word) {
        const key = `${word.category} - ${word.subCategory || 'General'}`;
        if (data[key]) data[key].correct.push(term);
      }
    });

    sessionStats.incorrect.forEach(term => {
      const word = filteredWords.find(w => w.term === term);
      if (word) {
        const key = `${word.category} - ${word.subCategory || 'General'}`;
        if (data[key]) data[key].incorrect.push(term);
      }
    });

    return Object.entries(data)
      .filter(([_, stats]) => stats.correct.length > 0 || stats.incorrect.length > 0)
      .sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredWords, sessionStats]);

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const getProgressColor = (index: number) => {
    const colors = [
      'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 
      'bg-teal-500', 'bg-indigo-500', 'bg-cyan-500', 'bg-rose-500'
    ];
    return colors[index % colors.length];
  };

  if (isFinished) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center w-full overflow-hidden px-4 py-4">
      <div className="w-full max-w-md max-h-full bg-white/40 backdrop-blur-2xl px-6 py-5 md:px-8 md:py-6 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex flex-col space-y-4 text-center relative z-10 overflow-y-auto custom-scrollbar">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Session Complete!</h2>
        
        {!isFlashcardMode && (
          <div className="w-full bg-white/60 backdrop-blur-xl rounded-3xl p-5 shadow-sm border border-white/20">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <span className="text-3xl md:text-4xl font-bold text-emerald-600">{sessionStats.correct.length}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Correct</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl md:text-4xl font-bold text-rose-600">{sessionStats.incorrect.length}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Incorrect</span>
              </div>
            </div>
            
            <div className="space-y-3 text-left max-h-48 md:max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {statsData.map(([category, { correct, incorrect }]) => {
                const total = correct.length + incorrect.length;
                const isExpanded = expandedCategory === category;
                return (
                  <div key={category} className="flex flex-col gap-2 border-b border-gray-100 pb-2 last:border-0">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="flex flex-col gap-1 w-full text-left group"
                    >
                      <div className="flex justify-between text-sm font-medium items-center">
                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors flex items-center gap-1">
                          {category}
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </span>
                        <span className="text-gray-500 text-xs">{correct.length} / {total}</span>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="pl-2 border-l-2 border-gray-100 space-y-2 animate-in slide-in-from-top-2 duration-200">
                        {incorrect.length > 0 && (
                          <div>
                            <div className="text-xs font-bold text-rose-600 mb-1 uppercase tracking-wider">Incorrect</div>
                            <div className="flex flex-wrap gap-1">
                              {incorrect.map(term => (
                                <span key={term} className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-xs border border-rose-100">
                                  {term}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {correct.length > 0 && (
                          <div>
                            <div className="text-xs font-bold text-emerald-600 mb-1 uppercase tracking-wider">Correct</div>
                            <div className="flex flex-wrap gap-1">
                              {correct.map(term => (
                                <span key={term} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs border border-emerald-100">
                                  {term}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="w-full space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setShowComplete(false);
                setCurrentIndex(0);
                setShowExample(false);
                setShowExampleOnly(false);
                ReactGA.event({ category: 'Quiz', action: 'review_session_started', label: mode });
              }}
              className="h-12 md:h-14 rounded-2xl bg-white/70 text-gray-700 font-bold text-sm md:text-base hover:bg-white active:scale-95 transition-all border border-gray-200 flex items-center justify-center gap-1.5"
            >
              <ChevronLeft size={16} /> Review
            </button>

            <button 
              onClick={() => handleRestart(true)}
              className="h-12 md:h-14 rounded-2xl bg-gray-900 text-white font-bold text-sm md:text-base hover:bg-black active:scale-95 transition-all shadow-lg flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={16} /> Restart
            </button>
          </div>
          
          <button 
            onClick={onExit}
            className="w-full h-12 md:h-14 rounded-2xl bg-white text-gray-900 font-bold text-base md:text-lg hover:bg-gray-50 active:scale-95 transition-all border border-gray-200"
          >
            Back to Menu
          </button>
        </div>
      </div>
      </div>
    );
  }

  if (!currentWord) return <div className="p-8 text-center text-gray-400 font-medium">Loading deck...</div>;

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full px-4 py-3 overflow-hidden">
      <div className="w-full max-w-md bg-white/40 backdrop-blur-2xl p-5 md:p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex flex-col space-y-4 md:space-y-6 relative z-10">
      {showStats && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-white/90 backdrop-blur-md animate-in fade-in duration-200 rounded-[2.5rem]">
          <div className="w-full h-full bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-900">Session Log</h3>
              <button onClick={() => setShowStats(false)} className="p-2 -mr-2 rounded-full hover:bg-white/50 text-gray-400 hover:text-gray-900 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {statsData.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No answers yet this session.</p>
              ) : (
                statsData.map(([category, { correct, incorrect }], index) => {
                  const total = correct.length + incorrect.length;
                  const isExpanded = expandedCategory === category;
                  
                  return (
                    <div key={category} className="flex flex-col gap-2">
                      <button 
                        onClick={() => toggleCategory(category)}
                        className="flex flex-col gap-1 w-full text-left group"
                      >
                        <div className="flex justify-between text-sm font-medium items-center">
                          <span className="text-gray-700 group-hover:text-gray-900 transition-colors flex items-center gap-1">
                            {category}
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </span>
                          <span className="text-gray-500 text-xs">{correct.length} / {total}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${getProgressColor(index)}`}
                            style={{ width: `${(correct.length / total) * 100}%` }}
                          />
                        </div>
                      </button>
                      
                      {isExpanded && (
                        <div className="pl-2 border-l-2 border-gray-100 space-y-2 animate-in slide-in-from-top-2 duration-200">
                          {incorrect.length > 0 && (
                            <div>
                              <div className="text-xs font-bold text-rose-600 mb-1 uppercase tracking-wider">Incorrect</div>
                              <div className="flex flex-wrap gap-1">
                                {incorrect.map(term => (
                                  <span key={term} className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-xs border border-rose-100">
                                    {term}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {correct.length > 0 && (
                            <div>
                              <div className="text-xs font-bold text-emerald-600 mb-1 uppercase tracking-wider">Correct</div>
                              <div className="flex flex-wrap gap-1">
                                {correct.map(term => (
                                  <span key={term} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs border border-emerald-100">
                                    {term}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex justify-between items-center mb-4 md:mb-8">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => { ReactGA.event({ category: 'Quiz', action: 'quiz_exited_early', label: mode }); onExit(); }}
            className="p-2 -ml-2 rounded-full hover:bg-white/50 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <Menu size={20} />
          </button>
          <button
            onClick={prevCard}
            disabled={currentIndex === 0}
            className="p-2 rounded-full hover:bg-white/50 text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          {isReviewing && (
            <button
              onClick={goForward}
              title={maxReachedIndex >= queue.length && currentIndex === maxReachedIndex - 1 ? 'Back to results' : 'Forward'}
              className="p-2 rounded-full hover:bg-white/50 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {!isFlashcardMode && (
            <div className="flex items-center gap-3 px-3 py-1 bg-white/50 rounded-full border border-white/20">
               <span className="text-xs font-bold text-emerald-600">{sessionStats.correct.length}</span>
               <span className="text-xs font-bold text-rose-600">{sessionStats.incorrect.length}</span>
            </div>
          )}
          <div className="px-3 py-1 rounded-full bg-white/50 text-gray-500 font-medium text-xs tracking-wide">
            {currentIndex + 1} / {queue.length}
          </div>
          {!isFlashcardMode && (
            <button 
              onClick={() => { setShowStats(true); ReactGA.event({ category: 'Quiz', action: 'session_log_opened', label: mode }); }}
              className="p-2 -mr-2 rounded-full hover:bg-white/50 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <BarChart2 size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="w-full flex justify-center mb-4 md:mb-8">
        <Card 
          word={currentWord}
          showExample={showExample || showExampleOnly}
          hideAnswer={showExampleOnly}
          status={!isFlashcardMode ? status[currentWord.term] : undefined}
          onShowExample={!showExample && !showExampleOnly && currentWord.example
            ? () => { setShowExampleOnly(true); ReactGA.event({ category: 'Quiz', action: 'example_viewed', label: mode }); }
            : undefined
          }
          onHideExample={showExampleOnly ? () => setShowExampleOnly(false) : undefined}
          categoryPill={isReviewing && !isFlashcardMode && sessionResult !== null
            ? currentWord.category
            : undefined
          }
          categoryCorrect={sessionResult === 'correct' ? true : sessionResult === 'incorrect' ? false : undefined}
          subCategoryPill={undefined}
        />
      </div>

      <div className="w-full space-y-3">
        {isFlashcardMode ? (
          isReviewing ? (
            <div className="flex items-center justify-center gap-2 py-2">
              <span className="px-4 py-2 rounded-full bg-amber-50 border border-amber-200/70 text-amber-700 text-xs font-semibold">
                Reviewing past card
              </span>
            </div>
          ) : (
          <button 
            onClick={nextCard}
            className="w-full h-16 rounded-2xl bg-gray-900 text-white font-bold text-lg hover:bg-black active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            Next Word <ArrowRight size={20} />
          </button>
          )
        ) : isReviewing ? (
          <div className="flex items-center justify-center gap-2 py-2">
            <span className="px-4 py-2 rounded-full bg-amber-50 border border-amber-200/70 text-amber-700 text-xs font-semibold">
              Reviewing past card
            </span>
          </div>
        ) : (
          showExample ? (
            <button 
              onClick={nextCard}
              className="w-full h-16 rounded-2xl bg-gray-900 text-white font-bold text-lg hover:bg-black active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Next Word <ArrowRight size={20} />
            </button>
          ) : showExampleOnly ? (
            <div className="grid grid-cols-2 gap-3">
              {mode === 'SupportContrast' && (
                <>
                  <button 
                    onClick={() => handleAnswer('Support')}
                    disabled={isTransitioning}
                    className="h-16 rounded-2xl bg-emerald-500/10 text-emerald-700 font-bold text-lg hover:bg-emerald-500/20 active:scale-95 transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Support
                  </button>
                  <button 
                    onClick={() => handleAnswer('Contrast')}
                    disabled={isTransitioning}
                    className="h-16 rounded-2xl bg-rose-500/10 text-rose-700 font-bold text-lg hover:bg-rose-500/20 active:scale-95 transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Contrast
                  </button>
                </>
              )}
              {mode === 'LogicNegative' && (
                <>
                  <button 
                    onClick={() => handleAnswer('No Logic Change')}
                    disabled={isTransitioning}
                    className="h-16 rounded-2xl bg-blue-500/10 text-blue-700 font-bold text-sm md:text-lg hover:bg-blue-500/20 active:scale-95 transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    No Logic Change
                  </button>
                  <button 
                    onClick={() => handleAnswer('Negative')}
                    disabled={isTransitioning}
                    className="h-16 rounded-2xl bg-orange-500/10 text-orange-700 font-bold text-lg hover:bg-orange-500/20 active:scale-95 transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Negative (No)
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {mode === 'SupportContrast' && (
                <>
                  <button 
                    onClick={() => handleAnswer('Support')}
                    disabled={isTransitioning}
                    className="h-16 rounded-2xl bg-emerald-500/10 text-emerald-700 font-bold text-lg hover:bg-emerald-500/20 active:scale-95 transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Support
                  </button>
                  <button 
                    onClick={() => handleAnswer('Contrast')}
                    disabled={isTransitioning}
                    className="h-16 rounded-2xl bg-rose-500/10 text-rose-700 font-bold text-lg hover:bg-rose-500/20 active:scale-95 transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Contrast
                  </button>
                </>
              )}
              {mode === 'LogicNegative' && (
                <>
                  <button 
                    onClick={() => handleAnswer('No Logic Change')}
                    disabled={isTransitioning}
                    className="h-16 rounded-2xl bg-blue-500/10 text-blue-700 font-bold text-sm md:text-lg hover:bg-blue-500/20 active:scale-95 transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    No Logic Change
                  </button>
                  <button 
                    onClick={() => handleAnswer('Negative')}
                    disabled={isTransitioning}
                    className="h-16 rounded-2xl bg-orange-500/10 text-orange-700 font-bold text-lg hover:bg-orange-500/20 active:scale-95 transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Negative (No)
                  </button>
                </>
              )}
            </div>
          )
        )}
      </div>
      </div>
    </div>
  );
}

import { Analytics } from '@vercel/analytics/react';
import { useState, useEffect } from 'react';
import ReactGA from 'react-ga4';
import { DeckSelector } from './components/DeckSelector';
import { ReferenceSelector } from './components/ReferenceSelector';
import { Quiz } from './components/Quiz';

type QuizMode = 'SupportContrast' | 'LogicNegative' | 'Extreme' | 'ReferencePronoun' | 'ReferenceOther' | 'ReferenceInSomeCases';
type View = 'home' | 'referenceMenu' | 'quiz';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [quizMode, setQuizMode] = useState<QuizMode>('SupportContrast');

  useEffect(() => {
    ReactGA.initialize('G-8CK4LGJL6B');
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  const handleMainSelect = (mode: 'SupportContrast' | 'LogicNegative' | 'Extreme' | 'Reference') => {
    if (mode === 'Reference') {
      setView('referenceMenu');
    } else {
      setQuizMode(mode);
      setView('quiz');
    }
  };

  const handleReferenceSelect = (mode: 'ReferencePronoun' | 'ReferenceOther' | 'ReferenceInSomeCases') => {
    setQuizMode(mode);
    setView('quiz');
  };

  return (
    <div className="h-dvh overflow-hidden bg-gray-50 text-gray-900 font-sans selection:bg-gray-200 flex flex-col">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-gray-50 to-white -z-10" />
      
      {view === 'home' && (
        <div className="animate-entry flex-1 flex flex-col items-center justify-center">
          <DeckSelector 
            onSelectMode={handleMainSelect} 
          />
        </div>
      )}

      {view === 'referenceMenu' && (
        <div className="animate-entry flex-1 flex flex-col items-center justify-center">
          <ReferenceSelector
            onSelectMode={handleReferenceSelect}
            onBack={() => setView('home')}
          />
        </div>
      )}
      
      {view === 'quiz' && (
        <div className="animate-entry flex-1 flex flex-col items-center justify-center">
          <Quiz 
            mode={quizMode} 
            onExit={() => setView('home')} 
          />
        </div>
      )}
      <Analytics />
    </div>
  );
}


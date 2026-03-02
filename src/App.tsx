import { Analytics } from '@vercel/analytics/react';
import { useState, useEffect } from 'react';
import ReactGA from 'react-ga4';
import { DeckSelector } from './components/DeckSelector';
import { Quiz } from './components/Quiz';

type View = 'home' | 'quiz';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [quizMode, setQuizMode] = useState<'SupportContrast' | 'LogicNegative' | 'Extreme' | 'Reference'>('SupportContrast');

  useEffect(() => {
    ReactGA.initialize('G-8CK4LGJL6B');
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  const startQuiz = (mode: 'SupportContrast' | 'LogicNegative' | 'Extreme' | 'Reference') => {
    setQuizMode(mode);
    setView('quiz');
  };

  return (
    <div className="h-dvh overflow-hidden bg-gray-50 text-gray-900 font-sans selection:bg-gray-200 flex flex-col">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-gray-50 to-white -z-10" />
      
      {view === 'home' && (
        <DeckSelector 
          onSelectMode={startQuiz} 
        />
      )}
      
      {view === 'quiz' && (
        <Quiz 
          mode={quizMode} 
          onExit={() => setView('home')} 
        />
      )}
      <Analytics />
    </div>
  );
}

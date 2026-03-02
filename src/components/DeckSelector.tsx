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
      <div className="mt-4 flex items-center justify-center gap-4">
        {/* GitHub logo */}
        <a
          href="https://github.com/AryanShah30/gre-logic-app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-800 transition-colors"
          aria-label="GitHub"
        >
          <svg width="20" height="20" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/>
          </svg>
        </a>
        {/* LinkedIn logo */}
        <a
          href="https://www.linkedin.com/in/aryanashah/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-[#0A66C2] transition-colors"
          aria-label="LinkedIn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}

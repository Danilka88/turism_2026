import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Briefcase } from 'lucide-react';
import { LOCATIONS } from './data';
import {
  Landing,
  Onboarding,
  GroupFighterSelect,
  LoadingAgents,
  ResultsLayout,
  FinalRoute,
  BusinessDashboard,
} from './components';
import type { AppState } from './types';

function App() {
  const [state, setState] = useState<AppState>('landing');
  const [isBusinessMode, setIsBusinessMode] = useState(false);
  const [likedInterests, setLikedInterests] = useState<number[]>([]);

  const handleRouteSelectionComplete = () => {
    setState('final_route');
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={() => setIsBusinessMode(!isBusinessMode)}
          className="zelda-btn bg-white px-4 py-2 text-sm flex items-center gap-2 shadow-lg"
        >
          <Briefcase className="w-4 h-4" />
          <span className="hidden sm:inline">
            {isBusinessMode ? 'Выйти из Бизнес-режима' : 'Я — владелец бизнеса'}
          </span>
        </button>
      </div>

      {isBusinessMode ? (
        <BusinessDashboard />
      ) : (
        <AnimatePresence mode="wait">
          {state === 'landing' && (
            <Landing onStart={() => setState('onboarding')} />
          )}
          {state === 'onboarding' && (
            <Onboarding onComplete={(liked) => {
              setLikedInterests(liked);
              setState('profile');
            }} />
          )}
          {state === 'profile' && (
            <GroupFighterSelect onComplete={() => setState('loading')} />
          )}
          {state === 'loading' && (
            <LoadingAgents onComplete={() => setState('route_selection')} />
          )}
          {state === 'route_selection' && (
            <ResultsLayout 
              locations={LOCATIONS}
              likedInterests={likedInterests}
              onFinish={handleRouteSelectionComplete} 
            />
          )}
          {state === 'final_route' && (
            <FinalRoute locations={LOCATIONS} />
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export default App;

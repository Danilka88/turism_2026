import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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
  WineScanner,
} from './components';
import type { AppState, SelectedExtras, Location } from './types';

function App() {
  const [state, setState] = useState<AppState>('landing');
  const [isBusinessMode, setIsBusinessMode] = useState(false);
  const [likedInterests, setLikedInterests] = useState<number[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<SelectedExtras>({});
  const [acceptedLocations, setAcceptedLocations] = useState<Location[]>([]);

  const handleRouteSelectionComplete = (accepted: Location[], extras: SelectedExtras) => {
    setAcceptedLocations(accepted);
    setSelectedExtras(extras);
    setState('final_route');
  };

  const handleWineTourBuild = (locations: Location[]) => {
    setAcceptedLocations(locations);
    setSelectedExtras({});
    setState('final_route');
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed top-4 right-4 z-50">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsBusinessMode(!isBusinessMode)}
          className="glass-btn px-4 py-2.5 text-sm flex items-center gap-2 backdrop-blur-xl"
        >
          <Briefcase className="w-4 h-4" />
          <span className="hidden sm:inline text-white font-bold">
            {isBusinessMode ? 'Выйти' : 'Я — владелец'}
          </span>
        </motion.button>
      </div>

      {isBusinessMode ? (
        <BusinessDashboard />
      ) : (
        <AnimatePresence mode="wait">
          {state === 'landing' && (
            <Landing 
              onStart={() => setState('onboarding')} 
              onWineScan={() => setState('wine_scanner')}
            />
          )}
          {state === 'wine_scanner' && (
            <WineScanner 
              onBuildTour={handleWineTourBuild}
              onBack={() => setState('landing')}
            />
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
            <FinalRoute 
              locations={acceptedLocations} 
              selectedExtras={selectedExtras}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export default App;

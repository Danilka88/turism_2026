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
  BookingForm,
  EmergencyRoute,
} from './components';
import type { AppState, SelectedExtras, Location } from './types';

function App() {
  const [state, setState] = useState<AppState>('landing');
  const [isBusinessMode, setIsBusinessMode] = useState(false);
  const [likedInterests, setLikedInterests] = useState<number[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<SelectedExtras>({});
  const [acceptedLocations, setAcceptedLocations] = useState<Location[]>([]);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingLocation, setBookingLocation] = useState<string>('');

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

  const handleEmergencyRoute = (locations: Location[], problem: string) => {
    setAcceptedLocations(locations);
    setSelectedExtras({});
    setBookingLocation(problem);
    setState('final_route');
  };

  const openBooking = () => {
    const locationName = acceptedLocations.length > 0 
      ? acceptedLocations.map(l => l.title.split('"')[1] || l.title.split(' ')[0]).join(', ')
      : 'ваш маршрут';
    setBookingLocation(locationName);
    setShowBooking(true);
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
              onEmergency={() => setState('emergency_route')}
            />
          )}
          {state === 'wine_scanner' && (
            <WineScanner 
              onBuildTour={handleWineTourBuild}
              onBack={() => setState('landing')}
            />
          )}
          {state === 'emergency_route' && (
            <EmergencyRoute
              onBuildRoute={handleEmergencyRoute}
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
              onBook={openBooking}
            />
          )}
        </AnimatePresence>
      )}

      <BookingForm 
        isOpen={showBooking} 
        onClose={() => setShowBooking(false)}
        locationTitle={bookingLocation}
      />
    </div>
  );
}

export default App;

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Briefcase, FlaskConical } from 'lucide-react';
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
  MapExplorer,
  AgentTester,
} from './components';
import type { AppState, SelectedExtras, Location } from './types';
import type { MapLocation } from './data/mapData';
import { AIServiceProvider } from '../ollama-integration/AIServiceContext';

function App() {
  const [state, setState] = useState<AppState>('landing');
  const [isBusinessMode, setIsBusinessMode] = useState(false);
  const [showAgentTester, setShowAgentTester] = useState(false);
  const [likedInterests, setLikedInterests] = useState<number[]>([]);
  const [companions, setCompanions] = useState<string>('Компания друзей');
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

  const handleMapRoute = (mapLocations: MapLocation[]) => {
    const locations: Location[] = mapLocations.map((ml) => ({
      id: ml.id,
      title: ml.title,
      desc: ml.description,
      extendedDesc: ml.description,
      match: Math.round(ml.rating * 20),
      matchText: `Выбрано на карте`,
      tags: [ml.category],
      lat: ml.lat,
      lng: ml.lng,
      img: '/images/' + ((ml.id % 11) + 1) + '.jpg',
      videos: [],
      foodOptions: [
        { id: 'cafe', name: 'Кафе', icon: '☕', places: ['Популярные места'] },
      ],
      activities: [
        { id: 'explore', name: 'Исследовать', icon: '🔍', description: 'Осмотр места' },
      ],
    }));
    setAcceptedLocations(locations);
    setSelectedExtras({});
    setBookingLocation('маршрут по карте');
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
    <AIServiceProvider fallbackToDemo={true}>
      <div className="min-h-screen relative">
        {showAgentTester ? (
          <AgentTester onBack={() => setShowAgentTester(false)} />
        ) : (
          <>
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAgentTester(true)}
            className="glass-btn px-4 py-2.5 text-sm flex items-center gap-2 backdrop-blur-xl"
            title="Тест агентов"
          >
            <FlaskConical className="w-4 h-4" />
            <span className="hidden lg:inline text-white font-bold">Тест</span>
          </motion.button>
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
                onMapExplore={() => setState('map_explorer')}
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
            {state === 'map_explorer' && (
              <MapExplorer
                onBuildRoute={handleMapRoute}
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
              <GroupFighterSelect onComplete={(selected) => {
                setCompanions(selected);
                setState('loading');
              }} />
            )}
            {state === 'loading' && (
              <LoadingAgents 
                onComplete={() => setState('route_selection')}
                likedInterests={likedInterests}
                companions={companions}
              />
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
          </>
        )}
      </div>
    </AIServiceProvider>
  );
}

export default App;

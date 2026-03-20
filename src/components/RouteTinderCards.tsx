import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LocationCard } from './LocationCard';
import { Check } from 'lucide-react';
import type { Location, SelectedExtras } from '../types';

interface RouteTinderCardsProps {
  locations: Location[];
  likedInterests: number[];
  selectedExtras: SelectedExtras;
  onUpdateExtras: (extras: SelectedExtras) => void;
  onFinish: (accepted: Location[], extras: SelectedExtras) => void;
}

type Season = 'Весна' | 'Лето' | 'Осень' | 'Зима';
const SEASONS: Season[] = ['Весна', 'Лето', 'Осень', 'Зима'];

const SEASON_GRADIENTS: Record<Season, string> = {
  'Весна': 'from-pink-400 to-purple-400',
  'Лето': 'from-yellow-400 to-orange-400',
  'Осень': 'from-orange-400 to-red-400',
  'Зима': 'from-blue-400 to-cyan-400',
};

export function RouteTinderCards({ locations, likedInterests, selectedExtras, onUpdateExtras, onFinish }: RouteTinderCardsProps) {
  const [deck, setDeck] = useState<Location[]>(locations);
  const [accepted, setAccepted] = useState<Location[]>([]);
  const [season, setSeason] = useState<Season>('Лето');

  const MAX_SELECTION = 4;

  const handleAccept = (loc: Location) => {
    setAccepted(prev => [...prev, loc]);
    setDeck(prev => prev.filter(d => d.id !== loc.id));
  };

  const handleReject = (loc: Location) => {
    setDeck(prev => prev.filter(d => d.id !== loc.id));
  };

  const handleFinish = () => {
    onFinish(accepted, selectedExtras);
  };

  const isSelectionComplete = deck.length === 0 || accepted.length >= MAX_SELECTION;

  if (isSelectionComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md rounded-3xl bg-gradient-to-br from-purple-900/90 to-indigo-900/90 p-8 flex flex-col items-center gap-6 border border-white/20 shadow-2xl backdrop-blur-xl"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg border-4 border-white/30"
          >
            <Check className="w-12 h-12 text-white" strokeWidth={4} />
          </motion.div>
          <h2 className="text-3xl font-black text-white drop-shadow-lg">Места выбраны!</h2>
          <p className="font-bold text-white/90 text-lg">
            Мы собрали {accepted.length} идеальных локаций для вашей группы.
          </p>
          <button onClick={handleFinish} className="w-full py-4 px-8 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white text-xl font-bold rounded-2xl border-2 border-white/30 shadow-lg transition-all">
            🚀 Сформировать финальный маршрут
          </button>
        </motion.div>
      </div>
    );
  }

  const currentLoc = deck[0];

  return (
    <div className="flex flex-col h-full min-h-0 flex-1">
      <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar pb-2">
        {SEASONS.map(s => (
          <button 
            key={s} 
            onClick={() => setSeason(s)}
            className={`px-4 py-2 rounded-full border border-white/30 font-bold text-sm transition-all whitespace-nowrap backdrop-blur-md ${
              season === s 
                ? `bg-gradient-to-r ${SEASON_GRADIENTS[s]} text-white border-transparent shadow-lg` 
                : 'glass-chip'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {currentLoc && (
          <div key={currentLoc.id} className="flex-1 min-h-0">
            <LocationCard 
              location={currentLoc}
              likedInterests={likedInterests}
              selectedExtras={selectedExtras}
              onUpdateExtras={onUpdateExtras}
              onAccept={() => handleAccept(currentLoc)}
              onReject={() => handleReject(currentLoc)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

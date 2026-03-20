import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { LocationCard } from './LocationCard';
import { Check } from 'lucide-react';
import type { Location } from '../types';

interface RouteTinderCardsProps {
  locations: Location[];
  likedInterests: number[];
  onFinish: () => void;
}

type Season = 'Весна' | 'Лето' | 'Осень' | 'Зима';
const SEASONS: Season[] = ['Весна', 'Лето', 'Осень', 'Зима'];

export function RouteTinderCards({ locations, likedInterests, onFinish }: RouteTinderCardsProps) {
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

  const isSelectionComplete = deck.length === 0 || accepted.length >= MAX_SELECTION;

  if (isSelectionComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="diorama-card p-8 max-w-md w-full flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-zelda-green rounded-full flex items-center justify-center border-4 border-zelda-dark">
            <Check className="w-12 h-12 text-white" strokeWidth={4} />
          </div>
          <h2 className="text-2xl font-black">Места выбраны!</h2>
          <p className="font-bold text-gray-600">
            Мы собрали {accepted.length} идеальных локаций для вашей группы.
          </p>
          <button onClick={onFinish} className="zelda-btn w-full py-4 text-xl">
            Сформировать финальный маршрут
          </button>
        </div>
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
            className={`px-6 py-2 rounded-full border-[3px] border-zelda-dark font-black text-sm transition-colors whitespace-nowrap ${
              season === s 
                ? 'bg-zelda-gold shadow-[2px_2px_0px_#3a1952]' 
                : 'bg-white'
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
              onAccept={() => handleAccept(currentLoc)}
              onReject={() => handleReject(currentLoc)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

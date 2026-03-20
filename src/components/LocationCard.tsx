import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Heart, Maximize, Play, Users, Info } from 'lucide-react';
import { FIGHTERS } from '../data';
import type { Location } from '../types';

const TAG_ICONS: Record<string, string> = FIGHTERS.reduce((acc, f) => {
  acc[f.name] = f.icon;
  return acc;
}, {} as Record<string, string>);

const INTEREST_RESULTS: Record<number, string[]> = {
  1: ['вина', 'дегустации', 'виноградников'],
  2: ['горных прогулок', 'природы', 'эко-туризма'],
  3: ['фермерских продуктов', 'сыроварни', 'лошадей'],
  4: ['истории', 'дольменов', 'археологии'],
  5: ['экстрима', 'джиппинга', 'приключений'],
  6: ['пляжа', 'моря', 'спокойствия'],
  7: ['казачьей культуры', 'истории Кубани', 'станиц'],
  8: ['гастрономии', 'высокой кухни', 'локальной еды'],
};

const LOCATION_INTERESTS: Record<number, number[]> = {
  1: [1, 8],
  2: [3, 6],
  3: [6, 7],
  4: [2, 6],
  5: [1, 2],
  6: [1, 7],
  7: [4, 7],
  8: [2, 5],
};

function generateRecommendation(location: Location, likedInterests: number[]): string {
  const locationInterestIds = LOCATION_INTERESTS[location.id] || [];
  const matchedInterests = likedInterests.filter(id => locationInterestIds.includes(id));
  
  if (matchedInterests.length === 0) {
    return 'Отличное место для посещения!';
  }

  const keywords = matchedInterests.flatMap(id => INTEREST_RESULTS[id] || []);
  const uniqueKeywords = [...new Set(keywords)];
  
  if (uniqueKeywords.length === 0) {
    return 'Интересное место!';
  }
  
  const shortList = uniqueKeywords.slice(0, 2);
  return `Здесь вас ждут ${shortList.join(' и ')}!`;
}

interface LocationCardProps {
  location: Location;
  likedInterests: number[];
  onAccept: () => void;
  onReject: () => void;
}

function DetailsModal({ location, likedInterests, onClose }: { location: Location; likedInterests: number[]; onClose: () => void }) {
  const recommendation = generateRecommendation(location, likedInterests);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="diorama-card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img 
            src={location.img} 
            alt={location.title} 
            className="w-full h-48 sm:h-64 object-cover rounded-t-3xl" 
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 border-[3px] border-zelda-dark hover:bg-red-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-black">{location.title}</h2>
            <span className="bg-zelda-green text-white font-black px-3 py-1 rounded-full border-[3px] border-zelda-dark shrink-0">
              {location.match}% совпадение
            </span>
          </div>
          
          {recommendation && recommendation !== 'Отличное место для посещения!' && (
            <div className="bg-zelda-blue/10 p-3 rounded-xl border-[2px] border-zelda-blue">
              <p className="font-bold text-zelda-blue text-lg">💡 {recommendation}</p>
            </div>
          )}
          
          <p className="text-gray-700 leading-relaxed text-lg">{location.desc}</p>
          
          {location.extendedDesc && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="font-black text-sm mb-2 text-zelda-dark">📖 Подробнее:</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{location.extendedDesc}</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {location.tags.map((tag, i) => (
              <span 
                key={i}
                className="px-3 py-1.5 bg-zelda-purple/20 text-zelda-dark font-bold text-sm rounded-full border-2 border-zelda-purple/50 flex items-center gap-1.5"
              >
                <span className="text-base">{TAG_ICONS[tag] || '✨'}</span>
                {tag}
              </span>
            ))}
          </div>
          
          <div className="bg-zelda-yellow/30 p-4 rounded-xl border-[3px] border-zelda-dark">
            <p className="font-bold text-lg">✨ {location.matchText}</p>
          </div>
          
          {location.videos.length > 0 && (
            <div className="flex flex-col gap-2">
              <h4 className="font-black text-sm text-zelda-dark">🎬 Видео обзор:</h4>
              <div className="aspect-video bg-gray-800 rounded-xl border-[3px] border-zelda-dark overflow-hidden">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={location.videos[0]} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              </div>
            </div>
          )}
          
          <button onClick={onClose} className="zelda-btn py-3 text-lg mt-2">
            Закрыть
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function VirtualVisit({ location }: { location: Location }) {
  const [open, setOpen] = useState(false);
  
  if (!open) return (
    <button onClick={() => setOpen(true)} className="zelda-btn bg-zelda-blue text-white py-3 px-4 flex items-center gap-2 w-full justify-center">
      <Maximize className="w-5 h-5" /> 
      Виртуальный визит
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 bg-zelda-dark/95 p-4 flex flex-col items-center justify-center backdrop-blur-sm">
      <div className="diorama-card w-full max-w-3xl p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-2xl">Виртуальный визит: {location.title}</h3>
          <button onClick={() => setOpen(false)} className="bg-gray-200 rounded-full p-2 border-2 border-zelda-dark hover:bg-red-400 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="aspect-video bg-gray-800 rounded-2xl overflow-hidden border-[3px] border-zelda-dark relative flex items-center justify-center shadow-inner">
          <img src={location.img} className="w-full h-full object-cover opacity-60" alt="360" />
          <div className="absolute font-black text-white text-3xl flex flex-col items-center gap-4 drop-shadow-lg">
            <div className="bg-zelda-blue/80 p-4 rounded-full border-2 border-white backdrop-blur-md">
              <Play className="w-12 h-12 fill-current" />
            </div>
            360° Панорама
          </div>
        </div>
        <button className="zelda-btn bg-zelda-purple text-white py-4 text-xl flex items-center justify-center gap-3">
          <Users className="w-6 h-6" /> 
          Примерить на меня (ИИ Коллаж)
        </button>
      </div>
    </div>
  );
}

export function LocationCard({ location, likedInterests, onAccept, onReject }: LocationCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const recommendation = generateRecommendation(location, likedInterests);
  
  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="diorama-card flex flex-col flex-1 overflow-hidden"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        <div className="relative h-48 sm:h-64 shrink-0">
          <img src={location.img} alt={location.title} className="w-full h-full object-cover border-b-[3px] border-zelda-dark" />
          <div className="absolute top-4 right-4 bg-zelda-green text-white font-black px-4 py-2 rounded-full border-[3px] border-zelda-dark shadow-[4px_4px_0px_#3a1952] text-lg">
            {location.match}% совпадение
          </div>
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border-2 border-zelda-dark font-bold text-sm shadow-lg">
            {location.matchText}
          </div>
        </div>
        
        <div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 overflow-y-auto flex-1 min-h-0">
          <h3 className="text-xl sm:text-2xl font-black">{location.title}</h3>
          
          {recommendation && recommendation !== 'Отличное место для посещения!' && (
            <div className="bg-zelda-blue/10 p-2.5 rounded-xl border-[2px] border-zelda-blue">
              <p className="font-bold text-zelda-blue text-sm">💡 {recommendation}</p>
            </div>
          )}
          
          <p className="text-sm text-gray-600 leading-relaxed">{location.desc}</p>
          
          <div className="flex flex-wrap gap-2">
            {location.tags.map((tag, i) => (
              <span 
                key={i}
                className="px-2.5 py-1 bg-zelda-purple/20 text-zelda-dark font-bold text-xs rounded-full border border-zelda-purple/50 flex items-center gap-1"
              >
                <span>{TAG_ICONS[tag] || '✨'}</span>
                {tag}
              </span>
            ))}
          </div>
          
          <button 
            onClick={() => setShowDetails(true)}
            className="zelda-btn bg-zelda-yellow py-3 px-4 flex items-center gap-2 w-full justify-center"
          >
            <Info className="w-5 h-5" /> 
            Подробнее
          </button>

          <VirtualVisit location={location} />

          <div className="flex gap-4 mt-auto pt-4">
            <button onClick={onReject} className="flex-1 zelda-btn bg-white py-3 sm:py-4 flex items-center justify-center gap-2 text-red-500">
              <X className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} /> 
              Заменить
            </button>
            <button onClick={onAccept} className="flex-1 zelda-btn bg-zelda-green text-white py-3 sm:py-4 flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-current" /> 
              Принять
            </button>
          </div>
        </div>
      </motion.div>
      
      {showDetails && (
        <DetailsModal 
          location={location} 
          likedInterests={likedInterests}
          onClose={() => setShowDetails(false)} 
        />
      )}
    </>
  );
}

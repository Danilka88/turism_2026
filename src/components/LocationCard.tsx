import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Heart, Maximize, Play, Users, Info, Utensils, Gamepad2 } from 'lucide-react';
import { FIGHTERS } from '../data';
import type { Location, SelectedExtras } from '../types';

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
  
  let keywords: string[];
  
  if (matchedInterests.length > 0) {
    keywords = matchedInterests.flatMap(id => INTEREST_RESULTS[id] || []);
  } else {
    keywords = locationInterestIds.flatMap(id => INTEREST_RESULTS[id] || []);
  }
  
  const uniqueKeywords = [...new Set(keywords)];
  
  if (uniqueKeywords.length === 0) {
    return 'Отличное место для отдыха!';
  }
  
  const shortList = uniqueKeywords.slice(0, 2);
  return `💡 Здесь вас ждут ${shortList.join(' и ')}!`;
}

interface FoodModalProps {
  location: Location;
  selectedFood: string[];
  onToggleFood: (id: string) => void;
  onClose: () => void;
}

function FoodModal({ location, selectedFood, onToggleFood, onClose }: FoodModalProps) {
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
        className="diorama-card w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Utensils className="w-6 h-6" />
              Что можно поесть
            </h3>
            <button onClick={onClose} className="bg-gray-200 rounded-full p-1.5 border-2 border-zelda-dark hover:bg-red-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {location.foodOptions.map((food) => {
              const isSelected = selectedFood.includes(food.id);
              return (
                <div 
                  key={food.id}
                  onClick={() => onToggleFood(food.id)}
                  className={`p-3 rounded-xl border-[2px] cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-zelda-green/20 border-zelda-green' 
                      : 'bg-white border-zelda-dark/30 hover:border-zelda-dark'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{food.icon}</span>
                    <span className="font-black text-sm flex-1">{food.name}</span>
                    {isSelected && (
                      <div className="w-6 h-6 bg-zelda-green rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  {food.places && food.places.length > 0 && (
                    <div className="flex flex-wrap gap-1 ml-8">
                      {food.places.map((place, i) => (
                        <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                          {place}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <button onClick={onClose} className="zelda-btn py-3">
            Готово {selectedFood.length > 0 && `(${selectedFood.length} выбрано)`}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface ActivitiesModalProps {
  location: Location;
  selectedActivities: string[];
  onToggleActivity: (id: string) => void;
  onClose: () => void;
}

function ActivitiesModal({ location, selectedActivities, onToggleActivity, onClose }: ActivitiesModalProps) {
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
        className="diorama-card w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Gamepad2 className="w-6 h-6" />
              Чем заняться
            </h3>
            <button onClick={onClose} className="bg-gray-200 rounded-full p-1.5 border-2 border-zelda-dark hover:bg-red-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {location.activities.map((activity) => {
              const isSelected = selectedActivities.includes(activity.id);
              return (
                <div 
                  key={activity.id}
                  onClick={() => onToggleActivity(activity.id)}
                  className={`p-3 rounded-xl border-[2px] cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-zelda-blue/20 border-zelda-blue' 
                      : 'bg-white border-zelda-dark/30 hover:border-zelda-dark'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{activity.icon}</span>
                    <span className="font-black text-sm flex-1">{activity.name}</span>
                    {isSelected && (
                      <div className="w-6 h-6 bg-zelda-blue rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  {activity.description && (
                    <p className="text-xs text-gray-500 ml-8">{activity.description}</p>
                  )}
                </div>
              );
            })}
          </div>
          
          <button onClick={onClose} className="zelda-btn py-3">
            Готово {selectedActivities.length > 0 && `(${selectedActivities.length} выбрано)`}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface DetailsModalProps {
  location: Location;
  likedInterests: number[];
  onClose: () => void;
}

function DetailsModal({ location, likedInterests, onClose }: DetailsModalProps) {
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
          
          {recommendation && (
            <div className="bg-zelda-blue/10 p-3 rounded-xl border-[2px] border-zelda-blue">
              <p className="font-bold text-zelda-blue text-lg">{recommendation}</p>
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
    <button onClick={() => setOpen(true)} className="zelda-btn bg-zelda-blue text-white py-2 px-3 flex items-center gap-2 w-full justify-center text-sm">
      <Maximize className="w-4 h-4" /> 
      Виртуальный визит
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 bg-zelda-dark/95 p-4 flex flex-col items-center justify-center backdrop-blur-sm">
      <div className="diorama-card w-full max-w-3xl p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-xl">Виртуальный визит: {location.title}</h3>
          <button onClick={() => setOpen(false)} className="bg-gray-200 rounded-full p-2 border-2 border-zelda-dark hover:bg-red-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="aspect-video bg-gray-800 rounded-2xl overflow-hidden border-[3px] border-zelda-dark relative flex items-center justify-center shadow-inner">
          <img src={location.img} className="w-full h-full object-cover opacity-60" alt="360" />
          <div className="absolute font-black text-white text-2xl flex flex-col items-center gap-3 drop-shadow-lg">
            <div className="bg-zelda-blue/80 p-3 rounded-full border-2 border-white backdrop-blur-md">
              <Play className="w-10 h-10 fill-current" />
            </div>
            360° Панорама
          </div>
        </div>
        <button className="zelda-btn bg-zelda-purple text-white py-3 text-lg flex items-center justify-center gap-2">
          <Users className="w-5 h-5" /> 
          Позвонить для онлайн осмотра
        </button>
      </div>
    </div>
  );
}

interface LocationCardProps {
  location: Location;
  likedInterests: number[];
  selectedExtras: SelectedExtras;
  onUpdateExtras: (extras: SelectedExtras) => void;
  onAccept: () => void;
  onReject: () => void;
}

export function LocationCard({ location, likedInterests, selectedExtras, onUpdateExtras, onAccept, onReject }: LocationCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showFood, setShowFood] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  
  const recommendation = generateRecommendation(location, likedInterests);
  
  const extras = selectedExtras[location.id] || { food: [], activities: [] };
  
  const toggleFood = (id: string) => {
    const newFood = extras.food.includes(id)
      ? extras.food.filter(f => f !== id)
      : [...extras.food, id];
    onUpdateExtras({
      ...selectedExtras,
      [location.id]: { ...extras, food: newFood }
    });
  };
  
  const toggleActivity = (id: string) => {
    const newActivities = extras.activities.includes(id)
      ? extras.activities.filter(a => a !== id)
      : [...extras.activities, id];
    onUpdateExtras({
      ...selectedExtras,
      [location.id]: { ...extras, activities: newActivities }
    });
  };
  
  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="diorama-card flex flex-col flex-1 overflow-hidden"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        <div className="relative h-40 sm:h-48 shrink-0">
          <img src={location.img} alt={location.title} className="w-full h-full object-cover border-b-[3px] border-zelda-dark" />
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-zelda-green text-white font-black px-3 py-1 sm:px-4 sm:py-2 rounded-full border-[2px] sm:border-[3px] border-zelda-dark shadow-[4px_4px_0px_#3a1952] text-sm sm:text-lg">
            {location.match}%
          </div>
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white/90 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-2 rounded-xl border-2 border-zelda-dark font-bold text-xs sm:text-sm shadow-lg">
            {location.matchText}
          </div>
        </div>
        
        <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 overflow-y-auto flex-1 min-h-0">
          <h3 className="text-lg sm:text-xl font-black">{location.title}</h3>
          
          {recommendation && (
            <div className="bg-zelda-blue/10 p-2 sm:p-2.5 rounded-xl border-[2px] border-zelda-blue">
              <p className="font-bold text-zelda-blue text-xs sm:text-sm">{recommendation}</p>
            </div>
          )}
          
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{location.desc}</p>
          
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {location.tags.map((tag, i) => (
              <span 
                key={i}
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-zelda-purple/20 text-zelda-dark font-bold text-[10px] sm:text-xs rounded-full border border-zelda-purple/50 flex items-center gap-1"
              >
                <span className="text-sm">{TAG_ICONS[tag] || '✨'}</span>
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowFood(true)}
              className={`flex-1 zelda-btn py-2 px-2 flex items-center justify-center gap-1.5 text-xs sm:text-sm ${extras.food.length > 0 ? 'bg-zelda-green text-white' : 'bg-zelda-yellow'}`}
            >
              <Utensils className="w-4 h-4" /> 
              Еда {extras.food.length > 0 && `(${extras.food.length})`}
            </button>
            <button 
              onClick={() => setShowActivities(true)}
              className={`flex-1 zelda-btn py-2 px-2 flex items-center justify-center gap-1.5 text-xs sm:text-sm ${extras.activities.length > 0 ? 'bg-zelda-blue text-white' : 'bg-zelda-purple text-white'}`}
            >
              <Gamepad2 className="w-4 h-4" /> 
              Активности {extras.activities.length > 0 && `(${extras.activities.length})`}
            </button>
          </div>
          
          <button 
            onClick={() => setShowDetails(true)}
            className="zelda-btn bg-zelda-yellow py-2 px-3 flex items-center gap-2 w-full justify-center text-sm"
          >
            <Info className="w-4 h-4" /> 
            Подробнее
          </button>

          <VirtualVisit location={location} />

          <div className="flex gap-2 mt-auto pt-2">
            <button onClick={onReject} className="flex-1 zelda-btn bg-white py-2 sm:py-3 flex items-center justify-center gap-1.5 text-red-500 text-xs sm:text-sm">
              <X className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} /> 
              Заменить
            </button>
            <button onClick={onAccept} className="flex-1 zelda-btn bg-zelda-green text-white py-2 sm:py-3 flex items-center justify-center gap-1.5 text-xs sm:text-sm">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> 
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
      
      {showFood && (
        <FoodModal 
          location={location}
          selectedFood={extras.food}
          onToggleFood={toggleFood}
          onClose={() => setShowFood(false)}
        />
      )}
      
      {showActivities && (
        <ActivitiesModal 
          location={location}
          selectedActivities={extras.activities}
          onToggleActivity={toggleActivity}
          onClose={() => setShowActivities(false)}
        />
      )}
    </>
  );
}

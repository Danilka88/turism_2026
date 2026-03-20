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
      className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-modal w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black flex items-center gap-2 text-white">
              <Utensils className="w-6 h-6" />
              Что можно поесть
            </h3>
            <button onClick={onClose} className="glass-btn p-2 rounded-full">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {location.foodOptions.map((food) => {
              const isSelected = selectedFood.includes(food.id);
              return (
                <motion.div 
                  key={food.id}
                  onClick={() => onToggleFood(food.id)}
                  className={`glass-selectable p-4 cursor-pointer ${
                    isSelected ? 'glass-selectable-active' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{food.icon}</span>
                    <span className="font-black text-sm flex-1 text-white">{food.name}</span>
                    {isSelected && (
                      <div className="w-6 h-6 bg-glass-primary rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  {food.places && food.places.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 ml-12">
                      {food.places.map((place, i) => (
                        <span key={i} className="text-xs glass-chip py-1 px-2">
                          {place}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
          
          <button onClick={onClose} className="glass-btn glass-btn-primary py-3 font-bold">
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
      className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-modal w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black flex items-center gap-2 text-white">
              <Gamepad2 className="w-6 h-6" />
              Чем заняться
            </h3>
            <button onClick={onClose} className="glass-btn p-2 rounded-full">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {location.activities.map((activity) => {
              const isSelected = selectedActivities.includes(activity.id);
              return (
                <motion.div 
                  key={activity.id}
                  onClick={() => onToggleActivity(activity.id)}
                  className={`glass-selectable p-4 cursor-pointer ${
                    isSelected ? 'glass-selectable-active' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{activity.icon}</span>
                    <span className="font-black text-sm flex-1 text-white">{activity.name}</span>
                    {isSelected && (
                      <div className="w-6 h-6 bg-glass-primary rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  {activity.description && (
                    <p className="text-xs text-white/60 mt-2 ml-12">{activity.description}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
          
          <button onClick={onClose} className="glass-btn glass-btn-primary py-3 font-bold">
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
      className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img 
            src={location.img} 
            alt={location.title} 
            className="w-full h-48 sm:h-64 object-cover rounded-t-3xl" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-3xl" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 glass-btn p-2 rounded-full"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-black text-white">{location.title}</h2>
            <span className="glass-btn px-4 py-2 font-bold text-sm">
              {location.match}% совпадение
            </span>
          </div>
          
          {recommendation && (
            <div className="glass-selectable p-4 border-glass">
              <p className="font-bold text-white text-lg">{recommendation}</p>
            </div>
          )}
          
          <p className="text-white/90 leading-relaxed text-lg">{location.desc}</p>
          
          {location.extendedDesc && (
            <div className="glass-card-solid p-4">
              <h4 className="font-black text-sm mb-2 text-white/80">📖 Подробнее:</h4>
              <p className="text-white/70 text-sm leading-relaxed">{location.extendedDesc}</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {location.tags.map((tag, i) => (
              <span 
                key={i}
                className="glass-chip text-sm"
              >
                <span className="text-base mr-1">{TAG_ICONS[tag] || '✨'}</span>
                {tag}
              </span>
            ))}
          </div>
          
          <div className="glass-selectable p-4">
            <p className="font-bold text-lg text-white">✨ {location.matchText}</p>
          </div>
          
          {location.videos.length > 0 && (
            <div className="flex flex-col gap-2">
              <h4 className="font-black text-sm text-white/80">🎬 Видео обзор:</h4>
              <div className="aspect-video glass-card overflow-hidden">
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
          
          <button onClick={onClose} className="glass-btn glass-btn-primary py-3 text-lg mt-2 font-bold">
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
    <button onClick={() => setOpen(true)} className="glass-btn py-2.5 px-4 flex items-center gap-2 w-full justify-center text-sm font-bold">
      <Maximize className="w-4 h-4" /> 
      Виртуальный визит
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/90 p-4 flex flex-col items-center justify-center backdrop-blur-2xl">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-3xl rounded-3xl bg-gradient-to-br from-purple-900/95 to-indigo-900/95 p-6 flex flex-col gap-6 border border-white/20 shadow-2xl"
      >
        <div className="flex justify-between items-center">
          <h3 className="font-black text-xl text-white">Виртуальный визит: {location.title}</h3>
          <button onClick={() => setOpen(false)} className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-full border border-white/30 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="aspect-video rounded-2xl overflow-hidden relative flex items-center justify-center bg-black/30">
          <img src={location.img} className="w-full h-full object-cover opacity-50" alt="360" />
          <div className="absolute flex flex-col items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-full border-2 border-white/50 shadow-lg">
              <Play className="w-10 h-10 fill-current text-white" />
            </div>
            <span className="font-black text-xl text-white drop-shadow-lg bg-black/30 px-4 py-2 rounded-full">360° Панорама</span>
          </div>
        </div>
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-3 text-lg flex items-center justify-center gap-2 font-bold text-white rounded-2xl border border-white/30 shadow-lg transition-all">
          <Users className="w-5 h-5" /> 
          Позвонить для онлайн осмотра
        </button>
      </motion.div>
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
        className="w-full rounded-3xl overflow-hidden flex flex-col bg-gradient-to-br from-purple-900/95 to-indigo-900/95 border border-white/20 shadow-2xl"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        <div className="relative h-48 sm:h-56 shrink-0">
          <img src={location.img} alt={location.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 font-black text-lg sm:text-xl text-white rounded-xl border border-white/30 shadow-lg">
            {location.match}%
          </div>
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 text-base sm:text-lg font-bold text-white rounded-xl border border-white/20">
            {location.matchText}
          </div>
        </div>
        
        <div className="p-5 sm:p-6 flex flex-col gap-4 overflow-y-auto flex-1 min-h-0">
          <h3 className="text-xl sm:text-2xl font-black text-white">{location.title}</h3>
          
          {recommendation && (
            <div className="bg-white/15 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <p className="font-bold text-white text-base sm:text-lg">{recommendation}</p>
            </div>
          )}
          
          <p className="text-white/90 text-base sm:text-lg leading-relaxed">{location.desc}</p>
          
          <div className="flex flex-wrap gap-2">
            {location.tags.map((tag, i) => (
              <span 
                key={i}
                className="glass-chip text-sm"
              >
                <span className="text-base mr-1">{TAG_ICONS[tag] || '✨'}</span>
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setShowFood(true)}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 text-base sm:text-lg font-bold rounded-xl border border-white/30 transition-all ${extras.food.length > 0 ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-white/20 hover:bg-white/30 backdrop-blur-md'}`}
            >
              <Utensils className="w-5 h-5" /> 
              Еда {extras.food.length > 0 && `(${extras.food.length})`}
            </button>
            <button 
              onClick={() => setShowActivities(true)}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 text-base sm:text-lg font-bold rounded-xl border border-white/30 transition-all ${extras.activities.length > 0 ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-white/20 hover:bg-white/30 backdrop-blur-md'}`}
            >
              <Gamepad2 className="w-5 h-5" /> 
              Активности {extras.activities.length > 0 && `(${extras.activities.length})`}
            </button>
          </div>
          
          <button 
            onClick={() => setShowDetails(true)}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center gap-2 text-base sm:text-lg font-bold rounded-xl border border-white/30 shadow-lg"
          >
            <Info className="w-5 h-5" /> 
            Подробнее
          </button>

          <VirtualVisit location={location} />

          <div className="flex gap-3 mt-auto pt-2">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={onReject} 
              className="flex-1 py-4 flex items-center justify-center gap-2 text-red-400 bg-red-500/30 text-base sm:text-lg font-bold rounded-xl border border-red-400/30 backdrop-blur-md"
            >
              <X className="w-6 h-6" strokeWidth={3} /> 
              Заменить
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={onAccept} 
              className="flex-1 py-4 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-base sm:text-lg font-bold rounded-xl border border-white/30 shadow-lg"
            >
              <Heart className="w-6 h-6 fill-current" /> 
              Принять
            </motion.button>
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

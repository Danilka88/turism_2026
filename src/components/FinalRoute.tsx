import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarDays, Share2, Utensils, Gamepad2, X } from 'lucide-react';
import type { Location, SelectedExtras } from '../types';

interface FinalRouteProps {
  locations: Location[];
  selectedExtras: SelectedExtras;
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
      className="fixed inset-0 z-[60] bg-black/50 p-4 flex items-center justify-center backdrop-blur-md"
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
              Что можно поесть в {location.title}
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
      className="fixed inset-0 z-[60] bg-black/50 p-4 flex items-center justify-center backdrop-blur-md"
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
              Чем заняться в {location.title}
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

export function FinalRoute({ locations, selectedExtras }: FinalRouteProps) {
  const [localExtras, setLocalExtras] = useState<SelectedExtras>(selectedExtras);
  const [activeModal, setActiveModal] = useState<{ type: 'food' | 'activities'; locationId: number } | null>(null);

  const allExtras = { ...selectedExtras, ...localExtras };

  const getExtras = (locId: number) => allExtras[locId] || { food: [], activities: [] };

  const toggleFood = (locId: number, foodId: string) => {
    const extras = getExtras(locId);
    const newFood = extras.food.includes(foodId)
      ? extras.food.filter(f => f !== foodId)
      : [...extras.food, foodId];
    setLocalExtras(prev => ({
      ...prev,
      [locId]: { ...extras, food: newFood }
    }));
  };

  const toggleActivity = (locId: number, actId: string) => {
    const extras = getExtras(locId);
    const newActivities = extras.activities.includes(actId)
      ? extras.activities.filter(a => a !== actId)
      : [...extras.activities, actId];
    setLocalExtras(prev => ({
      ...prev,
      [locId]: { ...extras, activities: newActivities }
    }));
  };

  const activeLocation = activeModal ? locations.find(l => l.id === activeModal.locationId) : null;
  const activeExtras = activeLocation ? getExtras(activeLocation.id) : { food: [], activities: [] };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen p-4 sm:p-6 max-w-4xl mx-auto pb-28"
    >
      <motion.div 
        initial={{ scale: 0.95, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-hero p-6 sm:p-8 mb-6 sm:mb-12 text-center relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-glass-accent rounded-full opacity-30 blur-2xl animate-float"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-glass-cyan rounded-full opacity-20 blur-2xl animate-float" style={{ animationDelay: '-3s' }}></div>
        <h1 className="text-3xl sm:text-4xl font-black mb-2 text-white text-glass-shadow relative z-10">Ваш Идеальный Маршрут</h1>
        <p className="font-bold text-white/80 relative z-10 text-base sm:text-lg">
          {locations.length} мест • Выберите еду и активности
        </p>
      </motion.div>

      <div className="relative ml-4 sm:ml-8 md:ml-10 space-y-6 sm:space-y-10 pb-8">
        {locations.map((loc, i) => {
          const extras = getExtras(loc.id);
          const selectedFood = extras.food.map(id => 
            loc.foodOptions?.find(f => f.id === id)
          ).filter(Boolean);
          const selectedActivities = extras.activities.map(id => 
            loc.activities?.find(a => a.id === id)
          ).filter(Boolean);

          return (
            <motion.div 
              key={loc.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative flex items-start group"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="absolute -left-[22px] sm:-left-[26px] flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-card border-2 border-white/30 z-10 text-sm sm:text-base"
              >
                <span className="font-black text-white">{i + 1}</span>
              </motion.div>
              <div className="w-full pl-8 sm:pl-10">
                <div className="glass-card p-5 sm:p-6 hover:scale-[1.02] transition-transform">
                  <img 
                    src={loc.img} 
                    className="w-full h-48 sm:h-56 object-cover rounded-2xl mb-4 sm:mb-5" 
                    alt={loc.title} 
                  />
                  <h3 className="font-black text-xl sm:text-2xl mb-3 text-white">{loc.title}</h3>
                  <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-4">{loc.desc}</p>
                  
                  {selectedFood.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center gap-2 text-base font-bold text-white/90">
                        <Utensils className="w-4 h-4" />
                        Еда:
                      </div>
                      {selectedFood.map((food, idx) => food && (
                        <span key={idx} className="glass-chip text-sm">
                          {food.icon} {food.name}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {selectedActivities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center gap-2 text-base font-bold text-white/90">
                        <Gamepad2 className="w-4 h-4" />
                        Активности:
                      </div>
                      {selectedActivities.map((act, idx) => act && (
                        <span key={idx} className="glass-chip text-sm">
                          {act.icon} {act.name}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-3 mt-4">
                    <button 
                      onClick={() => setActiveModal({ type: 'food', locationId: loc.id })}
                      className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 text-base sm:text-lg font-bold rounded-xl border border-white/30 transition-all ${
                        extras.food.length > 0 ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-white/20 hover:bg-white/30 backdrop-blur-md'
                      }`}
                    >
                      <Utensils className="w-5 h-5" /> 
                      {extras.food.length > 0 ? `Еда (${extras.food.length})` : '+ Еда'}
                    </button>
                    <button 
                      onClick={() => setActiveModal({ type: 'activities', locationId: loc.id })}
                      className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 text-base sm:text-lg font-bold rounded-xl border border-white/30 transition-all ${
                        extras.activities.length > 0 ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-white/20 hover:bg-white/30 backdrop-blur-md'
                      }`}
                    >
                      <Gamepad2 className="w-5 h-5" /> 
                      {extras.activities.length > 0 ? `Активности (${extras.activities.length})` : '+ Активности'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {activeModal && activeLocation && (
          activeModal.type === 'food' ? (
            <FoodModal
              location={activeLocation}
              selectedFood={activeExtras.food}
              onToggleFood={(id) => toggleFood(activeLocation.id, id)}
              onClose={() => setActiveModal(null)}
            />
          ) : (
            <ActivitiesModal
              location={activeLocation}
              selectedActivities={activeExtras.activities}
              onToggleActivity={(id) => toggleActivity(activeLocation.id, id)}
              onClose={() => setActiveModal(null)}
            />
          )
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 z-50 flex justify-center"
      >
        <div className="w-full max-w-4xl mx-2 sm:mx-4 flex gap-2 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-purple-900/95 to-indigo-900/95 border border-white/20 shadow-2xl backdrop-blur-xl">
          <button className="flex-1 py-3 sm:py-4 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-base sm:text-lg font-bold rounded-xl border border-white/30 shadow-lg transition-all flex items-center justify-center gap-2">
            <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6" /> 
            Забронировать
          </button>
          <button className="flex-1 py-3 sm:py-4 px-4 bg-white/20 hover:bg-white/30 text-white text-base sm:text-lg font-bold rounded-xl border border-white/30 shadow-lg transition-all flex items-center justify-center gap-2 backdrop-blur-md">
            <Share2 className="w-5 h-5 sm:w-6 sm:h-6" /> 
            Поделиться
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

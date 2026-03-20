import { motion } from 'motion/react';
import { CalendarDays, Share2, Utensils, Gamepad2 } from 'lucide-react';
import type { Location, SelectedExtras } from '../types';

interface FinalRouteProps {
  locations: Location[];
  selectedExtras: SelectedExtras;
}

export function FinalRoute({ locations, selectedExtras }: FinalRouteProps) {
  const acceptedLocations = Object.keys(selectedExtras).map(Number);
  const acceptedPlaces = locations.filter(loc => acceptedLocations.includes(loc.id));

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen p-4 sm:p-6 max-w-4xl mx-auto pb-24"
    >
      <div className="diorama-card p-6 sm:p-8 mb-6 sm:mb-12 bg-zelda-blue text-white text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-zelda-yellow rounded-full opacity-30 blur-2xl"></div>
        <h1 className="text-3xl sm:text-4xl font-black mb-2 drop-shadow-md relative z-10">Ваш Идеальный Маршрут</h1>
        <p className="font-bold text-white/90 relative z-10 text-base sm:text-lg">
          {acceptedPlaces.length} мест • Всё выбрано
        </p>
      </div>

      <div className="relative border-l-4 border-zelda-dark ml-4 sm:ml-6 md:ml-8 space-y-6 sm:space-y-10 pb-8">
        {acceptedPlaces.map((loc, i) => {
          const extras = selectedExtras[loc.id] || { food: [], activities: [] };
          const selectedFood = extras.food.map(id => 
            loc.foodOptions.find(f => f.id === id)
          ).filter(Boolean);
          const selectedActivities = extras.activities.map(id => 
            loc.activities.find(a => a.id === id)
          ).filter(Boolean);

          return (
            <div key={loc.id} className="relative flex items-start group">
              <div className="absolute -left-[22px] sm:-left-[26px] flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[3px] sm:border-4 border-zelda-dark bg-zelda-gold text-zelda-dark font-black shadow-[2px_2px_0px_#3a1952] z-10 text-sm sm:text-base">
                {i + 1}
              </div>
              <div className="w-full pl-8 sm:pl-10">
                <div className="diorama-card p-3 sm:p-4 bg-white hover:-translate-y-1 transition-transform">
                  <img 
                    src={loc.img} 
                    className="w-full h-32 sm:h-48 object-cover rounded-lg border-2 border-zelda-dark mb-3 sm:mb-4" 
                    alt={loc.title} 
                  />
                  <h3 className="font-black text-lg sm:text-xl mb-1 sm:mb-2 text-zelda-dark">{loc.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">{loc.desc}</p>
                  
                  {selectedFood.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      <div className="flex items-center gap-1 text-xs font-bold text-zelda-green">
                        <Utensils className="w-3.5 h-3.5" />
                        Еда:
                      </div>
                      {selectedFood.map((food, idx) => food && (
                        <span key={idx} className="px-2 py-0.5 bg-zelda-green/10 text-zelda-green text-xs rounded-full border border-zelda-green/30">
                          {food.icon} {food.name}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {selectedActivities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-1 text-xs font-bold text-zelda-blue">
                        <Gamepad2 className="w-3.5 h-3.5" />
                        Активности:
                      </div>
                      {selectedActivities.map((act, idx) => act && (
                        <span key={idx} className="px-2 py-0.5 bg-zelda-blue/10 text-zelda-blue text-xs rounded-full border border-zelda-blue/30">
                          {act.icon} {act.name}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {selectedFood.length === 0 && selectedActivities.length === 0 && (
                    <p className="text-xs text-gray-400 italic">Выберите еду и активности в карточках</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 glass-panel m-2 sm:m-4 flex gap-2 sm:gap-4 z-50 max-w-4xl mx-auto rounded-2xl border-[2px] sm:border-[3px] border-zelda-dark shadow-[4px_4px_0px_#3a1952]">
        <button className="flex-1 zelda-btn bg-zelda-green text-white py-3 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-1.5 sm:gap-2">
          <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6" /> 
          Забронировать
        </button>
        <button className="flex-1 zelda-btn bg-white py-3 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-1.5 sm:gap-2 text-zelda-dark">
          <Share2 className="w-5 h-5 sm:w-6 sm:h-6" /> 
          Поделиться
        </button>
      </div>
    </motion.div>
  );
}

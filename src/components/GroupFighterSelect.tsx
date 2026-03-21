import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Baby, Check, Clock, Palmtree, Sun, CalendarDays, ChevronRight, ChevronLeft } from 'lucide-react';
import { FIGHTERS } from '../data';

interface GroupFighterSelectProps {
  onComplete: (companions: string) => void;
}

type Duration = 'day' | 'weekend' | '3days' | 'week';

const DURATIONS = [
  { id: 'day', name: 'На 1 день', icon: Sun, gradient: 'from-orange-400 to-yellow-400' },
  { id: 'weekend', name: 'На выходные', icon: Palmtree, gradient: 'from-green-400 to-emerald-400' },
  { id: '3days', name: 'На 3 дня', icon: Clock, gradient: 'from-blue-400 to-cyan-400' },
  { id: 'week', name: 'На неделю', icon: CalendarDays, gradient: 'from-purple-400 to-pink-400' },
];

const CITIES = [
  { id: 'krasnodar', name: 'Краснодар', icon: '🏙️' },
  { id: 'anapa', name: 'Анапа', icon: '🏖️' },
  { id: 'sochi', name: 'Сочи', icon: '🌊' },
  { id: 'gelendzhik', name: 'Геленджик', icon: '⛰️' },
  { id: 'novorossiysk', name: 'Новороссийск', icon: '⚓' },
  { id: 'tuapse', name: 'Туапсе', icon: '🛤️' },
  { id: 'armavir', name: 'Армавир', icon: '🏛️' },
  { id: 'kropotkin', name: 'Кропоткин', icon: '🌾' },
  { id: 'slavyansk', name: 'Славянск', icon: '🏘️' },
  { id: 'timahevsk', name: 'Тимашёвск', icon: '🌻' },
];

const FOOD_PREFERENCES = [
  { id: 'kazakh', name: 'Казачья', icon: '🥟' },
  { id: 'regional', name: 'Региональная', icon: '🍖' },
  { id: 'sushi', name: 'Суши/Роллы', icon: '🍣' },
  { id: 'pizza', name: 'Пицца', icon: '🍕' },
  { id: 'burger', name: 'Бургеры', icon: '🍔' },
  { id: 'bbq', name: 'Шашлыки', icon: '🍖' },
  { id: 'seafood', name: 'Морепродукты', icon: '🦐' },
  { id: 'caffe', name: 'Кофейни', icon: '☕' },
  { id: 'wine', name: 'Винодельни', icon: '🍷' },
  { id: 'fastfood', name: 'Фастфуд', icon: '🌯' },
  { id: 'dessert', name: 'Десерты', icon: '🍰' },
  { id: 'vegetarian', name: 'Вегетарианская', icon: '🥗' },
];

const STEPS = [
  { id: 1, name: 'Компания', icon: '👥' },
  { id: 2, name: 'Даты', icon: '📅' },
  { id: 3, name: 'Еда', icon: '🍽️' },
  { id: 4, name: 'Старт', icon: '📍' },
];

export function GroupFighterSelect({ onComplete }: GroupFighterSelectProps) {
  const [step, setStep] = useState(1);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(['me']);
  const [noKids, setNoKids] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState<Duration | null>(null);
  const [selectedFood, setSelectedFood] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  const toggleParticipant = (id: string) => {
    setSelectedParticipants(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleFood = (id: string) => {
    setSelectedFood(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleCity = (id: string) => {
    setSelectedCities(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const TOTAL_STEPS = 4;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="flex flex-col items-center justify-center min-h-screen p-4"
    >
      <div className="glass-hero p-4 sm:p-6 max-w-2xl lg:max-w-3xl w-full flex flex-col gap-4">
        <div className="text-center mb-1">
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider text-glass-shadow">
            Выбери свою компанию
          </h2>
        </div>

        <div className="flex justify-center gap-2 sm:gap-3 mb-2 overflow-x-auto hide-scrollbar pb-1">
          {STEPS.map((s) => (
            <motion.div 
              key={s.id}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full transition-all text-xs sm:text-sm whitespace-nowrap ${
                step === s.id 
                  ? 'glass-chip-active' 
                  : step > s.id 
                    ? 'glass-chip bg-glass-mint/50' 
                    : 'glass-chip opacity-60'
              }`}
            >
              <span>{s.icon}</span>
              <span className="font-bold">{s.name}</span>
            </motion.div>
          ))}
        </div>

        <div className="min-h-[280px] sm:min-h-[320px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex flex-col gap-4"
              >
                <p className="font-bold text-white/70 text-center text-sm">Кто едет с тобой?</p>
                
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3">
                  {FIGHTERS.map((fighter) => {
                    const isSelected = selectedParticipants.includes(fighter.id);
                    return (
                      <motion.button
                        key={fighter.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleParticipant(fighter.id)}
                        className={`glass-selectable p-2 sm:p-3 flex flex-col items-center justify-center gap-1 sm:gap-2 h-16 sm:h-20 relative ${
                          isSelected ? 'glass-selectable-active scale-105' : ''
                        }`}
                      >
                        <span className="text-2xl sm:text-3xl">{fighter.icon}</span>
                        <span className="font-bold text-center text-[10px] sm:text-xs leading-tight text-white">{fighter.name}</span>
                        {isSelected && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 bg-glass-primary rounded-full p-1 border-2 border-white/50"
                          >
                            <Check className="w-3 h-3 text-white" strokeWidth={4} />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <motion.div 
                  className="glass-selectable p-3 sm:p-4 cursor-pointer"
                  onClick={() => setNoKids(!noKids)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 font-bold text-sm text-white">
                      <Baby className="w-5 h-5 sm:w-6 sm:h-6" />
                      Без детей и стресса
                    </div>
                    <motion.div 
                      className={`w-12 h-6 rounded-full p-0.5 transition-colors ${noKids ? 'bg-glass-primary' : 'bg-white/30'}`}
                      animate={{ backgroundColor: noKids ? '#667eea' : 'rgba(255,255,255,0.3)' }}
                    >
                      <motion.div 
                        className="w-5 h-5 rounded-full bg-white shadow-md"
                        animate={{ x: noKids ? 24 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </motion.div>
                  </div>
                  <p className="text-xs text-white/60 font-medium mt-2">
                    Места с аниматорами и детскими комнатами
                  </p>
                </motion.div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="flex flex-col gap-4"
              >
                <p className="font-bold text-white/70 text-center text-sm">Длительность путешествия</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {DURATIONS.map((dur) => {
                    const isSelected = duration === dur.id;
                    const Icon = dur.icon;
                    return (
                      <motion.button
                        key={dur.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setDuration(duration === dur.id ? null : dur.id as Duration)}
                        className={`glass-selectable p-3 sm:p-4 font-bold text-base sm:text-lg flex flex-col items-center gap-2 ${
                          isSelected ? 'glass-selectable-active' : ''
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${dur.gradient} flex items-center justify-center ${isSelected ? 'ring-2 ring-white/50' : ''}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-white font-bold text-base">{dur.name}</span>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-2 sm:gap-3">
                  <label className="font-bold flex items-center gap-2 text-base text-white">
                    <Calendar className="w-5 h-5 text-white"/> Дата старта
                  </label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="glass-input text-base" 
                  />
                  {duration && (
                    <p className="text-xs text-white/60 font-medium">
                      Завершение: {startDate || 'укажите дату'} + {duration === 'day' ? '1 день' : duration === 'weekend' ? '2 дня' : duration === '3days' ? '3 дня' : '7 дней'}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="flex flex-col gap-3"
              >
                <p className="font-bold text-white/70 text-center text-sm">Что хочешь поесть?</p>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 max-h-[250px] sm:max-h-[280px] overflow-y-auto pr-1">
                  {FOOD_PREFERENCES.map((food) => {
                    const isSelected = selectedFood.includes(food.id);
                    return (
                      <motion.button
                        key={food.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleFood(food.id)}
                        className={`glass-selectable p-2 sm:p-3 flex flex-col items-center justify-center gap-1 sm:gap-2 h-16 sm:h-20 relative ${
                          isSelected ? 'glass-selectable-active' : ''
                        }`}
                      >
                        <span className="text-2xl sm:text-3xl">{food.icon}</span>
                        <span className="font-bold text-center text-[10px] sm:text-xs leading-tight text-white">{food.name}</span>
                        {isSelected && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 bg-glass-primary rounded-full p-1 border-2 border-white/50"
                          >
                            <Check className="w-3 h-3 text-white" strokeWidth={4} />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
                
                {selectedFood.length === 0 && (
                  <p className="text-xs text-white/60 font-medium text-center">
                    Выбери что-нибудь вкусненькое!
                  </p>
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="flex flex-col gap-3"
              >
                <p className="font-bold text-white/70 text-center text-sm">Откуда стартуем?</p>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                  {CITIES.map((city) => {
                    const isSelected = selectedCities.includes(city.id);
                    return (
                      <motion.button
                        key={city.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleCity(city.id)}
                        className={`glass-selectable p-2 sm:p-3 flex flex-col items-center justify-center gap-1 sm:gap-2 h-16 sm:h-20 relative ${
                          isSelected ? 'glass-selectable-active' : ''
                        }`}
                      >
                        <span className="text-2xl sm:text-3xl">{city.icon}</span>
                        <span className="font-bold text-center text-[10px] sm:text-xs leading-tight text-white">{city.name}</span>
                        {isSelected && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 bg-glass-primary rounded-full p-1 border-2 border-white/50"
                          >
                            <Check className="w-3 h-3 text-white" strokeWidth={4} />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
                
                {selectedCities.length === 0 && (
                  <p className="text-xs text-white/60 font-medium text-center">
                    Будем исследовать весь Краснодарский край!
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-3 mt-4">
          {step > 1 && (
            <button 
              onClick={() => setStep(s => s - 1)}
              className="glass-btn py-3 px-4 sm:px-6 flex items-center gap-2 text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Назад
            </button>
          )}
          <button 
            onClick={() => {
              if (step < TOTAL_STEPS) {
                setStep(s => s + 1);
              } else {
                const companionsText = selectedParticipants
                  .map(id => FIGHTERS.find(f => f.id === id)?.name || id)
                  .join(', ');
                onComplete(companionsText || 'Один');
              }
            }}
            className="glass-btn glass-btn-primary flex-1 py-3 sm:py-4 flex items-center justify-center gap-2 text-sm sm:text-base font-bold"
          >
            {step < TOTAL_STEPS ? (
              <>
                Далее
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              '🚀 Искать сокровища'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

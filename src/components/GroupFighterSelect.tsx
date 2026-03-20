import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Baby, Check, Clock, Palmtree, Sun, CalendarDays, ChevronRight, ChevronLeft } from 'lucide-react';
import { FIGHTERS } from '../data';

interface GroupFighterSelectProps {
  onComplete: () => void;
}

type Duration = 'day' | 'weekend' | '3days' | 'week';

const DURATIONS = [
  { id: 'day', name: 'На 1 день', icon: Sun, color: 'bg-orange-400' },
  { id: 'weekend', name: 'На выходные', icon: Palmtree, color: 'bg-green-400' },
  { id: '3days', name: 'На 3 дня', icon: Clock, color: 'bg-blue-400' },
  { id: 'week', name: 'На неделю', icon: CalendarDays, color: 'bg-purple-400' },
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

const STEPS = [
  { id: 1, name: 'Компания', icon: '👥' },
  { id: 2, name: 'Даты', icon: '📅' },
  { id: 3, name: 'Старт', icon: '📍' },
];

export function GroupFighterSelect({ onComplete }: GroupFighterSelectProps) {
  const [step, setStep] = useState(1);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(['me']);
  const [noKids, setNoKids] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState<Duration | null>(null);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  const toggleParticipant = (id: string) => {
    setSelectedParticipants(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleCity = (id: string) => {
    setSelectedCities(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="flex flex-col items-center justify-center min-h-screen p-4"
    >
      <div className="diorama-card p-4 sm:p-6 max-w-2xl lg:max-w-3xl w-full flex flex-col gap-3">
        <div className="text-center mb-1">
          <h2 className="text-xl sm:text-2xl font-black text-zelda-dark uppercase tracking-wider">
            ВЫБЕРИ СВОЮ КОМПАНИЮ
          </h2>
        </div>

        <div className="flex justify-center gap-2 mb-2">
          {STEPS.map((s) => (
            <div 
              key={s.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-[2px] transition-all text-xs sm:text-sm ${
                step === s.id 
                  ? 'bg-zelda-green text-white border-zelda-dark' 
                  : step > s.id 
                    ? 'bg-zelda-gold text-zelda-dark border-zelda-dark' 
                    : 'bg-white text-gray-400 border-zelda-dark/30'
              }`}
            >
              <span>{s.icon}</span>
              <span className="font-black">{s.name}</span>
            </div>
          ))}
        </div>

        <div className="min-h-[320px] sm:min-h-[360px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex flex-col gap-3"
              >
                <p className="font-bold text-gray-500 text-center text-sm">Кто едет с тобой?</p>
                
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {FIGHTERS.map((fighter) => {
                    const isSelected = selectedParticipants.includes(fighter.id);
                    return (
                      <motion.button
                        key={fighter.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleParticipant(fighter.id)}
                        className={`fighter-card p-2 flex flex-col items-center justify-center gap-1 h-16 sm:h-18 relative ${isSelected ? 'selected' : ''}`}
                      >
                        <span className="text-xl sm:text-2xl">{fighter.icon}</span>
                        <span className="font-bold text-center text-[9px] sm:text-[10px] leading-tight">{fighter.name}</span>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 bg-zelda-green text-white rounded-full p-0.5 border border-zelda-dark">
                            <Check className="w-2.5 h-2.5" strokeWidth={4} />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <div 
                  className="p-2.5 bg-zelda-purple/20 rounded-xl border-[2px] border-zelda-dark cursor-pointer" 
                  onClick={() => setNoKids(!noKids)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Baby className="w-4 h-4 text-zelda-dark" />
                      Без детей и стресса
                    </div>
                    <div className={`w-10 h-5 rounded-full border-[2px] border-zelda-dark p-0.5 transition-colors ${noKids ? 'bg-zelda-green' : 'bg-white'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full bg-zelda-dark transition-transform ${noKids ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 font-medium pl-6">
                    Подберём места с аниматорами, детскими комнатами и активностями
                  </p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="flex flex-col gap-3"
              >
                <p className="font-bold text-gray-500 text-center text-sm">Длительность путешествия</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DURATIONS.map((dur) => {
                    const isSelected = duration === dur.id;
                    const Icon = dur.icon;
                    return (
                      <motion.button
                        key={dur.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setDuration(duration === dur.id ? null : dur.id as Duration)}
                        className={`p-3 rounded-xl border-[2px] font-black text-xs sm:text-sm flex flex-col items-center gap-1 transition-all ${
                          isSelected 
                            ? `${dur.color} text-white border-zelda-dark shadow-[3px_3px_0px_#3a1952]` 
                            : 'bg-white border-zelda-dark'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? '' : 'text-zelda-dark'}`} />
                        {dur.name}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-2 mt-1">
                  <label className="font-bold flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4"/> Дата старта
                  </label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2.5 rounded-xl border-[2px] border-zelda-dark outline-none bg-white font-bold" 
                  />
                  {duration && (
                    <p className="text-xs text-gray-500 font-medium">
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
                <p className="font-bold text-gray-500 text-center text-sm">Откуда стартуем?</p>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {CITIES.map((city) => {
                    const isSelected = selectedCities.includes(city.id);
                    return (
                      <motion.button
                        key={city.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleCity(city.id)}
                        className={`fighter-card p-2 flex flex-col items-center justify-center gap-1 h-16 sm:h-18 relative ${
                          isSelected ? 'selected' : ''
                        }`}
                      >
                        <span className="text-xl sm:text-2xl">{city.icon}</span>
                        <span className="font-bold text-center text-[9px] sm:text-[10px] leading-tight">{city.name}</span>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 bg-zelda-green text-white rounded-full p-0.5 border border-zelda-dark">
                            <Check className="w-2.5 h-2.5" strokeWidth={4} />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
                
                {selectedCities.length === 0 && (
                  <p className="text-xs text-gray-500 font-medium text-center">
                    Будем исследовать весь Краснодарский край!
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-2 mt-2">
          {step > 1 && (
            <button 
              onClick={() => setStep(s => s - 1)}
              className="zelda-btn bg-white py-3 px-4 flex items-center gap-2 text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Назад
            </button>
          )}
          <button 
            onClick={() => step < 3 ? setStep(s => s + 1) : onComplete()}
            className="zelda-btn flex-1 py-3 flex items-center justify-center gap-2"
          >
            {step < 3 ? (
              <>
                Далее
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              'Искать сокровища'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

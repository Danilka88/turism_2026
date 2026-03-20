import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Baby, Check, Clock, Palmtree, Sun, CalendarDays } from 'lucide-react';
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
  { id: 'slavyansk', name: 'Славянск-на-Кубани', icon: '🏘️' },
  { id: 'timahevsk', name: 'Тимашёвск', icon: '🌻' },
  { id: 'crimea', name: 'Крым', icon: '🏝️' },
  { id: 'abkhazia', name: 'Абхазия', icon: '🏔️' },
];

export function GroupFighterSelect({ onComplete }: GroupFighterSelectProps) {
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
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 overflow-y-auto"
    >
      <div className="diorama-card p-4 sm:p-6 max-w-3xl w-full flex flex-col gap-5">
        <div className="text-center mb-2">
          <h2 className="text-2xl sm:text-3xl font-black text-zelda-dark uppercase tracking-wider">ВЫБЕРИ СВОЮ КОМПАНИЮ</h2>
          <p className="font-bold text-gray-500 mt-1">Кто едет с тобой?</p>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
          {FIGHTERS.map((fighter) => {
            const isSelected = selectedParticipants.includes(fighter.id);
            return (
              <motion.div 
                key={fighter.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleParticipant(fighter.id)}
                className={`fighter-card p-2 sm:p-3 flex flex-col items-center justify-center gap-1 h-20 sm:h-24 relative ${isSelected ? 'selected' : ''}`}
              >
                <span className="text-2xl sm:text-3xl">{fighter.icon}</span>
                <span className="font-bold text-center text-[10px] sm:text-xs leading-tight">{fighter.name}</span>
                {isSelected && (
                  <div className="absolute -top-1 -right-1 bg-zelda-green text-white rounded-full p-0.5 border border-zelda-dark">
                    <Check className="w-3 h-3" strokeWidth={4} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="border-t-2 border-zelda-dark/20 pt-4">
          <p className="font-black text-lg mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Длительность путешествия
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {DURATIONS.map((dur) => {
              const isSelected = duration === dur.id;
              const Icon = dur.icon;
              return (
                <motion.button
                  key={dur.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDuration(duration === dur.id ? null : dur.id as Duration)}
                  className={`p-3 rounded-xl border-[3px] font-black text-sm flex flex-col items-center gap-2 transition-all ${
                    isSelected 
                      ? `${dur.color} text-white border-zelda-dark shadow-[4px_4px_0px_#3a1952]` 
                      : 'bg-white border-zelda-dark'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isSelected ? '' : 'text-zelda-dark'}`} />
                  {dur.name}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="border-t-2 border-zelda-dark/20 pt-4">
          <p className="font-black text-lg mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Даты поездки
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Дата старта</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-3 rounded-xl border-[3px] border-zelda-dark outline-none bg-white font-bold" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm text-gray-500">Дата завершения</label>
              <div className="p-3 rounded-xl border-[3px] border-zelda-dark/50 bg-gray-100 font-bold text-gray-400 flex items-center">
                Автоматически
              </div>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-zelda-dark/20 pt-4">
          <p className="font-black text-lg mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5" /> Точка старта
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {CITIES.map((city) => {
              const isSelected = selectedCities.includes(city.id);
              return (
                <motion.button
                  key={city.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleCity(city.id)}
                  className={`p-3 rounded-xl border-[3px] font-bold text-sm flex items-center gap-2 transition-all ${
                    isSelected 
                      ? 'bg-zelda-blue text-white border-zelda-dark shadow-[4px_4px_0px_#3a1952]' 
                      : 'bg-white border-zelda-dark/50 hover:border-zelda-dark'
                  }`}
                >
                  <span className="text-lg">{city.icon}</span>
                  <span className="text-left flex-1">{city.name}</span>
                  {isSelected && <Check className="w-4 h-4" strokeWidth={4} />}
                </motion.button>
              );
            })}
          </div>
          {selectedCities.length === 0 && (
            <p className="text-sm text-gray-500 mt-2 font-medium">
              Выбран весь Краснодарский край
            </p>
          )}
        </div>

        <div 
          className="p-4 bg-zelda-purple/20 rounded-xl border-[3px] border-zelda-dark flex items-center justify-between cursor-pointer" 
          onClick={() => setNoKids(!noKids)}
        >
          <div className="flex items-center gap-3 font-bold text-base sm:text-lg">
            <Baby className="w-6 h-6 text-zelda-dark" />
            Без детей и стресса
          </div>
          <div className={`w-14 h-8 rounded-full border-[3px] border-zelda-dark p-0.5 transition-colors ${noKids ? 'bg-zelda-green' : 'bg-white'}`}>
            <div className={`w-5 h-5 rounded-full bg-zelda-dark transition-transform ${noKids ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </div>

        <button onClick={onComplete} className="zelda-btn py-4 text-xl mt-2">
          Искать сокровища
        </button>
      </div>
    </motion.div>
  );
}

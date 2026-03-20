import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Baby, Plus, Check } from 'lucide-react';
import { FIGHTERS } from '../data';

interface GroupFighterSelectProps {
  onComplete: () => void;
}

export function GroupFighterSelect({ onComplete }: GroupFighterSelectProps) {
  const [selected, setSelected] = useState<string[]>(['me']);
  const [noKids, setNoKids] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [location, setLocation] = useState('Весь край');

  const toggleFighter = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleInvite = () => {
    alert('Функция приглашения участников скоро будет доступна!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="flex flex-col items-center justify-center min-h-screen p-6"
    >
      <div className="diorama-card p-6 max-w-2xl w-full flex flex-col gap-6">
        <div className="text-center mb-2">
          <h2 className="text-3xl font-black text-zelda-dark uppercase tracking-wider">ВЫБЕРИ СВОЮ КОМПАНИЮ</h2>
          <p className="font-bold text-gray-500 mt-1">Кто едет с тобой?</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {FIGHTERS.map((fighter) => {
            const isSelected = selected.includes(fighter.id);
            return (
              <motion.div 
                key={fighter.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleFighter(fighter.id)}
                className={`fighter-card p-4 flex flex-col items-center justify-center gap-2 h-32 relative ${isSelected ? 'selected' : ''}`}
              >
                <span className="text-4xl">{fighter.icon}</span>
                <span className="font-bold text-center text-sm leading-tight">{fighter.name}</span>
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-zelda-green text-white rounded-full p-1 border-2 border-zelda-dark">
                    <Check className="w-4 h-4" strokeWidth={4} />
                  </div>
                )}
              </motion.div>
            );
          })}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fighter-card p-4 flex flex-col items-center justify-center gap-2 h-32 border-dashed bg-white filter-none"
            onClick={handleInvite}
          >
            <div className="w-10 h-10 rounded-full bg-zelda-blue text-white flex items-center justify-center border-2 border-zelda-dark">
              <Plus className="w-6 h-6" strokeWidth={3} />
            </div>
            <span className="font-bold text-center text-sm text-zelda-blue">Пригласить<br/>участника</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <label className="font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5"/> Дата старта
            </label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-3 rounded-xl border-[3px] border-zelda-dark outline-none bg-white font-bold" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5"/> Старт
            </label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Весь край" 
              className="p-3 rounded-xl border-[3px] border-zelda-dark outline-none bg-white font-bold" 
            />
          </div>
        </div>

        <div 
          className="p-4 bg-zelda-purple/20 rounded-xl border-[3px] border-zelda-dark flex items-center justify-between cursor-pointer" 
          onClick={() => setNoKids(!noKids)}
        >
          <div className="flex items-center gap-3 font-bold text-lg">
            <Baby className="w-6 h-6 text-zelda-dark" />
            Без детей и стресса
          </div>
          <div className={`w-14 h-8 rounded-full border-[3px] border-zelda-dark p-0.5 transition-colors ${noKids ? 'bg-zelda-green' : 'bg-white'}`}>
            <div className={`w-5 h-5 rounded-full bg-zelda-dark transition-transform ${noKids ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </div>

        <button onClick={onComplete} className="zelda-btn py-4 text-xl mt-4">
          Искать сокровища
        </button>
      </div>
    </motion.div>
  );
}

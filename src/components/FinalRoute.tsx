import { motion } from 'motion/react';
import { CalendarDays, Share2 } from 'lucide-react';
import type { Location } from '../types';

interface FinalRouteProps {
  locations: Location[];
}

export function FinalRoute({ locations }: FinalRouteProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen p-6 max-w-4xl mx-auto pb-24"
    >
      <div className="diorama-card p-8 mb-12 bg-zelda-blue text-white text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-zelda-yellow rounded-full opacity-30 blur-2xl"></div>
        <h1 className="text-4xl font-black mb-2 drop-shadow-md relative z-10">Ваш Идеальный Маршрут</h1>
        <p className="font-bold text-white/90 relative z-10 text-lg">
          3 дня • 4 локации • 100% кайфа
        </p>
      </div>

      <div className="relative border-l-4 border-zelda-dark ml-6 md:ml-8 space-y-12 pb-8">
        {locations.map((loc, i) => (
          <div key={loc.id} className="relative flex items-start group">
            <div className="absolute -left-[26px] flex items-center justify-center w-12 h-12 rounded-full border-4 border-zelda-dark bg-zelda-gold text-zelda-dark font-black shadow-[2px_2px_0px_#3a1952] z-10">
              {i + 1}
            </div>
            <div className="w-full pl-10">
              <div className="diorama-card p-4 bg-white hover:-translate-y-1 transition-transform">
                <img 
                  src={loc.img} 
                  className="w-full h-48 object-cover rounded-lg border-2 border-zelda-dark mb-4" 
                  alt={loc.title} 
                />
                <h3 className="font-black text-xl mb-2 text-zelda-dark">{loc.title}</h3>
                <p className="text-sm font-medium text-gray-600 leading-relaxed">{loc.desc}</p>
                <div className="mt-4 flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-zelda-green/10 text-zelda-green border-2 border-zelda-green rounded-full text-xs font-bold">
                    {loc.match}% совпадение
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 glass-panel m-4 flex gap-4 z-50 max-w-4xl mx-auto rounded-2xl border-[3px] border-zelda-dark shadow-[4px_4px_0px_#3a1952]">
        <button className="flex-1 zelda-btn bg-zelda-green text-white py-4 text-lg flex items-center justify-center gap-2">
          <CalendarDays className="w-6 h-6" /> 
          Забронировать всё
        </button>
        <button className="flex-1 zelda-btn bg-white py-4 text-lg flex items-center justify-center gap-2 text-zelda-dark">
          <Share2 className="w-6 h-6" /> 
          Поделиться
        </button>
      </div>
    </motion.div>
  );
}

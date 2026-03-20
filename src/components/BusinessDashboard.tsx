import { motion } from 'motion/react';
import { Users, Heart, Map as MapIcon, Sparkles } from 'lucide-react';

export function BusinessDashboard() {
  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-black mb-8 text-white text-glass-shadow"
      >
        Кабинет Владельца
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {[
          { icon: Users, value: '142', label: 'Гостей в маршрутах', gradient: 'from-blue-400 to-cyan-400' },
          { icon: Heart, value: '89', label: 'Добавили в избранное', gradient: 'from-pink-400 to-red-400' },
          { icon: MapIcon, value: '12', label: 'Сгенерировано маршрутов', gradient: 'from-green-400 to-emerald-400' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex flex-col items-center text-center gap-3"
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
              <stat.icon className="w-8 h-8 text-white" />
            </div>
            <span className="text-5xl font-black text-white">{stat.value}</span>
            <span className="font-bold text-white/70">{stat.label}</span>
          </motion.div>
        ))}
      </div>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-hero p-8"
      >
        <h2 className="text-2xl font-black mb-6 text-white">Управление</h2>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass-btn glass-btn-primary py-4 px-8 text-lg font-bold flex items-center gap-3"
        >
          <Sparkles className="w-5 h-5" />
          Добавить спецпредложение
        </motion.button>
      </motion.div>
    </div>
  );
}

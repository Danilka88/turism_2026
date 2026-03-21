import { motion } from 'motion/react';
import { Compass, Play, Wine, Zap, Map as MapIcon } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
  onWineScan: () => void;
  onEmergency: () => void;
  onMapExplore: () => void;
}

export function Landing({ onStart, onWineScan, onEmergency, onMapExplore }: LandingProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-hero p-8 max-w-md w-full flex flex-col items-center gap-6 relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-glass-accent rounded-full opacity-30 blur-3xl animate-float"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-glass-cyan rounded-full opacity-20 blur-2xl animate-float" style={{ animationDelay: '-3s' }}></div>
        
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-glass-primary rounded-full blur-xl opacity-40 animate-pulse"></div>
          <Compass className="w-24 h-24 text-white drop-shadow-lg relative z-10" />
        </motion.div>
        
        <h1 className="text-4xl font-black text-white leading-tight text-glass-shadow">
          Привет,<br/>Краснодарский край
        </h1>
        <p className="text-lg font-medium text-white/80">
          Найди скрытые сокровища, винодельни и фермы. Почувствуй, что ты уже там.
        </p>
        <button 
          onClick={onStart} 
          className="glass-btn glass-btn-primary px-8 py-4 text-xl w-full flex items-center justify-center gap-3 mt-4"
        >
          <Play className="w-6 h-6 fill-current" /> 
          Начать приключение
        </button>
        
        <div className="w-full border-t border-white/20 pt-4 mt-2 space-y-3">
          <p className="text-sm text-white/60 mb-1">Или начни с бутылки вина</p>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onWineScan}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/80 hover:to-pink-600/80 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/20"
          >
            <Wine className="w-5 h-5" />
            Сканировать бутылку
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEmergency}
            className="w-full py-3 px-6 bg-gradient-to-r from-amber-500/80 to-orange-500/80 hover:from-amber-600/80 hover:to-orange-600/80 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/20"
          >
            <Zap className="w-5 h-5" />
            Экстренный маршрут
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onMapExplore}
            className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-600/80 hover:to-blue-600/80 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/20"
          >
            <MapIcon className="w-5 h-5" />
            Путешествие по карте
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

import { motion } from 'motion/react';
import { Compass, Play } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
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
      </motion.div>
    </motion.div>
  );
}

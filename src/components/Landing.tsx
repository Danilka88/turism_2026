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
      <div className="diorama-card p-8 max-w-md w-full flex flex-col items-center gap-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-zelda-yellow rounded-full opacity-50 blur-2xl"></div>
        <Compass className="w-24 h-24 text-zelda-green drop-shadow-lg" />
        <h1 className="text-4xl font-black text-zelda-dark leading-tight">
          Привет,<br/>Краснодарский край
        </h1>
        <p className="text-lg font-medium text-zelda-dark/80">
          Найди скрытые сокровища, винодельни и фермы. Почувствуй, что ты уже там.
        </p>
        <button onClick={onStart} className="zelda-btn px-8 py-4 text-xl w-full flex items-center justify-center gap-3 mt-4">
          <Play className="w-6 h-6 fill-current" /> 
          Начать приключение
        </button>
      </div>
    </motion.div>
  );
}

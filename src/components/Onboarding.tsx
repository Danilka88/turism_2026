import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart } from 'lucide-react';
import { ONBOARDING_CARDS } from '../data';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comment, setComment] = useState('');

  const handleSwipe = (_direction: 'left' | 'right') => {
    if (currentIndex < ONBOARDING_CARDS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setComment('');
    } else {
      onComplete();
    }
  };

  const card = ONBOARDING_CARDS[currentIndex];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -100 }} 
      className="flex flex-col items-center justify-center min-h-screen p-6"
    >
      <div className="w-full max-w-sm mb-6 flex justify-between items-center font-bold text-zelda-dark">
        <span className="bg-white px-4 py-1 rounded-full border-2 border-zelda-dark shadow-[2px_2px_0px_#3a1952]">
          Вопрос {currentIndex + 1} / {ONBOARDING_CARDS.length}
        </span>
        <div className="h-4 w-32 bg-white/50 rounded-full overflow-hidden border-2 border-zelda-dark shadow-[2px_2px_0px_#3a1952]">
          <div 
            className="h-full bg-zelda-gold transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / ONBOARDING_CARDS.length) * 100}%` }} 
          />
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotate: 5 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_e, { offset, velocity }: { offset: { x: number }; velocity: { x: number } }) => {
            const swipe = Math.abs(offset.x) * velocity.x;
            if (swipe < -10000) handleSwipe('left');
            else if (swipe > 10000) handleSwipe('right');
          }}
          className="diorama-card w-full max-w-sm overflow-hidden flex flex-col cursor-grab active:cursor-grabbing"
        >
          <div className="relative h-64">
            <img src={card.img} alt="card" className="w-full h-full object-cover border-b-[3px] border-zelda-dark" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <h2 className="text-2xl font-black text-white drop-shadow-md leading-tight">{card.text}</h2>
            </div>
          </div>
          <div className="p-6 flex flex-col gap-4 bg-white">
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Своё мнение (опционально)..." 
              className="w-full p-3 rounded-xl border-2 border-zelda-dark/20 focus:border-zelda-green outline-none resize-none h-20 bg-gray-50 font-medium"
            />
            <div className="flex justify-between gap-4 mt-2">
              <button onClick={() => handleSwipe('left')} className="flex-1 zelda-btn bg-white py-4 flex justify-center items-center text-red-500">
                <X className="w-8 h-8" strokeWidth={3} />
              </button>
              <button onClick={() => handleSwipe('right')} className="flex-1 zelda-btn bg-zelda-green text-white py-4 flex justify-center items-center">
                <Heart className="w-8 h-8 fill-current" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

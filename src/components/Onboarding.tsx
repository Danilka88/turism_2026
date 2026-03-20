import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart } from 'lucide-react';
import { ONBOARDING_CARDS } from '../data';

interface OnboardingProps {
  onComplete: (likedIds: number[]) => void;
}

const INTEREST_RESULTS: Record<number, string[]> = {
  1: ['вина', 'дегустации', 'виноградников'],
  2: ['горных прогулок', 'природы', 'эко-туризма'],
  3: ['фермерских продуктов', 'сыроварни', 'лошадей'],
  4: ['истории', 'дольменов', 'археологии'],
  5: ['экстрима', 'джиппинга', 'приключений'],
  6: ['пляжа', 'моря', 'спокойствия'],
  7: ['казачьей культуры', 'истории Кубани', 'станиц'],
  8: ['гастрономии', 'высокой кухни', 'локальной еды'],
};

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comment, setComment] = useState('');
  const [likedInterests, setLikedInterests] = useState<number[]>([]);

  const handleSwipe = (liked: boolean) => {
    const card = ONBOARDING_CARDS[currentIndex];
    
    if (liked) {
      setLikedInterests(prev => [...prev, card.id]);
    }

    if (currentIndex < ONBOARDING_CARDS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setComment('');
    } else {
      onComplete(likedInterests);
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
      <div className="w-full max-w-sm mb-6 flex justify-between items-center font-bold text-white">
        <span className="glass-chip px-4 py-1">
          Вопрос {currentIndex + 1} / {ONBOARDING_CARDS.length}
        </span>
        <div className="h-3 w-32 glass-card rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-glass-cyan to-glass-accent"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / ONBOARDING_CARDS.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
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
            if (swipe < -10000) handleSwipe(false);
            else if (swipe > 10000) handleSwipe(true);
          }}
          className="w-full max-w-md rounded-3xl overflow-hidden flex flex-col cursor-grab active:cursor-grabbing bg-gradient-to-br from-purple-900/95 to-indigo-900/95 border border-white/20 shadow-2xl backdrop-blur-xl"
        >
          <div className="relative h-64">
            <img src={card.img} alt="card" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-6">
              <h2 className="text-3xl font-black text-white drop-shadow-xl leading-tight">{card.text}</h2>
            </div>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Своё мнение (опционально)..." 
              className="glass-input w-full rounded-xl h-24 resize-none font-medium text-base"
            />
            <div className="flex justify-between gap-4 mt-2">
              <button onClick={() => handleSwipe(false)} className="glass-btn flex-1 py-5 flex justify-center items-center text-red-400 bg-red-500/30 text-xl font-bold">
                <X className="w-10 h-10" strokeWidth={3} />
              </button>
              <button onClick={() => handleSwipe(true)} className="glass-btn bg-gradient-to-r from-pink-500 to-rose-500 flex-1 py-5 flex justify-center items-center text-xl font-bold">
                <Heart className="w-10 h-10 fill-current" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export { INTEREST_RESULTS };

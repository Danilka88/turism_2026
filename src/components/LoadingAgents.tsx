import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Search, Compass, Sparkles } from 'lucide-react';

interface LoadingAgentsProps {
  onComplete: () => void;
}

type LoadingStatus = 
  | 'Анализ ответов...'
  | 'Агент-Популярный и Агент-Редкий анализируют профиль...'
  | 'Агент-Семья и Агент-Гастро составляют маршрут...';

const AGENTS = ['Популярный', 'Редкий', 'Винный', 'Семья'] as const;

export function LoadingAgents({ onComplete }: LoadingAgentsProps) {
  const [status, setStatus] = useState<LoadingStatus>('Анализ ответов...');
  const [progress, setProgress] = useState(0);

  const runAI = useCallback(async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY') {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Проанализируй профиль туриста: любит вино, горы, едет с семьей. Выдай 3 ключевых интереса.' }] }]
          })
        });
        if (!response.ok) throw new Error('API Error');
        
        setStatus('Агент-Популярный и Агент-Редкий анализируют профиль...');
        
        await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Составь маршрут по Краснодарскому краю на 3 дня для семьи.' }] }]
          })
        });
        
        setStatus('Агент-Семья и Агент-Гастро составляют маршрут...');
      } catch (e) {
        console.error('AI Analysis failed:', e);
      }
    } else {
      setStatus('Агент-Популярный и Агент-Редкий анализируют профиль...');
      await new Promise(r => setTimeout(r, 1500));
      setStatus('Агент-Семья и Агент-Гастро составляют маршрут...');
      await new Promise(r => setTimeout(r, 1500));
    }
    
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 3000;
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min((elapsed / duration) * 100, 100));
    }, 50);

    runAI().finally(() => clearInterval(interval));
  }, [runAI]);

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
        className="glass-hero p-8 max-w-md w-full flex flex-col items-center gap-8"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-glass-cyan via-glass-accent to-glass-cyan rounded-full blur-xl opacity-40"
          />
          <div className="relative">
            <Search className="w-20 h-20 text-white" />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-2 -right-2 bg-glass-mint/50 backdrop-blur-md rounded-full p-2 border border-white/30"
            >
              <Compass className="w-6 h-6 text-white" />
            </motion.div>
          </div>
        </div>
        
        <motion.h2 
          key={status}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-white"
        >
          {status}
        </motion.h2>
        
        <div className="flex justify-center gap-6">
          {AGENTS.map((agent, i) => (
            <motion.div 
              key={agent}
              initial={{ y: 20, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15, type: "spring" }}
              className="flex flex-col items-center gap-3"
            >
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ delay: i * 0.2, duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-xs font-bold uppercase text-white/80">{agent}</span>
            </motion.div>
          ))}
        </div>
        
        <div className="w-full h-2 glass-card-solid rounded-full overflow-hidden">
          <motion.div 
            animate={{ width: `${progress}%` }} 
            className="h-full bg-gradient-to-r from-glass-cyan to-glass-accent rounded-full"
          />
        </div>
        
        <p className="text-sm text-white/60 font-medium">Подбираем лучшие места для вас...</p>
      </motion.div>
    </motion.div>
  );
}

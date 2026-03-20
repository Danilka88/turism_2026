import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Search, Compass } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

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
        const ai = new GoogleGenAI({ apiKey });
        
        setStatus('Агент-Популярный и Агент-Редкий анализируют профиль...');
        await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: 'Проанализируй профиль туриста: любит вино, горы, едет с семьей. Выдай 3 ключевых интереса.',
        });
        
        setStatus('Агент-Семья и Агент-Гастро составляют маршрут...');
        await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: 'Составь маршрут по Краснодарскому краю на 3 дня для семьи.',
        });
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
      <div className="diorama-card p-8 max-w-md w-full flex flex-col items-center gap-8">
        <div className="relative">
          <Search className="w-20 h-20 text-zelda-blue animate-bounce" />
          <div className="absolute -bottom-2 -right-2 bg-zelda-yellow rounded-full p-1 border-2 border-zelda-dark animate-spin">
            <Compass className="w-6 h-6 text-zelda-dark" />
          </div>
        </div>
        <h2 className="text-2xl font-black">{status}</h2>
        
        <div className="flex justify-center gap-4">
          {AGENTS.map((agent, i) => (
            <motion.div 
              key={agent}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.2, repeat: Infinity, repeatType: 'reverse', duration: 0.5 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-14 h-14 rounded-full bg-zelda-gold border-[3px] border-zelda-dark flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_#3a1952]">
                ИИ
              </div>
              <span className="text-[10px] font-bold uppercase">{agent}</span>
            </motion.div>
          ))}
        </div>
        
        <div className="w-full h-6 bg-gray-200 rounded-full border-[3px] border-zelda-dark overflow-hidden shadow-[inset_0px_3px_0px_rgba(0,0,0,0.1)]">
          <motion.div 
            animate={{ width: `${progress}%` }} 
            className="h-full bg-zelda-green" 
          />
        </div>
      </div>
    </motion.div>
  );
}

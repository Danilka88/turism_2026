import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Search, Compass, Sparkles, Wifi, WifiOff } from 'lucide-react';
import { useAIService } from '../../ollama-integration/AIServiceContext';
import type { UserProfile } from '../../ollama-integration/types';

interface LoadingAgentsProps {
  onComplete: () => void;
  likedInterests?: number[];
  companions?: string;
}

type LoadingStatus = 
  | 'Подключение к ИИ...'
  | 'Анализ ответов...'
  | 'Профиль составлен!'
  | 'Агент-Популярный и Агент-Редкий анализируют...'
  | 'Агент-Семья и Агент-Гастро составляют маршрут...'
  | 'Маршрут готов!';

const AGENTS = ['Популярный', 'Редкий', 'Винный', 'Семья'] as const;

export function LoadingAgents({ onComplete, likedInterests = [], companions = 'Компания друзей' }: LoadingAgentsProps) {
  const [status, setStatus] = useState<LoadingStatus>('Подключение к ИИ...');
  const [progress, setProgress] = useState(0);
  const [modeIcon, setModeIcon] = useState<'wifi' | 'wifi-off'>('wifi');
  const { mode, matchRoutes } = useAIService();

  const runAI = useCallback(async () => {
    setStatus('Анализ ответов...');
    
    const userProfile: UserProfile = {
      id: 'temp-user',
      interests: likedInterests.map(id => ({ id, category: 'general', name: `Interest ${id}`, liked: true })),
      companions: [{ id: 'companion', name: companions, icon: '👥' }],
      preferences: { foodPreferences: [], noKidsMode: false },
      history: { viewedLocations: [], selectedLocations: [], rejectedLocations: [], bookings: [] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    if (mode === 'ollama') {
      setModeIcon('wifi');
      setStatus('Профиль составлен!');
      await new Promise(r => setTimeout(r, 800));
      
      setStatus('Агент-Популярный и Агент-Редкий анализируют...');
      try {
        await matchRoutes({ userProfile, locations: [] });
      } catch (e) {
        console.warn('Route matching via Ollama failed');
      }
      
      setStatus('Агент-Семья и Агент-Гастро составляют маршрут...');
      await new Promise(r => setTimeout(r, 1200));
    } else {
      setModeIcon('wifi-off');
      setStatus('Профиль составлен!');
      await new Promise(r => setTimeout(r, 800));
      setStatus('Агент-Популярный и Агент-Редкий анализируют...');
      await new Promise(r => setTimeout(r, 1200));
      setStatus('Агент-Семья и Агент-Гастро составляют маршрут...');
      await new Promise(r => setTimeout(r, 1200));
    }
    
    setStatus('Маршрут готов!');
    await new Promise(r => setTimeout(r, 500));
    onComplete();
  }, [mode, matchRoutes, likedInterests, companions, onComplete]);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 4500;
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min((elapsed / duration) * 100, 100));
    }, 50);

    const timeout = setTimeout(() => runAI().finally(() => clearInterval(interval)), 500);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
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
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs"
        >
          {modeIcon === 'wifi' ? (
            <Wifi className="w-3 h-3 text-glass-cyan" />
          ) : (
            <WifiOff className="w-3 h-3 text-glass-accent" />
          )}
          <span className="text-white/70">
            {mode === 'ollama' ? 'Ollama qwen3.5:4b' : mode === 'demo' ? 'Демо-режим' : 'Ожидание...'}
          </span>
        </motion.div>
        
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

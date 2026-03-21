import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, Loader2, CheckCircle, XCircle, Bot, Wine, MapPin, Compass, FileText, Brain, Wifi, WifiOff, Image, Upload } from 'lucide-react';
import { useAIService } from '../../ollama-integration/AIServiceContext';
import { agentManager } from '../../ollama-integration/AgentManager';
import { visionAgent } from '../../ollama-integration/agents/VisionAgent';
import type { UserProfile, Location, EmergencyProblem } from '../../ollama-integration/types';

interface AgentConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  testPrompt: string;
  run: () => Promise<string>;
}

const DEMO_USER_PROFILE: UserProfile = {
  id: 'test-user',
  interests: [
    { id: 1, category: 'Горы', name: 'Горы и природа', liked: true },
    { id: 6, category: 'Гастрономия', name: 'Виноделие', liked: true },
    { id: 2, category: 'История', name: 'История и культура', liked: true },
  ],
  companions: [{ id: '1', name: 'Семья', icon: '👨‍👩‍👧‍👦' }],
  preferences: { foodPreferences: ['казачья', 'морепродукты'], noKidsMode: false },
  history: { viewedLocations: [1, 2, 3], selectedLocations: [1, 2], rejectedLocations: [], bookings: [] },
  travelStyle: 'активный',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEMO_LOCATIONS: Location[] = [
  { id: 1, title: 'Гора Фишт', description: 'Популярная гора с прекрасными видами', match: 95, matchText: 'Отлично', tags: ['горы'], lat: 43.9, lng: 39.4, img: '', videos: [], foodOptions: [], activities: [] },
  { id: 2, title: 'Винодельня Гай-Кодзор', description: 'Современная винодельня', match: 88, matchText: 'Популярное', tags: ['вино'], lat: 44.6, lng: 38.0, img: '', videos: [], foodOptions: [], activities: [] },
  { id: 3, title: 'Озеро Кардывач', description: 'Горное озеро', match: 82, matchText: 'Хорошее', tags: ['природа'], lat: 43.8, lng: 39.9, img: '', videos: [], foodOptions: [], activities: [] },
];

const BASE_AGENTS: AgentConfig[] = [
  {
    id: 'onboarding',
    name: 'Onboarding Agent',
    icon: <Bot className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500',
    description: 'Профилирование пользователя',
    testPrompt: 'Анализ профиля: горы, вино, история, семья',
    run: async () => {
      const result = await agentManager.onboarding({
        selectedInterests: DEMO_USER_PROFILE.interests.map(i => ({ id: i.id, liked: i.liked })),
      });
      return JSON.stringify(result, null, 2);
    },
  },
  {
    id: 'route_matcher',
    name: 'Route Matcher Agent',
    icon: <MapPin className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-500',
    description: 'Подбор мест по интересам',
    testPrompt: 'Интересы: горы, вино, история. Компания: семья',
    run: async () => {
      const result = await agentManager.matchRoutes({
        userProfile: DEMO_USER_PROFILE,
        locations: DEMO_LOCATIONS,
      });
      return JSON.stringify(result, null, 2);
    },
  },
  {
    id: 'wine_scanner',
    name: 'Wine Scanner Agent',
    icon: <Wine className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500',
    description: 'Распознавание вина по тексту',
    testPrompt: 'Вино: Кубань. Красное полусладкое.',
    run: async () => {
      const result = await agentManager.scanWine({
        wineName: 'Кубань. Красное полусладкое.',
        wineDescription: 'Красное полусладкое вино из Краснодарского края',
      });
      return JSON.stringify(result, null, 2);
    },
  },
  {
    id: 'emergency_route',
    name: 'Emergency Route Agent',
    icon: <Compass className="w-6 h-6" />,
    color: 'from-orange-500 to-red-500',
    description: 'Альтернативы при проблемах',
    testPrompt: 'Проблема: погода, нужен маршрут с укрытиями',
    run: async () => {
      const result = await agentManager.emergencyRoute({
        problem: 'weather' as EmergencyProblem,
        allLocations: DEMO_LOCATIONS,
      });
      return JSON.stringify(result, null, 2);
    },
  },
  {
    id: 'description_generator',
    name: 'Description Generator',
    icon: <FileText className="w-6 h-6" />,
    color: 'from-yellow-500 to-orange-500',
    description: 'Генерация описаний',
    testPrompt: 'Место: Горное озеро в Красной Поляне',
    run: async () => {
      const result = await agentManager.generateDescription({
        location: { title: 'Горное озеро', description: 'Красивое озеро в горах' },
        tone: 'adventurous',
      });
      return JSON.stringify(result, null, 2);
    },
  },
  {
    id: 'personalization',
    name: 'Personalization Agent',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-indigo-500 to-purple-500',
    description: 'Обучение на действиях',
    testPrompt: 'Пользователь выбрал 2 горных маршрута',
    run: async () => {
      const result = await agentManager.personalize({
        userProfile: DEMO_USER_PROFILE,
        recentActions: [
          { type: 'select', locationId: 1, timestamp: new Date().toISOString() },
          { type: 'select', locationId: 3, timestamp: new Date().toISOString() },
        ],
      });
      return JSON.stringify(result, null, 2);
    },
  },
];

interface TestResult {
  status: 'idle' | 'loading' | 'success' | 'error';
  response: string;
  duration?: number;
}

export function AgentTester({ onBack }: { onBack: () => void }) {
  const { mode } = useAIService();
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visionLoading, setVisionLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runTest = async (agent: AgentConfig) => {
    setResults(prev => ({
      ...prev,
      [agent.id]: { status: 'loading', response: '' },
    }));

    const startTime = Date.now();

    try {
      const response = await agent.run();
      const duration = Date.now() - startTime;
      
      setResults(prev => ({
        ...prev,
        [agent.id]: {
          status: 'success',
          response,
          duration,
        },
      }));
    } catch (error) {
      const duration = Date.now() - startTime;
      setResults(prev => ({
        ...prev,
        [agent.id]: {
          status: 'error',
          response: error instanceof Error ? error.message : 'Ошибка тестирования',
          duration,
        },
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeWineImage = async () => {
    if (!selectedImage) return;

    setVisionLoading(true);
    const startTime = Date.now();

    try {
      const base64Data = selectedImage.split(',')[1] || selectedImage;
      
      const result = await visionAgent.process({
        imageBase64: base64Data,
      });

      const duration = Date.now() - startTime;

      setResults(prev => ({
        ...prev,
        'wine_vision': {
          status: result.success ? 'success' : 'error',
          response: JSON.stringify(result, null, 2),
          duration,
        },
      }));
    } catch (error) {
      const duration = Date.now() - startTime;
      setResults(prev => ({
        ...prev,
        'wine_vision': {
          status: 'error',
          response: error instanceof Error ? error.message : 'Ошибка анализа',
          duration,
        },
      }));
    } finally {
      setVisionLoading(false);
    }
  };

  const visionResult = results['wine_vision'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-950 to-indigo-950 p-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="glass-btn p-3 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">
              Тест ИИ-Агентов
            </h1>
            <p className="text-white/60 text-sm">Проверь работу каждого агента с Ollama</p>
          </div>
          <div className="glass-card px-3 py-1.5 rounded-full flex items-center gap-2">
            {mode === 'ollama' ? (
              <>
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-400 font-bold">Ollama</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-yellow-400 font-bold">Demo</span>
              </>
            )}
          </div>
        </div>

        <div className="glass-hero p-4 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white">
              <Image className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white">Vision Agent - Анализ бутылки вина</h3>
              <p className="text-xs text-white/60">Загрузите фото бутылки вина для распознавания</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              {selectedImage ? (
                <div className="relative">
                  <img 
                    src={selectedImage} 
                    alt="Preview" 
                    className="w-full h-48 object-contain rounded-lg bg-black/30"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 glass-btn p-2 rounded-full text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-white/50 transition-colors"
                >
                  <Upload className="w-8 h-8 text-white/50 mb-2" />
                  <p className="text-white/50 text-sm">Нажмите для загрузки фото</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={analyzeWineImage}
                disabled={!selectedImage || visionLoading}
                className="glass-btn glass-btn-primary py-3 px-6 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {visionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Анализ...</span>
                  </>
                ) : (
                  <>
                    <Wine className="w-4 h-4" />
                    <span>Анализировать</span>
                  </>
                )}
              </button>
              {selectedImage && (
                <p className="text-xs text-white/50 text-center">
                  Нажмите "Анализировать" для распознавания
                </p>
              )}
            </div>
          </div>

          <AnimatePresence>
            {visionResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <div className={`p-3 rounded-lg ${visionResult.status === 'success' ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {visionResult.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-xs font-bold ${visionResult.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                      {visionResult.status === 'success' ? 'Распознано' : 'Ошибка'}
                    </span>
                    {visionResult.duration && (
                      <span className="text-xs text-white/50 ml-auto">
                        {visionResult.duration}ms
                      </span>
                    )}
                  </div>
                  <pre className="text-xs text-white/80 whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
                    {visionResult.response}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <h2 className="text-lg font-bold text-white/80 mb-4">Остальные агенты</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BASE_AGENTS.map((agent) => {
            const result = results[agent.id];
            
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-hero p-4"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-white`}>
                    {agent.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{agent.name}</h3>
                    <p className="text-xs text-white/60">{agent.description}</p>
                  </div>
                </div>

                <div className="bg-black/20 rounded-lg p-2 mb-3">
                  <p className="text-xs text-white/70 italic">
                    "{agent.testPrompt}"
                  </p>
                </div>

                <button
                  onClick={() => runTest(agent)}
                  disabled={result?.status === 'loading' || mode !== 'ollama'}
                  className="w-full glass-btn glass-btn-primary py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {result?.status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Тестирование...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>{mode === 'ollama' ? 'Тестировать' : 'Ollama недоступен'}</span>
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {result && result.status !== 'loading' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3"
                    >
                      <div className={`p-3 rounded-lg ${result.status === 'success' ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {result.status === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className={`text-xs font-bold ${result.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {result.status === 'success' ? 'Успешно' : 'Ошибка'}
                          </span>
                          {result.duration && (
                            <span className="text-xs text-white/50 ml-auto">
                              {result.duration}ms
                            </span>
                          )}
                        </div>
                        <pre className="text-xs text-white/80 whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
                          {result.response}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 glass-card p-4 text-center">
          <p className="text-white/60 text-sm">
            {mode === 'ollama' 
              ? '🤖 Агенты используют реальную модель Ollama qwen3.5:4b'
              : '⚠️ Ollama недоступен. Запустите ollama serve для тестирования.'}
          </p>
          <p className="text-white/40 text-xs mt-2">
            💡 Для Vision Agent нужна модель llava:7b — ollama pull llava:7b
          </p>
        </div>
      </div>
    </motion.div>
  );
}

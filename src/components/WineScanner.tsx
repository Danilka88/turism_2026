import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, Wine, MapPin, Check, 
  ChevronRight, Sparkles, Star, Clock, X, Heart
} from 'lucide-react';
import type { Location } from '../types';

const WINE_BRANDS = [
  {
    id: 'skalistiy',
    name: 'Винодельня "Скалистый Берег"',
    shortName: 'Скалистый Берег',
    wines: ['Красное сухое "Мерло"', 'Белое полусладкое "Шардоне"', 'Розовое "Пино Нуар"'],
    description: 'Гравитационная винодельня с космической архитектурой и панорамным видом на море.',
    location: 'г. Анапа',
    match: 96,
    features: ['Экскурсия по винодельне', 'Дегустация 5 вин', 'Прогулка по виноградникам'],
    rating: 4.9,
    duration: '3-4 часа',
  },
  {
    id: 'fanagoria',
    name: 'Фанагория',
    shortName: 'Фанагория',
    wines: ['Красное "Каберне Совиньон"', 'Белое "Рислинг"', 'Игристое "Брют"'],
    description: 'Крупнейший винный холдинг Кубани с богатой историей и современными технологиями.',
    location: 'г. Темрюк',
    match: 89,
    features: ['Музей вина', 'Дегустация', 'Виноградники'],
    rating: 4.7,
    duration: '4-5 часов',
  },
  {
    id: 'kuban',
    name: 'Кубанские вина',
    shortName: 'Кубанские вина',
    wines: ['Красное столовое', 'Белое столовое', 'Кагор'],
    description: 'Классические кубанские вина по традиционным рецептам.',
    location: 'г. Краснодар',
    match: 75,
    features: ['Дегустация', 'Магазин', 'Экскурсия'],
    rating: 4.5,
    duration: '2-3 часа',
  },
];

interface WineRecognitionResult {
  brand: typeof WINE_BRANDS[0];
  uploadedImage: string;
  confidence: number;
}

interface WineScannerProps {
  onBuildTour: (location: Location) => void;
  onBack: () => void;
}

export function WineScanner({ onBuildTour, onBack }: WineScannerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<WineRecognitionResult | null>(null);
  const [showTour, setShowTour] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setResult(null);
        setShowTour(false);
        setIsAnalyzing(true);
        
        // Simulate AI recognition (in real app, this would call an AI API)
        setTimeout(() => {
          const randomBrand = WINE_BRANDS[Math.floor(Math.random() * WINE_BRANDS.length)];
          setResult({
            brand: randomBrand,
            uploadedImage: event.target?.result as string,
            confidence: 85 + Math.floor(Math.random() * 14),
          });
          setIsAnalyzing(false);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setResult(null);
    setShowTour(false);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-4xl mx-auto">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
      >
        <ChevronRight className="w-5 h-5 rotate-180" />
        Назад
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
          <Wine className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
          Сканер вина
        </h1>
        <p className="text-white/70 text-base">
          Загрузите фото бутылки и мы построим тур на винодельню
        </p>
      </motion.div>

      {/* Upload Area */}
      <AnimatePresence mode="wait">
        {!selectedImage && !result && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-8 text-center"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/30 rounded-2xl p-12 cursor-pointer hover:border-purple-400 hover:bg-white/5 transition-all"
            >
              <Camera className="w-16 h-16 mx-auto mb-4 text-white/50" />
              <h3 className="text-xl font-bold text-white mb-2">
                Загрузите фото бутылки
              </h3>
              <p className="text-white/60 text-sm">
                Нажмите или перетащите изображение сюда
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: '🍷', label: 'Красное' },
                { icon: '🍾', label: 'Белое' },
                { icon: '🥂', label: 'Игристое' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-3xl mb-1">{item.icon}</div>
                  <span className="text-xs text-white/60">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Analyzing */}
        {isAnalyzing && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-12 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
            >
              <Wine className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Анализируем этикетку...
            </h3>
            <p className="text-white/60 mb-4">
              Распознаём производителя и винодельню
            </p>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: ['0%', '100%'] }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              />
            </div>
          </motion.div>
        )}

        {/* Result */}
        {result && !showTour && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            {/* Recognition Badge */}
            <div className="glass-card p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">Успешно распознано!</p>
                <p className="text-white/60 text-sm">Точность: {result.confidence}%</p>
              </div>
            </div>

            {/* Winery Card */}
            <div className="glass-card overflow-hidden">
              <div className="relative h-40 bg-gradient-to-br from-purple-900/50 to-pink-900/50">
                <img 
                  src={selectedImage!} 
                  alt="Ваша бутылка" 
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-32 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/30">
                    <Wine className="w-12 h-12 text-white/80" />
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 rounded-full font-bold text-white">
                  {result.brand.match}% совпадение
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-black text-white mb-1">
                      {result.brand.name}
                    </h2>
                    <div className="flex items-center gap-2 text-white/70">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{result.brand.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-bold text-yellow-400">{result.brand.rating}</span>
                  </div>
                </div>

                <p className="text-white/80 mb-4">
                  {result.brand.description}
                </p>

                {/* Wines */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-white/60 mb-2">Вина бренда:</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.brand.wines.map((wine) => (
                      <span key={wine} className="text-sm bg-white/10 px-3 py-1 rounded-full text-white/90">
                        🍷 {wine}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {result.brand.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 bg-purple-500/20 px-3 py-2 rounded-xl">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-white">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Duration & Rating */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-white/60" />
                    <p className="text-white/60 text-xs">Длительность</p>
                    <p className="font-bold text-white">{result.brand.duration}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <Star className="w-6 h-6 mx-auto mb-2 text-yellow-400 fill-current" />
                    <p className="text-white/60 text-xs">Рейтинг</p>
                    <p className="font-bold text-white">{result.brand.rating}/5</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={resetScanner}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                  >
                    Сканировать другое
                  </button>
                  <button
                    onClick={() => setShowTour(true)}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-5 h-5" />
                    Построить тур
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tour Builder */}
        {result && showTour && (
          <motion.div
            key="tour"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white">
                Построить тур на {result.brand.shortName}
              </h2>
              <button onClick={() => setShowTour(false)} className="p-2 bg-white/10 rounded-full">
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            {/* Quick Options */}
            <div className="space-y-3 mb-6">
              <p className="text-white/60 text-sm">Выберите формат тура:</p>
              
              {[
                { id: 'full', name: 'Полный тур', desc: `${result.brand.features.join(' + ')}`, duration: result.brand.duration, price: '3500 ₽' },
                { id: 'tasting', name: 'Только дегустация', desc: 'Дегустация 5 вин с сомелье', duration: '1.5 часа', price: '1500 ₽' },
                { id: 'express', name: 'Экспресс', desc: 'Обзорная экскурсия + 3 вина', duration: '1 час', price: '900 ₽' },
              ].map((tour) => (
                <motion.button
                  key={tour.id}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-4 bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 text-left transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white">{tour.name}</span>
                    <span className="font-bold text-green-400">{tour.price}</span>
                  </div>
                  <p className="text-white/60 text-sm mb-2">{tour.desc}</p>
                  <div className="flex items-center gap-2 text-white/50 text-xs">
                    <Clock className="w-3 h-3" />
                    {tour.duration}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Add to Route */}
            <div className="border-t border-white/10 pt-6">
              <h3 className="font-bold text-white mb-3">Добавить в свой маршрут?</h3>
              <p className="text-white/60 text-sm mb-4">
                Мы включим эту винодельню в ваш персональный маршрут с другими местами Краснодарского края
              </p>
              <button
                onClick={() => onBuildTour(result.brand as unknown as Location)}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Добавить в маршрут
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      {!selectedImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 glass-card p-4"
        >
          <h4 className="font-bold text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Совет для лучшего распознавания
          </h4>
          <ul className="text-sm text-white/60 space-y-1">
            <li>• Убедитесь, что этикетка хорошо освещена</li>
            <li>• Сфотографируйте этикетку крупным планом</li>
            <li>• Избегайте бликов и отражений</li>
          </ul>
        </motion.div>
      )}
    </div>
  );
}

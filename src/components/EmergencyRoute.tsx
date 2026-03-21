import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CloudRain, Construction, Users, Zap, Car, Wallet,
  MapPin, ArrowLeft, Clock, RefreshCw, PartyPopper, Check
} from 'lucide-react';
import type { Location } from '../types';
import { LOCATIONS } from '../data';

interface EmergencyProblem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  gradient: string;
  recommendations: (loc: Location) => string[];
}

const EMERGENCY_PROBLEMS: EmergencyProblem[] = [
  {
    id: 'weather',
    icon: <CloudRain className="w-8 h-8" />,
    title: 'Погода испортилась',
    description: 'Дождь, холодно или жара — нужны крытые варианты',
    color: '#60a5fa',
    gradient: 'from-blue-600/80 to-indigo-700/80',
    recommendations: (loc) => {
      const tips: Record<number, string[]> = {
        1: ['Музей истории Кубани — 3 зала с кондиционером', 'Торговый центр Галерея — 5 этажей прогулок'],
        2: ['Абрау-Дюрсо — дегустационный зал под крышей', 'Винодельня — погреб с видом на озеро'],
        3: ['Сочи Парк — все аттракционы под крышей', 'Террариум — экзотические животные'],
        4: ['Скайпарк — смотровая площадка в облаках', 'Морской вокзал — шоппинг и кафе'],
        5: ['Воронцовские пещеры — +15° круглый год', 'Музей края — 2 часа без погоды'],
        6: ['Аквапарк Безал — все горки под крышей', 'Спа-комплекс — релакс и тепло'],
        7: ['Музей космоса — интерактивные залы', 'Планетарий — шоу под куполом'],
        8: ['Форелевое хозяйство — укрытия от дождя', 'Горная тропа — красивые виды даже в туман'],
      };
      return tips[loc.id] || ['Позвоним в местное бюро и подберём вариант'];
    },
  },
  {
    id: 'closed',
    icon: <Construction className="w-8 h-8" />,
    title: 'Объект закрыт',
    description: 'Не работает, на ремонте или не попасть',
    color: '#f59e0b',
    gradient: 'from-amber-600/80 to-orange-700/80',
    recommendations: (loc) => {
      const tips: Record<number, string[]> = {
        1: ['Выходной день — Краснодарский зоопарк работает', 'Краеведческий музей — бесплатный вход'],
        2: ['Винарии Фанагории — дегустация без записи', 'Абрау-Любава — открытая винодельня'],
        3: ['33 водопада — открыты круглый год', 'Плато Лаго-Наки — альтернатива'],
        4: ['Гора Ахун — смотровая вышка открыта', 'Тиховская тропа — лес и тишина'],
        5: ['Романтическая пещера — другая точка входа', 'Водопады на Мзымте — всё работает'],
        6: ['Аквапарк Сочи Парка — альтернатива', 'Парк Ривьера — прогулки и кафе'],
        7: ['Дольмены на реке Пшада — открыты', 'Геленджик дельфинарий — без записи'],
        8: ['Горная жемчужина — термальные источники', 'Водопады в Красной Поляне'],
      };
      return tips[loc.id] || ['Свяжемся и уточним расписание'];
    },
  },
  {
    id: 'crowded',
    icon: <Users className="w-8 h-8" />,
    title: 'Толпы народу',
    description: 'Слишком много людей, хочется уединения',
    color: '#a78bfa',
    gradient: 'from-purple-600/80 to-violet-700/80',
    recommendations: (loc) => {
      const tips: Record<number, string[]> = {
        1: ['Туристический маршрут «Золотая Нива» — тайные места', 'Старый Краснодар — тихие улочки'],
        2: ['Заповедная тропа Утриш — почти без людей', 'Мысid:109_Толстый — дикий пляж'],
        3: ['Смотровая на горе Фишт — час подъёма, потом nobody', 'Долина 33 водопадов — раннее утро'],
        4: ['Верхняя Ольгинка — каньон без толп', 'Роза Пик — канатная дорога на рассвете'],
        5: ['Лунная поляна — секретная точка', 'Тисо-самшитовая роща — только по записи'],
        6: ['Кавказские Минеральные Воды — санатории с лечением', 'Ессентуки — терренкур и тишина'],
        7: ['Долина Сукко — виноградники без туристов', 'Видовая на 1100 м — за 克рышей облаков'],
        8: ['Адыгейские водопады — неожиданно мало людей', 'Горное озеро Кардышево — глушь'],
      };
      return tips[loc.id] || ['Найдём уединённое место'];
    },
  },
  {
    id: 'bored',
    icon: <PartyPopper className="w-8 h-8" />,
    title: 'Скучно стало',
    description: 'Хочу экшена, адреналина или чего-то нового',
    color: '#f43f5e',
    gradient: 'from-rose-600/80 to-pink-700/80',
    recommendations: (loc) => {
      const tips: Record<number, string[]> = {
        1: ['Квест-комната «Побег» — 60 минут острых ощущений', 'Картинг — скорость и драйв'],
        2: ['Зорбинг — спуск в прозрачном шаре', 'Пейнтбол — командное сражение'],
        3: ['Квадроциклы в горах — без прав и опыта', 'Рафтинг по Мзымте — 8 км адреналина'],
        4: ['Парапланеризм — полёт 20 минут с горы', 'Скайпарк — качели на высоте 207 м'],
        5: ['Спелеология — спуск в пещеру с гидом', 'Хайкинг — восхождение на Фишт'],
        6: ['Конные прогулки в горах', 'Джипинг — внедорожник по бездорожью'],
        7: ['Корабль с прозрачным дном — подводный мир', 'Сноркелинг — маска и ласты'],
        8: ['Мотопрогулка на внедорожниках', 'Каньонинг — спуск по ущелью'],
      };
      return tips[loc.id] || ['Подберём драйв на любой вкус'];
    },
  },
  {
    id: 'traffic',
    icon: <Car className="w-8 h-8" />,
    title: 'Пробки / Нет машины',
    description: 'Нужно что-то близкое и доступное',
    color: '#10b981',
    gradient: 'from-emerald-600/80 to-teal-700/80',
    recommendations: (loc) => {
      const tips: Record<number, string[]> = {
        1: ['Пешеходная экскурсия по центру — 2 часа', 'Скейт-парк и набережная — всё рядом'],
        2: ['Автобусная экскурсия с гидом — комфортно', 'Аренда велосипеда — 200₽/час'],
        3: ['Электричка до Имеретинки — 45 минут', 'Маршрутка до Красной Поляны'],
        4: ['Роза Хутор — автобус каждые 15 минут', 'Канатная дорога — вид стоит всего'],
        5: ['Летний дворец — 15 минут пешком', 'Кабардинская слободка — культура за 2 часа'],
        6: ['Велопрокат в центре — 300₽/день', 'Трамвай до Хосты — 30 минут'],
        7: ['Троллейбус до Сукко — живописный маршрут', 'Маршрутка до Вишнёвки — дикий пляж'],
        8: ['Электричка до Горячего Ключа — 40 минут', 'Автобус до долины — без пересадок'],
      };
      return tips[loc.id] || ['Есть близкие варианты — 10-30 минут'];
    },
  },
  {
    id: 'budget',
    icon: <Wallet className="w-8 h-8" />,
    title: 'Хочу дёшево',
    description: 'Бюджет ограничен, но хочется впечатлений',
    color: '#34d399',
    gradient: 'from-lime-600/80 to-green-700/80',
    recommendations: (loc) => {
      const tips: Record<number, string[]> = {
        1: ['Парк Галицкого — бесплатно, красиво', 'Чистые пруды — шашлыки на природе'],
        2: ['Дегустация в Фанагории — 500₽', 'Набережная Абрау — бесплатно, красиво'],
        3: ['Смотровая на Ахун — 0₽', 'Тропа к водопадам — бесплатно'],
        4: ['Морской вокзал — просто погулять', 'Приморская набережная — закат бесплатен'],
        5: ['Парк Ривьера — фонтаны и прогулки', 'Тир и батуты — 200₽'],
        6: ['Грязелечебница — доступные процедуры', 'Водные источники — бесплатно'],
        7: ['Пляж — солнце, море, песок, 0₽', 'Лодочная станция — 400₽/час'],
        8: ['Лесная прогулка — бесплатно и красиво', 'Фермерский рынок — вкусно и дёшево'],
      };
      return tips[loc.id] || ['Нашли бесплатные места'];
    },
  },
];

interface EmergencyRouteProps {
  onBuildRoute: (locations: Location[], problem: string) => void;
  onBack: () => void;
}

export function EmergencyRoute({ onBuildRoute, onBack }: EmergencyRouteProps) {
  const [step, setStep] = useState<'problems' | 'loading' | 'result'>('problems');
  const [selectedProblem, setSelectedProblem] = useState<EmergencyProblem | null>(null);
  const [recommendedLocations, setRecommendedLocations] = useState<Location[]>([]);

  const handleSelectProblem = (problem: EmergencyProblem) => {
    setSelectedProblem(problem);
    setStep('loading');

    setTimeout(() => {
      const shuffled = [...LOCATIONS].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 3);
      setRecommendedLocations(selected);
      setStep('result');
    }, 2500);
  };

  const handleAcceptRoute = () => {
    if (selectedProblem) {
      onBuildRoute(recommendedLocations, selectedProblem.title);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 sm:p-6 max-w-4xl mx-auto"
    >
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center gap-4 mb-6"
      >
        <button 
          onClick={onBack}
          className="glass-btn p-3 rounded-full"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Экстренный маршрут</h1>
          <p className="text-white/60 font-bold">Что случилось? Подберём замену за секунды</p>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === 'problems' && (
          <motion.div
            key="problems"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="glass-hero p-4 mb-6 text-center">
              <p className="font-black text-white/90 text-base sm:text-lg">
                Выберите, что произошло — мы мгновенно подберём альтернативу
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EMERGENCY_PROBLEMS.map((problem, i) => (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleSelectProblem(problem)}
                  className="glass-card p-5 sm:p-6 cursor-pointer hover:scale-[1.02] transition-all border-2 border-transparent hover:border-white/30"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${problem.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <div className="text-white">{problem.icon}</div>
                  </div>
                  <h3 className="font-black text-lg text-white mb-2">{problem.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{problem.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="glass-modal p-4 mt-6 text-center">
              <div className="flex items-center justify-center gap-2 text-white/60 font-bold">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Работаем 24/7 — подберём маршрут за 10 секунд</span>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 rounded-full glass-card border-4 border-white/20 flex items-center justify-center mb-8"
            >
              <RefreshCw className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-black text-white mb-2">
              Ищем альтернативу...
            </h2>
            <p className="text-white/60 font-bold text-center max-w-xs">
              Анализируем {selectedProblem?.title.toLowerCase()} и подбираем лучшие места рядом
            </p>
            <div className="mt-8 flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  className="w-3 h-3 rounded-full bg-glass-primary"
                />
              ))}
            </div>
          </motion.div>
        )}

        {step === 'result' && selectedProblem && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <motion.div 
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              className="glass-hero p-4 sm:p-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-600/80 to-emerald-700/80 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Готово! Вот ваш план Б
              </h2>
              <p className="text-white/60 font-bold">
                Нашли отличные места на случай "{selectedProblem.title.toLowerCase()}"
              </p>
            </motion.div>

            <div className="relative ml-4 space-y-6">
              {recommendedLocations.map((loc, i) => (
                <motion.div
                  key={loc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex items-start"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="absolute -left-[22px] flex items-center justify-center w-10 h-10 rounded-full glass-card border-2 border-white/30 z-10"
                  >
                    <span className="font-black text-white text-sm">{i + 1}</span>
                  </motion.div>
                  <div className="w-full pl-8">
                    <div className="glass-card p-4 sm:p-5">
                      <img
                        src={loc.img}
                        className="w-full h-40 sm:h-48 object-cover rounded-2xl mb-4"
                        alt={loc.title}
                      />
                      <h3 className="font-black text-lg text-white mb-2">{loc.title}</h3>
                      
                      <div className="bg-white/10 rounded-xl p-3 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-green-400" />
                          <span className="text-xs font-bold text-white/60">Почему сюда:</span>
                        </div>
                        <div className="space-y-1">
                          {selectedProblem.recommendations(loc).slice(0, 2).map((tip, idx) => (
                            <p key={idx} className="text-sm text-white/80 flex items-start gap-2">
                              <Check className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                              {tip}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="glass-hero p-4 text-center">
              <p className="text-white/60 text-sm font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-green-400" />
                Можно начать прямо сейчас — всё рядом
              </p>
            </div>

            <motion.button
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={handleAcceptRoute}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-bold rounded-2xl border border-white/30 shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              Поехали по новому маршруту!
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

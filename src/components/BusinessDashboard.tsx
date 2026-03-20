import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Heart, MapPin, Sparkles, Plus, Trash2, Edit3, Save, 
  Image, Calendar, ChevronDown, X, Check,
  Wine, Gamepad2, Info, Tag
} from 'lucide-react';
import { LOCATIONS } from '../data';
import type { Location, FoodOption, ActivityOption } from '../types';

const FIGHTER_TAGS = [
  { id: 'Партнёр', icon: '❤️' },
  { id: 'Друг', icon: '🤘' },
  { id: 'Бабушка', icon: '👵' },
  { id: 'Дедушка', icon: '👴' },
  { id: 'Дети', icon: '👶' },
  { id: 'Компания', icon: '🎉' },
  { id: 'Соло', icon: '🧑' },
  { id: 'VIP', icon: '👑' },
];

const SEASONS = ['Весна', 'Лето', 'Осень', 'Зима'];

interface LocationFormData {
  id: number;
  title: string;
  desc: string;
  extendedDesc: string;
  match: number;
  matchText: string;
  tags: string[];
  lat: number;
  lng: number;
  img: string;
  videos: string[];
  foodOptions: FoodOption[];
  activities: ActivityOption[];
  season: string;
}

const createEmptyForm = (): LocationFormData => ({
  id: Date.now(),
  title: '',
  desc: '',
  extendedDesc: '',
  match: 85,
  matchText: '',
  tags: [],
  lat: 44.6,
  lng: 38.0,
  img: '/images/placeholder.jpg',
  videos: [],
  foodOptions: [],
  activities: [],
  season: 'Лето',
});

export function BusinessDashboard() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<LocationFormData | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('basic');
  const [showNewForm, setShowNewForm] = useState(false);

  const handleEdit = (location: Location) => {
    setSelectedLocation(location);
    setEditForm({
      id: location.id,
      title: location.title,
      desc: location.desc,
      extendedDesc: location.extendedDesc || '',
      match: location.match,
      matchText: location.matchText,
      tags: [...location.tags],
      lat: location.lat,
      lng: location.lng,
      img: location.img,
      videos: [...location.videos],
      foodOptions: [...location.foodOptions],
      activities: [...location.activities],
      season: 'Лето',
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    console.log('Saving:', editForm);
    setIsEditing(false);
    setEditForm(null);
    setSelectedLocation(null);
    setShowNewForm(false);
  };

  const toggleTag = (tag: string) => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      tags: editForm.tags.includes(tag)
        ? editForm.tags.filter(t => t !== tag)
        : [...editForm.tags, tag]
    });
  };

  const addFoodOption = () => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      foodOptions: [...editForm.foodOptions, { id: `food-${Date.now()}`, name: '', icon: '🍽️', places: [] }]
    });
  };

  const updateFoodOption = (index: number, field: keyof FoodOption, value: any) => {
    if (!editForm) return;
    const newFoodOptions = [...editForm.foodOptions];
    newFoodOptions[index] = { ...newFoodOptions[index], [field]: value };
    setEditForm({ ...editForm, foodOptions: newFoodOptions });
  };

  const removeFoodOption = (index: number) => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      foodOptions: editForm.foodOptions.filter((_, i) => i !== index)
    });
  };

  const addActivity = () => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      activities: [...editForm.activities, { id: `act-${Date.now()}`, name: '', icon: '🏃', description: '' }]
    });
  };

  const updateActivity = (index: number, field: keyof ActivityOption, value: any) => {
    if (!editForm) return;
    const newActivities = [...editForm.activities];
    newActivities[index] = { ...newActivities[index], [field]: value };
    setEditForm({ ...editForm, activities: newActivities });
  };

  const removeActivity = (index: number) => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      activities: editForm.activities.filter((_, i) => i !== index)
    });
  };

  const SectionHeader = ({ id, icon: Icon, title, description }: { 
    id: string; 
    icon: any; 
    title: string; 
    description: string;
  }) => (
    <button
      onClick={() => setExpandedSection(expandedSection === id ? null : id)}
      className="w-full flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/20 hover:bg-white/15 transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="text-left">
          <h3 className="font-bold text-white text-base">{title}</h3>
          <p className="text-xs text-white/60">{description}</p>
        </div>
      </div>
      <ChevronDown className={`w-5 h-5 text-white/60 transition-transform ${expandedSection === id ? 'rotate-180' : ''}`} />
    </button>
  );

  const FormField = ({ label, description, children }: { 
    label: string; 
    description: string; 
    children: React.ReactNode 
  }) => (
    <div className="space-y-2">
      <label className="block">
        <span className="font-bold text-white text-sm">{label}</span>
        <p className="text-xs text-white/50 mt-0.5">{description}</p>
      </label>
      {children}
    </div>
  );

  if (isEditing && editForm) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-black/80 p-4 overflow-y-auto"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="max-w-3xl mx-auto rounded-3xl bg-gradient-to-br from-purple-900/95 to-indigo-900/95 p-6 my-4 border border-white/20 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white">
              {showNewForm ? 'Новая локация' : `Редактирование: ${selectedLocation?.title}`}
            </h2>
            <button 
              onClick={() => { setIsEditing(false); setEditForm(null); setSelectedLocation(null); setShowNewForm(false); }}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="space-y-4">
            <SectionHeader 
              id="basic" 
              icon={Info}
              title="Основная информация"
              description="Название, описание и процент совпадения"
            />
            <AnimatePresence>
              {expandedSection === 'basic' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 pl-4 border-l-2 border-white/20"
                >
                  <FormField 
                    label="Название места" 
                    description="Полное название туристической локации (например: 'Винодельня Скалистый Берег')"
                  >
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full p-3 bg-white/15 border border-white/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                      placeholder="Введите название места"
                    />
                  </FormField>

                  <FormField 
                    label="Краткое описание" 
                    description="Короткое описание для карточки (1-2 предложения, видна сразу под названием)"
                  >
                    <textarea
                      value={editForm.desc}
                      onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                      className="w-full p-3 bg-white/15 border border-white/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400 resize-none h-24"
                      placeholder="Опишите место в 1-2 предложениях"
                    />
                  </FormField>

                  <FormField 
                    label="Развёрнутое описание" 
                    description="Подробное описание для блока 'Подробнее' в модальном окне"
                  >
                    <textarea
                      value={editForm.extendedDesc}
                      onChange={(e) => setEditForm({ ...editForm, extendedDesc: e.target.value })}
                      className="w-full p-3 bg-white/15 border border-white/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400 resize-none h-32"
                      placeholder="Расскажите подробнее о месте, его истории, особенностях..."
                    />
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField 
                      label="Процент совпадения" 
                      description="Показывается в правом верхнем углу карточки (0-100%)"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={editForm.match}
                          onChange={(e) => setEditForm({ ...editForm, match: parseInt(e.target.value) })}
                          className="flex-1 accent-purple-500"
                        />
                        <span className="w-12 h-10 bg-white/15 border border-white/30 rounded-xl flex items-center justify-center font-bold text-white">
                          {editForm.match}%
                        </span>
                      </div>
                    </FormField>

                    <FormField 
                      label="Текст совпадения" 
                      description="Текст под процентом (например: 'Идеально для вас и друга')"
                    >
                      <input
                        type="text"
                        value={editForm.matchText}
                        onChange={(e) => setEditForm({ ...editForm, matchText: e.target.value })}
                        className="w-full p-3 bg-white/15 border border-white/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                        placeholder="Например: Идеально для пары"
                      />
                    </FormField>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <SectionHeader 
              id="tags" 
              icon={Tag}
              title="Для кого"
              description="Выберите категории посетителей, которым подходит это место"
            />
            <AnimatePresence>
              {expandedSection === 'tags' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pl-4 border-l-2 border-white/20"
                >
                  <p className="text-xs text-white/50 mb-3">Выберите один или несколько тегов</p>
                  <div className="flex flex-wrap gap-2">
                    {FIGHTER_TAGS.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className={`px-4 py-2 rounded-full border-2 transition-all ${
                          editForm.tags.includes(tag.id)
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-white/50 text-white'
                            : 'bg-white/10 border-white/30 text-white/80 hover:bg-white/20'
                        }`}
                      >
                        <span className="mr-2">{tag.icon}</span>
                        {tag.id}
                        {editForm.tags.includes(tag.id) && <Check className="inline w-4 h-4 ml-2" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <SectionHeader 
              id="food" 
              icon={Wine}
              title="Еда и напитки"
              description="Категории еды/напитков и конкретные блюда/места"
            />
            <AnimatePresence>
              {expandedSection === 'food' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pl-4 border-l-2 border-white/20 space-y-4"
                >
                  <p className="text-xs text-white/50">Добавьте категории еды (например: Вино, Закуски, Ресторан) и укажите конкретные позиции</p>
                  
                  {editForm.foodOptions.map((food, index) => (
                    <div key={food.id} className="bg-white/10 rounded-xl p-4 space-y-3 border border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white/60">Категория {index + 1}</span>
                        <button 
                          onClick={() => removeFoodOption(index)}
                          className="p-1 bg-red-500/30 rounded-full hover:bg-red-500/50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-300" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-white/50">Иконка</label>
                          <input
                            type="text"
                            value={food.icon}
                            onChange={(e) => updateFoodOption(index, 'icon', e.target.value)}
                            className="w-full p-2 bg-white/15 border border-white/30 rounded-lg text-white text-center text-xl"
                            placeholder="🍷"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs text-white/50">Название категории</label>
                          <input
                            type="text"
                            value={food.name}
                            onChange={(e) => updateFoodOption(index, 'name', e.target.value)}
                            className="w-full p-2 bg-white/15 border border-white/30 rounded-lg text-white"
                            placeholder="Например: Дегустация вин"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-white/50">Конкретные позиции (через запятую)</label>
                        <input
                          type="text"
                          value={food.places?.join(', ') || ''}
                          onChange={(e) => updateFoodOption(index, 'places', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                          className="w-full p-2 bg-white/15 border border-white/30 rounded-lg text-white"
                          placeholder="Красное сухое, Белое полусладкое"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={addFoodOption}
                    className="w-full p-3 bg-white/10 border-2 border-dashed border-white/30 rounded-xl text-white/80 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Добавить категорию еды
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <SectionHeader 
              id="activities" 
              icon={Gamepad2}
              title="Активности"
              description="Чем гости могут заняться на территории"
            />
            <AnimatePresence>
              {expandedSection === 'activities' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pl-4 border-l-2 border-white/20 space-y-4"
                >
                  <p className="text-xs text-white/50">Добавьте активности с описанием (например: Экскурсия по винодельне, Прогулка по виноградникам)</p>
                  
                  {editForm.activities.map((activity, index) => (
                    <div key={activity.id} className="bg-white/10 rounded-xl p-4 space-y-3 border border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white/60">Активность {index + 1}</span>
                        <button 
                          onClick={() => removeActivity(index)}
                          className="p-1 bg-red-500/30 rounded-full hover:bg-red-500/50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-300" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-white/50">Иконка</label>
                          <input
                            type="text"
                            value={activity.icon}
                            onChange={(e) => updateActivity(index, 'icon', e.target.value)}
                            className="w-full p-2 bg-white/15 border border-white/30 rounded-lg text-white text-center text-xl"
                            placeholder="🏃"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs text-white/50">Название активности</label>
                          <input
                            type="text"
                            value={activity.name}
                            onChange={(e) => updateActivity(index, 'name', e.target.value)}
                            className="w-full p-2 bg-white/15 border border-white/30 rounded-lg text-white"
                            placeholder="Например: Экскурсия по винодельне"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-white/50">Описание (необязательно)</label>
                        <input
                          type="text"
                          value={activity.description || ''}
                          onChange={(e) => updateActivity(index, 'description', e.target.value)}
                          className="w-full p-2 bg-white/15 border border-white/30 rounded-lg text-white"
                          placeholder="Краткое описание активности"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={addActivity}
                    className="w-full p-3 bg-white/10 border-2 border-dashed border-white/30 rounded-xl text-white/80 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Добавить активность
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <SectionHeader 
              id="media" 
              icon={Image}
              title="Фото и видео"
              description="Изображение карточки и ссылки на видео"
            />
            <AnimatePresence>
              {expandedSection === 'media' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pl-4 border-l-2 border-white/20 space-y-4"
                >
                  <FormField 
                    label="URL изображения" 
                    description="Ссылка на главное фото места (рекомендуемый размер: 800x600px)"
                  >
                    <input
                      type="text"
                      value={editForm.img}
                      onChange={(e) => setEditForm({ ...editForm, img: e.target.value })}
                      className="w-full p-3 bg-white/15 border border-white/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                      placeholder="/images/1.jpg"
                    />
                  </FormField>

                  <FormField 
                    label="Видео YouTube" 
                    description="Ссылка на YouTube видео (например: https://www.youtube.com/embed/VIDEO_ID)"
                  >
                    <input
                      type="text"
                      value={editForm.videos[0] || ''}
                      onChange={(e) => setEditForm({ ...editForm, videos: [e.target.value] })}
                      className="w-full p-3 bg-white/15 border border-white/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                      placeholder="https://www.youtube.com/embed/..."
                    />
                  </FormField>
                </motion.div>
              )}
            </AnimatePresence>

            <SectionHeader 
              id="location" 
              icon={MapPin}
              title="Расположение на карте"
              description="Координаты для отображения на карте"
            />
            <AnimatePresence>
              {expandedSection === 'location' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pl-4 border-l-2 border-white/20"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField 
                      label="Широта (Latitude)" 
                      description="Координата Y на карте"
                    >
                      <input
                        type="number"
                        step="0.001"
                        value={editForm.lat}
                        onChange={(e) => setEditForm({ ...editForm, lat: parseFloat(e.target.value) })}
                        className="w-full p-3 bg-white/15 border border-white/30 rounded-xl text-white"
                        placeholder="44.6"
                      />
                    </FormField>
                    <FormField 
                      label="Долгота (Longitude)" 
                      description="Координата X на карте"
                    >
                      <input
                        type="number"
                        step="0.001"
                        value={editForm.lng}
                        onChange={(e) => setEditForm({ ...editForm, lng: parseFloat(e.target.value) })}
                        className="w-full p-3 bg-white/15 border border-white/30 rounded-xl text-white"
                        placeholder="38.0"
                      />
                    </FormField>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <SectionHeader 
              id="season" 
              icon={Calendar}
              title="Сезонность"
              description="В какое время года лучше всего посещать"
            />
            <AnimatePresence>
              {expandedSection === 'season' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pl-4 border-l-2 border-white/20"
                >
                  <div className="flex flex-wrap gap-2">
                    {SEASONS.map((season) => (
                      <button
                        key={season}
                        onClick={() => setEditForm({ ...editForm, season })}
                        className={`px-4 py-2 rounded-full border-2 transition-all ${
                          editForm.season === season
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 border-white/50 text-white'
                            : 'bg-white/10 border-white/30 text-white/80 hover:bg-white/20'
                        }`}
                      >
                        {season}
                        {editForm.season === season && <Check className="inline w-4 h-4 ml-2" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-white/20">
            <button
              onClick={() => { setIsEditing(false); setEditForm(null); setSelectedLocation(null); setShowNewForm(false); }}
              className="flex-1 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-all"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Сохранить
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-black mb-8 text-white text-glass-shadow"
      >
        Кабинет Владельца
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: MapPin, value: LOCATIONS.length, label: 'Всего локаций', gradient: 'from-purple-500 to-pink-500' },
          { icon: Users, value: '142', label: 'Гостей в маршрутах', gradient: 'from-blue-500 to-cyan-500' },
          { icon: Heart, value: '89', label: 'Добавили в избранное', gradient: 'from-pink-500 to-red-500' },
          { icon: Sparkles, value: '12', label: 'Сгенерировано маршрутов', gradient: 'from-green-500 to-emerald-500' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5 flex flex-col items-center text-center gap-2"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-black text-white">{stat.value}</span>
            <span className="text-sm text-white/70 font-medium">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-hero p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-white">Управление локациями</h2>
            <p className="text-sm text-white/60 mt-1">Редактируйте информацию о ваших туристических местах</p>
          </div>
          <button
            onClick={() => {
              setEditForm(createEmptyForm());
              setShowNewForm(true);
              setIsEditing(true);
            }}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Новая локация
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LOCATIONS.map((location) => (
            <motion.div
              key={location.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all"
            >
              <div className="flex gap-4">
                <img 
                  src={location.img} 
                  alt={location.title}
                  className="w-24 h-24 rounded-xl object-cover border border-white/20"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white text-lg">{location.title}</h3>
                      <span className="inline-block mt-1 px-3 py-1 bg-green-500/30 text-green-300 text-xs font-bold rounded-full">
                        {location.match}% совпадение
                      </span>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm mt-2 line-clamp-2">{location.desc}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {location.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs bg-white/20 px-2 py-1 rounded-full text-white/80">
                        {tag}
                      </span>
                    ))}
                    {location.tags.length > 3 && (
                      <span className="text-xs text-white/50">+{location.tags.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleEdit(location)}
                className="w-full mt-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Редактировать
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

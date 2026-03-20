import type { OnboardingCard, Fighter, Location } from '../types';

export const ONBOARDING_CARDS: OnboardingCard[] = [
  { id: 1, text: 'Любишь ли ты вино и винодельни?', img: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80' },
  { id: 2, text: 'Нравятся долгие пешие прогулки в горах?', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80' },
  { id: 3, text: 'Интересуют локальные фермы и сыроварни?', img: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=600&q=80' },
  { id: 4, text: 'Хочешь посетить древние дольмены?', img: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&w=600&q=80' },
  { id: 5, text: 'Обожаешь экстремальный спорт и джиппинг?', img: 'https://images.unsplash.com/photo-1519981593452-666cf05569a9?auto=format&fit=crop&w=600&q=80' },
  { id: 6, text: 'Мечтаешь о спокойном отдыхе на безлюдном пляже?', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
  { id: 7, text: 'Интересна история и казачьи станицы?', img: 'https://images.unsplash.com/photo-1590845947698-8924d7409b56?auto=format&fit=crop&w=600&q=80' },
  { id: 8, text: 'Любишь гастро-туры и высокую кухню?', img: 'https://images.unsplash.com/photo-1414235077428-338988a2e8c0?auto=format&fit=crop&w=600&q=80' },
];

export const FIGHTERS: Fighter[] = [
  { id: 'me', name: 'Я', icon: '👤', color: 'bg-zelda-blue' },
  { id: 'partner', name: 'Партнёр', icon: '❤️', color: 'bg-red-500' },
  { id: 'mom', name: 'Мама', icon: '👩', color: 'bg-pink-400' },
  { id: 'dad', name: 'Папа', icon: '👨', color: 'bg-blue-400' },
  { id: 'grandma', name: 'Бабушка', icon: '👵', color: 'bg-zelda-purple' },
  { id: 'grandpa', name: 'Дедушка', icon: '👴', color: 'bg-amber-600' },
  { id: 'daughter', name: 'Дочь', icon: '👧', color: 'bg-rose-400' },
  { id: 'son', name: 'Сын', icon: '👦', color: 'bg-sky-400' },
  { id: 'kids', name: 'Дети', icon: '🧒', color: 'bg-green-400' },
  { id: 'friend', name: 'Друг', icon: '🤘', color: 'bg-zelda-orange' },
  { id: 'friends', name: 'Друзья', icon: '👫', color: 'bg-teal-400' },
  { id: 'colleagues', name: 'Коллеги', icon: '💼', color: 'bg-gray-500' },
  { id: 'dog', name: 'Собака', icon: '🐕', color: 'bg-zelda-gold' },
  { id: 'cat', name: 'Кот', icon: '🐈', color: 'bg-yellow-600' },
  { id: 'pet', name: 'Другой питомец', icon: '🐾', color: 'bg-lime-400' },
];

export const LOCATIONS: Location[] = [
  {
    id: 1,
    title: 'Винодельня "Скалистый Берег"',
    desc: 'Гравитационная винодельня с космической архитектурой и панорамным видом на море.',
    match: 96,
    matchText: 'Идеально для вас и друга',
    tags: ['Партнёр', 'Друг', 'Бабушка'],
    lat: 44.833,
    lng: 37.316,
    img: 'https://images.unsplash.com/photo-1566443280617-35db331c54fb?auto=format&fit=crop&w=600&q=80',
    videos: ['https://www.youtube.com/embed/dQw4w9WgXcQ']
  },
  {
    id: 2,
    title: 'Ферма Экзархо',
    desc: 'Эко-комплекс в горах Мацесты. Фермерские продукты, лошади, воздушные шары.',
    match: 92,
    matchText: 'Подходит детям на 100%',
    tags: ['Дети', 'Сын', 'Дочь', 'Друг'],
    lat: 43.583,
    lng: 39.816,
    img: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=600&q=80',
    videos: ['https://www.youtube.com/embed/dQw4w9WgXcQ']
  },
  {
    id: 3,
    title: 'Долина Лотосов',
    desc: 'Уникальное место на Тамани, где цветут индийские лотосы.',
    match: 88,
    matchText: 'Понравится маме',
    tags: ['Мама', 'Бабушка', 'Дочь', 'Партнёр'],
    lat: 45.233,
    lng: 37.216,
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    videos: []
  },
  {
    id: 4,
    title: 'Кипарисовое озеро',
    desc: 'Озеро Сукко с растущими прямо в воде болотными кипарисами.',
    match: 85,
    matchText: 'Отличное место для фото',
    tags: ['Партнёр', 'Друг', 'Дочь', 'Сын'],
    lat: 44.810,
    lng: 37.440,
    img: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&w=600&q=80',
    videos: []
  },
  {
    id: 5,
    title: 'Винодельня Гай-Кодзор',
    desc: 'Современная архитектура и потрясающие виды на горы. Дегустация локальных вин.',
    match: 95,
    matchText: 'Идеально для любителей вина',
    tags: ['Партнёр', 'Друг', 'Друзья', 'Коллеги'],
    lat: 44.8361,
    lng: 37.4394,
    img: 'https://images.unsplash.com/photo-1596178060671-7a80fc80b6ce?auto=format&fit=crop&w=600&q=80',
    videos: []
  },
  {
    id: 6,
    title: 'Скала Парус',
    desc: 'Уникальный памятник природы на берегу Черного моря.',
    match: 80,
    matchText: 'Красивые фото обеспечены',
    tags: ['Мама', 'Бабушка', 'Друг', 'Дочь'],
    lat: 44.4386,
    lng: 38.1844,
    img: 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?auto=format&fit=crop&w=600&q=80',
    videos: []
  },
  {
    id: 7,
    title: 'Атамань',
    desc: 'Этнографический комплекс, рассказывающий о жизни кубанских казаков.',
    match: 82,
    matchText: 'Погружение в историю',
    tags: ['Мама', 'Папа', 'Бабушка', 'Дедушка', 'Дети'],
    lat: 45.2167,
    lng: 36.6333,
    img: 'https://images.unsplash.com/photo-1590845947698-8924d7409b56?auto=format&fit=crop&w=600&q=80',
    videos: []
  },
  {
    id: 8,
    title: 'Гуамское ущелье',
    desc: 'Узкоколейка среди отвесных скал и реликтовых лесов. Захватывает дух.',
    match: 90,
    matchText: 'Для любителей природы',
    tags: ['Папа', 'Дедушка', 'Сын', 'Друг', 'Друзья'],
    lat: 44.2269,
    lng: 39.9031,
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    videos: []
  }
];

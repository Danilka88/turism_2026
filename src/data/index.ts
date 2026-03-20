import type { OnboardingCard, Fighter, Location } from '../types';

export const ONBOARDING_CARDS: OnboardingCard[] = [
  { id: 1, text: 'Любишь ли ты вино и винодельни?', img: '/images/1.jpg' },
  { id: 2, text: 'Нравятся долгие пешие прогулки в горах?', img: '/images/2.jpg' },
  { id: 3, text: 'Интересуют локальные фермы и сыроварни?', img: '/images/3.jpg' },
  { id: 4, text: 'Хочешь посетить древние дольмены?', img: '/images/4.jpg' },
  { id: 5, text: 'Обожаешь экстремальный спорт и джиппинг?', img: '/images/5.jpg' },
  { id: 6, text: 'Мечтаешь о спокойном отдыхе на безлюдном пляже?', img: '/images/6.jpg' },
  { id: 7, text: 'Интересна история и казачьи станицы?', img: '/images/7.jpg' },
  { id: 8, text: 'Любишь гастро-туры и высокую кухню?', img: '/images/8.jpg' },
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
    extendedDesc: 'Винодельня «Скалистый берег» — уникальное место на Кубани, где инновации встречаются с традициями виноделия.',
    match: 96,
    matchText: 'Идеально для вас и друга',
    tags: ['Партнёр', 'Друг', 'Бабушка'],
    lat: 44.833,
    lng: 37.316,
    img: '/images/9.jpg',
    videos: ['https://www.youtube.com/embed/ZJGzPnKKo_k'],
    foodOptions: [
      { id: 'degustation', name: 'Дегустация вин', icon: '🍷', places: ['Красное сухое', 'Белое полусладкое', 'Розовое'] },
      { id: 'local', name: 'Местные закуски', icon: '🧀', places: ['Сырная тарелка', 'Мясная нарезка', 'Оливки'] },
      { id: 'restaurant', name: 'Ресторан', icon: '🍽️', places: ['Средиземноморская кухня', 'Авторские блюда'] },
    ],
    activities: [
      { id: 'tour', name: 'Экскурсия по винодельне', icon: '🏭', description: 'Посещение производства и погребов' },
      { id: 'degust', name: 'Дегустация 5 вин', icon: '🍷', description: 'Под руководством сомелье' },
      { id: 'walk', name: 'Прогулка по виноградникам', icon: '🚶', description: 'С видом на море' },
    ]
  },
  {
    id: 2,
    title: 'Ферма Экзархо',
    desc: 'Эко-комплекс в горах Мацесты. Фермерские продукты, лошади, воздушные шары.',
    extendedDesc: 'Ферма Экзархо — настоящий эко-оазис в горах Большого Сочи.',
    match: 92,
    matchText: 'Подходит детям на 100%',
    tags: ['Дети', 'Сын', 'Дочь', 'Друг'],
    lat: 43.583,
    lng: 39.816,
    img: '/images/3.jpg',
    videos: ['https://www.youtube.com/embed/wFV9x0J8_2U'],
    foodOptions: [
      { id: 'farm', name: 'Фермерские продукты', icon: '🥬', places: ['Овощи с грядки', 'Молочные продукты', 'Мёд'] },
      { id: 'horse', name: 'Угощение лошадей', icon: '🥕', places: ['Морковь', 'Яблоки', 'Сахар'] },
      { id: 'bbq', name: 'Блюда на углях', icon: '🍖', places: ['Шашлык', 'Люля-кебаб'] },
    ],
    activities: [
      { id: 'horses', name: 'Конные прогулки', icon: '🐎', description: 'Для взрослых и детей' },
      { id: 'balloon', name: 'Полёт на воздушном шаре', icon: '🎈', description: 'Над горами Сочи' },
      { id: 'master', name: 'Мастер-класс', icon: '🧀', description: 'Сыроварение, хлебопечение' },
      { id: 'zoo', name: 'Мини-зоопарк', icon: '🦚', description: 'Кормление животных' },
    ]
  },
  {
    id: 3,
    title: 'Долина Лотосов',
    desc: 'Уникальное место на Тамани, где цветут индийские лотосы.',
    extendedDesc: 'Долина Лотосов на Таманском полуострове — настоящее чудо природы.',
    match: 88,
    matchText: 'Понравится маме',
    tags: ['Мама', 'Бабушка', 'Дочь', 'Партнёр'],
    lat: 45.233,
    lng: 37.216,
    img: '/images/2.jpg',
    videos: ['https://www.youtube.com/embed/9Y1bX5KQ7g4'],
    foodOptions: [
      { id: 'fishing', name: 'Рыба на углях', icon: '🐟', places: ['Тарань', 'Бычки', 'Карась'] },
      { id: 'picnic', name: 'Пикник на природе', icon: '🧺', places: ['На берегу лимана'] },
    ],
    activities: [
      { id: 'boat', name: 'Лодочная прогулка', icon: '🚣', description: 'Среди цветущих лотосов' },
      { id: 'photo', name: 'Фотосессия', icon: '📸', description: 'На фоне лотосов' },
      { id: 'volcano', name: 'Грязевые вулканы', icon: '🌋', description: 'Рядом с долиной' },
    ]
  },
  {
    id: 4,
    title: 'Кипарисовое озеро',
    desc: 'Озеро Сукко с растущими прямо в воде болотными кипарисами.',
    extendedDesc: 'Кипарисовое озеро (Сукко) — одно из самых фотогеничных мест Краснодарского края.',
    match: 85,
    matchText: 'Отличное место для фото',
    tags: ['Партнёр', 'Друг', 'Дочь', 'Сын'],
    lat: 44.810,
    lng: 37.440,
    img: '/images/4.jpg',
    videos: ['https://www.youtube.com/embed/7Y0E6xP4v9g'],
    foodOptions: [
      { id: 'cafe', name: 'Кафе на берегу', icon: '☕', places: ['Кофе, чай', 'Выпечка'] },
      { id: 'grill', name: 'Мангальная зона', icon: '🔥', places: ['Шашлыки', 'Овощи гриль'] },
    ],
    activities: [
      { id: 'meditation', name: 'Медитация', icon: '🧘', description: 'На берегу озера' },
      { id: 'photo', name: 'Фотосессия', icon: '📸', description: 'С кипарисами в воде' },
      { id: 'spa', name: 'Грязевые источники', icon: '🛁', description: 'Рядом с озером' },
    ]
  },
  {
    id: 5,
    title: 'Винодельня Гай-Кодзор',
    desc: 'Современная архитектура и потрясающие виды на горы. Дегустация локальных вин.',
    extendedDesc: 'Винодельня Гай-Кодзор — винодельня семьи Трубецких с более чем столетней историей.',
    match: 95,
    matchText: 'Идеально для любителей вина',
    tags: ['Партнёр', 'Друг', 'Друзья', 'Коллеги'],
    lat: 44.8361,
    lng: 37.4394,
    img: '/images/10.jpg',
    videos: ['https://www.youtube.com/embed/GnMVL6Q8pFc'],
    foodOptions: [
      { id: 'degust', name: 'Дегустация', icon: '🍷', places: ['Авторские вина', 'Марочные'] },
      { id: 'pairing', name: 'Вино + сыр', icon: '🧀', places: ['Местные сыры'] },
      { id: 'restaurant', name: 'Ресторан', icon: '🍽️', places: ['Блюда к вину'] },
    ],
    activities: [
      { id: 'tour', name: 'Экскурсия в погреба', icon: '🏰', description: 'Подземные винные погреба' },
      { id: 'degust', name: 'Премиум-дегустация', icon: '🏆', description: '7 лучших вин' },
      { id: 'walk', name: 'Террасная прогулка', icon: '🌿', description: 'С видом на горы' },
    ]
  },
  {
    id: 6,
    title: 'Скала Парус',
    desc: 'Уникальный памятник природы на берегу Черного моря.',
    extendedDesc: 'Скала Парус — один из символов Анапы и памятник природы федерального значения.',
    match: 80,
    matchText: 'Красивые фото обеспечены',
    tags: ['Мама', 'Бабушка', 'Друг', 'Дочь'],
    lat: 44.4386,
    lng: 38.1844,
    img: '/images/11.jpg',
    videos: ['https://www.youtube.com/embed/Lk3A8vJQw9g'],
    foodOptions: [
      { id: 'beach', name: 'Кафе на пляже', icon: '🏖️', places: ['Шаурма', 'Мороженое', 'Напитки'] },
      { id: 'local', name: 'Хта买个', icon: '🥘', places: ['Хинкали', 'Хачапури'] },
    ],
    activities: [
      { id: 'climb', name: 'Подъём на скалу', icon: '⛰️', description: 'Панорамный вид' },
      { id: 'photo', name: 'Фото на закате', icon: '📸', description: 'Красивые кадры' },
      { id: 'beach', name: 'Пляжный отдых', icon: '🏊', description: 'Рядом с Анапой' },
    ]
  },
  {
    id: 7,
    title: 'Атамань',
    desc: 'Этнографический комплекс, рассказывающий о жизни кубанских казаков.',
    extendedDesc: 'Этнографический комплекс «Атамань» — это путешествие в прошлое Кубани.',
    match: 82,
    matchText: 'Погружение в историю',
    tags: ['Мама', 'Папа', 'Бабушка', 'Дедушка', 'Дети'],
    lat: 45.2167,
    lng: 36.6333,
    img: '/images/7.jpg',
    videos: ['https://www.youtube.com/embed/3r5WJP9KQ7s'],
    foodOptions: [
      { id: 'kazakh', name: 'Казачья кухня', icon: '🥟', places: ['Кубанский борщ', 'Лепёшки', 'Вареники'] },
      { id: 'bbq', name: 'Казачий шашлык', icon: '🍖', places: ['На углях'] },
      { id: 'bread', name: 'Свежий хлеб', icon: '🍞', places: ['Из печи'] },
    ],
    activities: [
      { id: 'master', name: 'Мастер-классы', icon: '🔨', description: 'Ковка, гончарка, ткачество' },
      { id: 'horse', name: 'Конное шоу', icon: '🐎', description: 'Казачьи традиции' },
      { id: 'tour', name: 'Экскурсия', icon: '🏘️', description: 'По станице' },
      { id: 'show', name: 'Развлечения', icon: '🎭', description: 'Казачьи песни и танцы' },
    ]
  },
  {
    id: 8,
    title: 'Гуамское ущелье',
    desc: 'Узкоколейка среди отвесных скал и реликтовых лесов. Захватывает дух.',
    extendedDesc: 'Гуамское ущелье — жемчужина Апшеронского района.',
    match: 90,
    matchText: 'Для любителей природы',
    tags: ['Папа', 'Дедушка', 'Сын', 'Друг', 'Друзья'],
    lat: 44.2269,
    lng: 39.9031,
    img: '/images/2.jpg',
    videos: ['https://www.youtube.com/embed/R7vNLQmQ9pE'],
    foodOptions: [
      { id: 'picnic', name: 'Пикник', icon: '🧺', places: ['С собой в ущелье'] },
      { id: 'cafe', name: 'Кафе на въезде', icon: '☕', places: ['Чай, кофе, выпечка'] },
    ],
    activities: [
      { id: 'hike', name: 'Пеший маршрут', icon: '🥾', description: '2 км по ущелью' },
      { id: 'rope', name: 'Верёвочный парк', icon: '🪢', description: 'Для новичков и профи' },
      { id: 'bridge', name: 'Подвесные мосты', icon: '🌉', description: 'Над ущельем' },
      { id: 'climbing', name: 'Скалолазание', icon: '🧗', description: 'Для опытных' },
    ]
  }
];

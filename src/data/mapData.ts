export interface MapLocation {
  id: number;
  title: string;
  description: string;
  lat: number;
  lng: number;
  category: 'beach' | 'mountain' | 'wine' | 'nature' | 'culture' | 'city' | 'spa' | 'family';
  rating: number;
}

export const MAP_LOCATIONS: MapLocation[] = [
  // Побережье Чёрного моря (от Новороссийска до Адлера)
  { id: 1, title: 'Анапа', description: 'Центральный пляж, песок, семья', lat: 44.895, lng: 37.323, category: 'beach', rating: 4.8 },
  { id: 2, title: 'Геленджик', description: 'Набережная, аквапарк, катера', lat: 44.562, lng: 38.078, category: 'beach', rating: 4.7 },
  { id: 3, title: 'Кабардинка', description: 'Голубые бухты, тихий пляж', lat: 44.633, lng: 37.950, category: 'beach', rating: 4.6 },
  { id: 4, title: 'Дивноморское', description: 'Фанагорийская коса, дельфины', lat: 44.502, lng: 38.098, category: 'beach', rating: 4.5 },
  { id: 5, title: 'Джемете', description: 'Песчаные дюны, детский курорт', lat: 44.832, lng: 37.385, category: 'beach', rating: 4.7 },
  { id: 6, title: 'Благовещенская', description: 'Витязево, длинный пляж', lat: 45.008, lng: 37.415, category: 'beach', rating: 4.4 },
  { id: 7, title: 'Сукко', description: 'Кипарисовое озеро, грязевые вулканы', lat: 44.808, lng: 37.448, category: 'beach', rating: 4.6 },
  { id: 8, title: 'Абрау-Дюрсо', description: 'Озеро, винодельни, дегустации', lat: 44.831, lng: 37.321, category: 'wine', rating: 4.9 },
  { id: 9, title: 'Новороссийск', description: 'Военная гавань, Суджукская коса', lat: 44.724, lng: 37.773, category: 'city', rating: 4.3 },
  { id: 10, title: 'Сочи-Центр', description: 'Ривьера, морвокзал, парки', lat: 43.595, lng: 39.723, category: 'city', rating: 4.6 },
  { id: 11, title: 'Адлер', description: 'Курортный город, Олимппарк', lat: 43.427, lng: 39.914, category: 'city', rating: 4.4 },
  { id: 12, title: 'Лоо', description: 'Аквапарк, дельфинарий, тихо', lat: 43.728, lng: 39.585, category: 'family', rating: 4.5 },
  { id: 13, title: 'Хоста', description: 'Ривьера Сочи, субтропики', lat: 43.522, lng: 39.862, category: 'beach', rating: 4.6 },
  { id: 14, title: 'Мацеста', description: 'Сероводородные источники, лечение', lat: 43.568, lng: 39.803, category: 'spa', rating: 4.5 },
  { id: 15, title: 'Имеретинка', description: 'Олимпийский парк, пляжи', lat: 43.410, lng: 39.955, category: 'family', rating: 4.4 },

  // Горы и Красная Поляна
  { id: 16, title: 'Красная Поляна', description: 'Горы, канатные дороги, рестораны', lat: 43.683, lng: 40.200, category: 'mountain', rating: 4.8 },
  { id: 17, title: 'Роза Хутор', description: 'Курорт, смотровая, высоты', lat: 43.630, lng: 40.280, category: 'mountain', rating: 4.9 },
  { id: 18, title: 'Гора Аибга', description: 'Горнолыжный курорт, панорамы', lat: 43.600, lng: 40.350, category: 'mountain', rating: 4.7 },
  { id: 19, title: 'Горки Город', description: 'Курорт, колесо обозрения', lat: 43.655, lng: 40.250, category: 'mountain', rating: 4.6 },
  { id: 20, title: 'Эстосадок', description: 'Тихий посёлок, природа', lat: 43.660, lng: 40.220, category: 'mountain', rating: 4.5 },
  { id: 21, title: 'Медовеевка', description: 'Водопады, смотровая площадка', lat: 43.698, lng: 40.180, category: 'nature', rating: 4.7 },
  { id: 22, title: 'Пслух', description: 'Ущелье, водопады, трекинг', lat: 43.745, lng: 40.150, category: 'nature', rating: 4.6 },
  { id: 23, title: 'Гора Ахун', description: '663м, смотровая башня, 360°', lat: 43.517, lng: 39.867, category: 'mountain', rating: 4.8 },
  { id: 24, title: 'Головинка', description: 'Каньон, водопады, пещеры', lat: 43.852, lng: 39.608, category: 'nature', rating: 4.5 },

  // Винодельни и фермы
  { id: 25, title: 'Фанагория', description: 'Крупнейшая винодельня, дегустация', lat: 44.935, lng: 37.255, category: 'wine', rating: 4.8 },
  { id: 26, title: 'Винодельня Гай-Кодзор', description: 'Историческая усадьба, погреба', lat: 44.841, lng: 37.435, category: 'wine', rating: 4.9 },
  { id: 27, title: 'Шато де Талю', description: 'Французский стиль, терруар', lat: 44.850, lng: 37.280, category: 'wine', rating: 4.7 },
  { id: 28, title: 'Имение Сикоры', description: 'Авторские вина, виноградники', lat: 44.865, lng: 37.325, category: 'wine', rating: 4.6 },
  { id: 29, title: 'Скалистый Берег', description: 'Космическая архитектура, море', lat: 44.830, lng: 37.320, category: 'wine', rating: 4.9 },
  { id: 30, title: 'Абрау-Любава', description: 'Семейная винодельня, тихо', lat: 44.838, lng: 37.302, category: 'wine', rating: 4.7 },
  { id: 31, title: 'Ферма Экзархо', description: 'Эко-ферма, лошади, мастер-классы', lat: 43.583, lng: 39.816, category: 'family', rating: 4.8 },
  { id: 32, title: 'Сырная ферма', description: 'Горный сыр, дегустация', lat: 44.405, lng: 39.408, category: 'family', rating: 4.6 },

  // Природные парки и заповедники
  { id: 33, title: 'Утришский заповедник', description: 'Можжевёловые рощи, дикие пляжи', lat: 44.848, lng: 37.348, category: 'nature', rating: 4.7 },
  { id: 34, title: 'Гуамское ущелье', description: 'Узкоколейка, подвесные мосты', lat: 44.232, lng: 39.905, category: 'nature', rating: 4.8 },
  { id: 35, title: 'Волконская пещера', description: 'Подземные озёра, сталактиты', lat: 44.302, lng: 39.798, category: 'nature', rating: 4.6 },
  { id: 36, title: 'Солоники', description: 'Водопады, долина, кемпинг', lat: 44.348, lng: 39.748, category: 'nature', rating: 4.5 },
  { id: 37, title: 'Долина реки Пшада', description: 'Дольмены, река, родники', lat: 44.188, lng: 38.655, category: 'nature', rating: 4.7 },
  { id: 38, title: 'Тисо-самшитовая роща', description: 'Реликтовый лес, эндемики', lat: 43.905, lng: 39.402, category: 'nature', rating: 4.9 },
  { id: 39, title: 'Королевский грот', description: 'Пещера с озёрами, экскурсии', lat: 44.408, lng: 39.205, category: 'nature', rating: 4.5 },
  { id: 40, title: 'Бечелако', description: 'Водопад, трекинг, смотровая', lat: 43.948, lng: 39.298, category: 'nature', rating: 4.4 },

  // Культура и история
  { id: 41, title: 'Атамань', description: 'Казачья станица, мастер-классы', lat: 45.215, lng: 36.628, category: 'culture', rating: 4.8 },
  { id: 42, title: 'Краснодар', description: 'Театры, музеи, Екатерининский сквер', lat: 45.035, lng: 38.974, category: 'city', rating: 4.5 },
  { id: 43, title: 'Новороссийск', description: 'Малая земля, музей, мемориал', lat: 44.724, lng: 37.773, category: 'culture', rating: 4.6 },
  { id: 44, title: 'Темрюк', description: 'Атаман, рынок, казаки', lat: 45.268, lng: 37.385, category: 'culture', rating: 4.4 },
  { id: 45, title: 'Ейск', description: 'Порт-петровская крепость, казаки', lat: 46.728, lng: 38.278, category: 'city', rating: 4.3 },
  { id: 46, title: 'Мост через реку', description: 'Мост в Абрау, смотровая', lat: 44.843, lng: 37.318, category: 'culture', rating: 4.5 },

  // Аквапарки и развлечения
  { id: 47, title: 'Сочи Парк', description: 'Мифология, аттракционы, шоу', lat: 43.400, lng: 39.950, category: 'family', rating: 4.7 },
  { id: 48, title: 'Аквапарк Геленджик', description: 'Бермудское треугольник, горки', lat: 44.568, lng: 38.095, category: 'family', rating: 4.6 },
  { id: 49, title: 'Дельфинарий Лоо', description: 'Шоу дельфинов, морские котики', lat: 43.730, lng: 39.560, category: 'family', rating: 4.5 },
  { id: 50, title: 'Скайпарк', description: '207м, качели, смотровая площадка', lat: 43.668, lng: 40.215, category: 'family', rating: 4.9 },

  // Термальные источники и SPA
  { id: 51, title: 'Горячий Ключ', description: 'Термальные источники, грязи', lat: 44.632, lng: 39.132, category: 'spa', rating: 4.7 },
  { id: 52, title: 'Ейские источники', description: 'Минеральные воды, лечение', lat: 46.745, lng: 38.268, category: 'spa', rating: 4.6 },
  { id: 53, title: 'Водный курорт', description: 'SPA-комплекс, бассейны', lat: 44.648, lng: 39.105, category: 'spa', rating: 4.5 },
  { id: 54, title: 'Апшеронские ванны', description: 'Грязелечебница, минералка', lat: 44.452, lng: 39.735, category: 'spa', rating: 4.4 },

  // Заливы и бухты
  { id: 55, title: 'Цемесская бухта', description: 'Видовые места, прогулки', lat: 44.718, lng: 37.805, category: 'beach', rating: 4.3 },
  { id: 56, title: 'Бухта Инал', description: 'Дикий пляж, рыбалка', lat: 44.408, lng: 38.208, category: 'beach', rating: 4.5 },
  { id: 57, title: 'Парк Олимп', description: 'Парк приключений, джунгли', lat: 43.442, lng: 39.922, category: 'family', rating: 4.6 },
  { id: 58, title: 'Ледниковое озеро', description: 'Горное озеро, трекинг', lat: 43.582, lng: 40.405, category: 'nature', rating: 4.7 },
  { id: 59, title: 'Голубые озёра', description: '5 карстовых озёр, дайвинг', lat: 44.242, lng: 39.852, category: 'nature', rating: 4.8 },
  { id: 60, title: 'Ручей Безымянный', description: 'Водопады, пещеры', lat: 44.155, lng: 39.705, category: 'nature', rating: 4.5 },
  { id: 61, title: 'Грязевые вулканы', description: 'Грязевое озеро, глина', lat: 45.082, lng: 37.482, category: 'nature', rating: 4.4 },
  { id: 62, title: 'Коса Чушка', description: 'Керченский пролив, пляж', lat: 45.130, lng: 36.545, category: 'beach', rating: 4.3 },
  { id: 63, title: 'Витязево', description: 'Солёное озеро, лечебная грязь', lat: 45.005, lng: 37.442, category: 'spa', rating: 4.5 },
  { id: 64, title: 'Майкоп', description: 'Столица Адыгеи, рестораны', lat: 44.600, lng: 40.100, category: 'city', rating: 4.2 },
  { id: 65, title: 'Кавказский заповедник', description: 'Заповедная зона, медведи', lat: 44.102, lng: 39.802, category: 'nature', rating: 4.9 },
  { id: 66, title: 'Водопады Мзымты', description: 'Каньон, водопады, река', lat: 43.752, lng: 40.098, category: 'nature', rating: 4.8 },
  { id: 67, title: 'Орлёнок', description: 'Морской курорт, песок', lat: 45.052, lng: 37.402, category: 'beach', rating: 4.4 },
  { id: 68, title: 'Пиленковский пляж', description: 'Дикий пляж, скалы', lat: 44.352, lng: 38.305, category: 'beach', rating: 4.5 },
  { id: 69, title: 'Марко Поло', description: 'Винный ресторан, дегустация', lat: 44.848, lng: 37.292, category: 'wine', rating: 4.7 },
  { id: 70, title: 'Туапсе', description: 'Приморский курорт, набережная', lat: 44.105, lng: 39.072, category: 'city', rating: 4.3 },
  { id: 71, title: 'Горный воздух', description: 'Смотровая, панорама', lat: 43.682, lng: 40.258, category: 'mountain', rating: 4.8 },
  { id: 72, title: 'Пшадские водопады', description: 'Каскад водопадов, тропа', lat: 44.172, lng: 38.682, category: 'nature', rating: 4.7 },
];

export const CATEGORIES = [
  { id: 'all', label: 'Все', icon: '🗺️', color: '#667eea' },
  { id: 'beach', label: 'Пляжи', icon: '🏖️', color: '#0ea5e9' },
  { id: 'mountain', label: 'Горы', icon: '⛰️', color: '#10b981' },
  { id: 'wine', label: 'Винодельни', icon: '🍷', color: '#8b5cf6' },
  { id: 'nature', label: 'Природа', icon: '🌲', color: '#22c55e' },
  { id: 'culture', label: 'Культура', icon: '🏛️', color: '#f59e0b' },
  { id: 'city', label: 'Города', icon: '🏙️', color: '#f43f5e' },
  { id: 'spa', label: 'SPA', icon: '♨️', color: '#06b6d4' },
  { id: 'family', label: 'Семья', icon: '👨‍👩‍👧', color: '#ec4899' },
];

export const KRASNODAR_BOUNDS = {
  minLat: 43.5,
  maxLat: 46.8,
  minLng: 36.0,
  maxLng: 40.5,
};

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
  // Побережье — города находятся ВНУТРИ суши, не в море
  { id: 1, title: 'Анапа', description: 'Город, песок, семья', lat: 44.894, lng: 37.315, category: 'beach', rating: 4.8 },
  { id: 2, title: 'Геленджик', description: 'Город, набережная, катера', lat: 44.562, lng: 38.078, category: 'beach', rating: 4.7 },
  { id: 3, title: 'Кабардинка', description: 'Голубые бухты, тихий пляж', lat: 44.638, lng: 37.952, category: 'beach', rating: 4.6 },
  { id: 4, title: 'Дивноморское', description: 'Коса, дельфины, тихо', lat: 44.510, lng: 38.095, category: 'beach', rating: 4.5 },
  { id: 5, title: 'Джемете', description: 'Песчаные дюны, детский курорт', lat: 44.825, lng: 37.378, category: 'beach', rating: 4.7 },
  { id: 6, title: 'Благовещенская', description: 'Витязево, длинный пляж', lat: 45.015, lng: 37.405, category: 'beach', rating: 4.4 },
  { id: 7, title: 'Сукко', description: 'Кипарисовое озеро, вулканы', lat: 44.815, lng: 37.435, category: 'beach', rating: 4.6 },
  { id: 8, title: 'Абрау-Дюрсо', description: 'Озеро, винодельни, дегустации', lat: 44.832, lng: 37.320, category: 'wine', rating: 4.9 },
  { id: 9, title: 'Новороссийск', description: 'Военная гавань, Суджукская коса', lat: 44.724, lng: 37.773, category: 'city', rating: 4.3 },
  { id: 10, title: 'Сочи', description: 'Ривьера, морвокзал, парки', lat: 43.595, lng: 39.723, category: 'city', rating: 4.6 },
  { id: 11, title: 'Адлер', description: 'Курортный город, Олимппарк', lat: 43.427, lng: 39.914, category: 'city', rating: 4.4 },
  { id: 12, title: 'Лоо', description: 'Аквапарк, дельфинарий, тихо', lat: 43.725, lng: 39.585, category: 'family', rating: 4.5 },
  { id: 13, title: 'Хоста', description: 'Ривьера Сочи, субтропики', lat: 43.522, lng: 39.862, category: 'beach', rating: 4.6 },
  { id: 14, title: 'Мацеста', description: 'Сероводородные источники, лечение', lat: 43.565, lng: 39.803, category: 'spa', rating: 4.5 },
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
  { id: 25, title: 'Фанагория', description: 'Крупнейшая винодельня, дегустация', lat: 44.940, lng: 37.250, category: 'wine', rating: 4.8 },
  { id: 26, title: 'Винодельня Гай-Кодзор', description: 'Историческая усадьба, погреба', lat: 44.842, lng: 37.432, category: 'wine', rating: 4.9 },
  { id: 27, title: 'Шато де Талю', description: 'Французский стиль, терруар', lat: 44.852, lng: 37.280, category: 'wine', rating: 4.7 },
  { id: 28, title: 'Имение Сикоры', description: 'Авторские вина, виноградники', lat: 44.868, lng: 37.322, category: 'wine', rating: 4.6 },
  { id: 29, title: 'Скалистый Берег', description: 'Космическая архитектура, море', lat: 44.835, lng: 37.315, category: 'wine', rating: 4.9 },
  { id: 30, title: 'Абрау-Любава', description: 'Семейная винодельня, тихо', lat: 44.840, lng: 37.300, category: 'wine', rating: 4.7 },
  { id: 31, title: 'Ферма Экзархо', description: 'Эко-ферма, лошади, мастер-классы', lat: 43.580, lng: 39.816, category: 'family', rating: 4.8 },
  { id: 32, title: 'Сырная ферма', description: 'Горный сыр, дегустация', lat: 44.408, lng: 39.408, category: 'family', rating: 4.6 },

  // Природные парки и заповедники
  { id: 33, title: 'Утришский заповедник', description: 'Можжевёловые рощи, дикие пляжи', lat: 44.852, lng: 37.345, category: 'nature', rating: 4.7 },
  { id: 34, title: 'Гуамское ущелье', description: 'Узкоколейка, подвесные мосты', lat: 44.230, lng: 39.905, category: 'nature', rating: 4.8 },
  { id: 35, title: 'Волконская пещера', description: 'Подземные озёра, сталактиты', lat: 44.305, lng: 39.798, category: 'nature', rating: 4.6 },
  { id: 36, title: 'Солоники', description: 'Водопады, долина, кемпинг', lat: 44.350, lng: 39.748, category: 'nature', rating: 4.5 },
  { id: 37, title: 'Долина реки Пшада', description: 'Дольмены, река, родники', lat: 44.190, lng: 38.655, category: 'nature', rating: 4.7 },
  { id: 38, title: 'Тисо-самшитовая роща', description: 'Реликтовый лес, эндемики', lat: 43.908, lng: 39.402, category: 'nature', rating: 4.9 },
  { id: 39, title: 'Королевский грот', description: 'Пещера с озёрами, экскурсии', lat: 44.410, lng: 39.205, category: 'nature', rating: 4.5 },
  { id: 40, title: 'Бечелако', description: 'Водопад, трекинг, смотровая', lat: 43.950, lng: 39.298, category: 'nature', rating: 4.4 },

  // Культура и история
  { id: 41, title: 'Атамань', description: 'Казачья станица, мастер-классы', lat: 45.215, lng: 36.628, category: 'culture', rating: 4.8 },
  { id: 42, title: 'Краснодар', description: 'Театры, музеи, Екатерининский сквер', lat: 45.035, lng: 38.974, category: 'city', rating: 4.5 },
  { id: 43, title: 'Темрюк', description: 'Атаман, рынок, казаки', lat: 45.268, lng: 37.385, category: 'culture', rating: 4.4 },
  { id: 44, title: 'Ейск', description: 'Порт-петровская крепость, казаки', lat: 46.728, lng: 38.278, category: 'city', rating: 4.3 },
  { id: 45, title: 'Мост через реку', description: 'Мост в Абрау, смотровая', lat: 44.845, lng: 37.315, category: 'culture', rating: 4.5 },

  // Аквапарки и развлечения
  { id: 46, title: 'Сочи Парк', description: 'Мифология, аттракционы, шоу', lat: 43.400, lng: 39.950, category: 'family', rating: 4.7 },
  { id: 47, title: 'Аквапарк Геленджик', description: 'Бермудское треугольник, горки', lat: 44.570, lng: 38.090, category: 'family', rating: 4.6 },
  { id: 48, title: 'Дельфинарий Лоо', description: 'Шоу дельфинов, морские котики', lat: 43.728, lng: 39.560, category: 'family', rating: 4.5 },
  { id: 49, title: 'Скайпарк', description: '207м, качели, смотровая площадка', lat: 43.668, lng: 40.215, category: 'family', rating: 4.9 },

  // Термальные источники и SPA
  { id: 50, title: 'Горячий Ключ', description: 'Термальные источники, грязи', lat: 44.632, lng: 39.132, category: 'spa', rating: 4.7 },
  { id: 51, title: 'Ейские источники', description: 'Минеральные воды, лечение', lat: 46.745, lng: 38.268, category: 'spa', rating: 4.6 },
  { id: 52, title: 'Апшеронские ванны', description: 'Грязелечебница, минералка', lat: 44.452, lng: 39.735, category: 'spa', rating: 4.4 },
  { id: 53, title: 'Витязево', description: 'Солёное озеро, лечебная грязь', lat: 45.010, lng: 37.435, category: 'spa', rating: 4.5 },

  // Дополнительные места
  { id: 54, title: 'Цемесская бухта', description: 'Видовые места, прогулки', lat: 44.715, lng: 37.802, category: 'beach', rating: 4.3 },
  { id: 55, title: 'Бухта Инал', description: 'Дикий пляж, рыбалка', lat: 44.410, lng: 38.205, category: 'beach', rating: 4.5 },
  { id: 56, title: 'Парк Олимп', description: 'Парк приключений, джунгли', lat: 43.440, lng: 39.920, category: 'family', rating: 4.6 },
  { id: 57, title: 'Голубые озёра', description: '5 карстовых озёр, дайвинг', lat: 44.242, lng: 39.852, category: 'nature', rating: 4.8 },
  { id: 58, title: 'Ручей Безымянный', description: 'Водопады, пещеры', lat: 44.155, lng: 39.705, category: 'nature', rating: 4.5 },
  { id: 59, title: 'Грязевые вулканы', description: 'Грязевое озеро, глина', lat: 45.080, lng: 37.478, category: 'nature', rating: 4.4 },
  { id: 60, title: 'Коса Чушка', description: 'Керченский пролив, пляж', lat: 45.125, lng: 36.540, category: 'beach', rating: 4.3 },
  { id: 61, title: 'Майкоп', description: 'Столица Адыгеи, рестораны', lat: 44.600, lng: 40.100, category: 'city', rating: 4.2 },
  { id: 62, title: 'Кавказский заповедник', description: 'Заповедная зона, медведи', lat: 44.102, lng: 39.802, category: 'nature', rating: 4.9 },
  { id: 63, title: 'Водопады Мзымты', description: 'Каньон, водопады, река', lat: 43.752, lng: 40.098, category: 'nature', rating: 4.8 },
  { id: 64, title: 'Пиленковский пляж', description: 'Дикий пляж, скалы', lat: 44.355, lng: 38.302, category: 'beach', rating: 4.5 },
  { id: 65, title: 'Туапсе', description: 'Приморский курорт, набережная', lat: 44.105, lng: 39.072, category: 'city', rating: 4.3 },
  { id: 66, title: 'Ледниковое озеро', description: 'Горное озеро, трекинг', lat: 43.582, lng: 40.405, category: 'nature', rating: 4.7 },
  { id: 67, title: 'Пшадские водопады', description: 'Каскад водопадов, тропа', lat: 44.172, lng: 38.682, category: 'nature', rating: 4.7 },
  { id: 68, title: 'Орлёнок', description: 'Морской курорт, песок', lat: 45.055, lng: 37.398, category: 'beach', rating: 4.4 },
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

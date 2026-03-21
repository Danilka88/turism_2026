import type {
  OnboardingInput,
  OnboardingOutput,
  RouteMatcherInput,
  RouteMatcherOutput,
  WineScannerInput,
  WineScannerOutput,
  EmergencyRouteInput,
  EmergencyRouteOutput,
  PersonalizationInput,
  PersonalizationOutput,
  UserProfile,
} from '../types';

export interface DemoServiceConfig {
  delay?: number;
}

export class DemoService {
  private delay: number;

  constructor(config: DemoServiceConfig = {}) {
    this.delay = config.delay ?? 1500;
  }

  private async simulateDelay(): Promise<void> {
    await new Promise((r) => setTimeout(r, this.delay));
  }

  async getOnboardingProfile(input: OnboardingInput): Promise<OnboardingOutput> {
    await this.simulateDelay();

    const interestLabels: Record<number, string> = {
      1: 'Горы и природа',
      2: 'История и культура',
      3: 'Кухня и гастрономия',
      4: 'Пляжный отдых',
      5: 'Активный отдых',
      6: 'Виноделие',
      7: 'Тайны и легенды',
      8: 'Семейный отдых',
      9: 'Спортивные события',
      10: 'Ночная жизнь',
      11: 'Шоппинг',
      12: 'Спокойствие и релакс',
    };

    const likedInterests = input.selectedInterests
      .filter(i => i.liked)
      .slice(0, 5);

    const profile: UserProfile = {
      id: 'demo-user',
      interests: likedInterests.map(i => ({
        id: i.id,
        category: interestLabels[i.id] || 'Другое',
        name: interestLabels[i.id] || `Интерес ${i.id}`,
        liked: true,
        comment: i.comment,
      })),
      companions: [],
      preferences: {
        foodPreferences: [],
        noKidsMode: false,
      },
      history: {
        viewedLocations: [],
        selectedLocations: [],
        rejectedLocations: [],
        bookings: [],
      },
      travelStyle: 'explorer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      profile,
      summary: `Вы любите: ${likedInterests.map(i => interestLabels[i.id] || `Интерес ${i.id}`).join(', ')}. Ваш стиль путешествия - активный и познавательный.`,
      recommendedCategories: likedInterests.slice(0, 3).map(i => interestLabels[i.id] || 'Другое'),
    };
  }

  async matchRoutes(_input: RouteMatcherInput): Promise<RouteMatcherOutput> {
    await this.simulateDelay();

    return {
      matchedLocations: [
        { 
          id: 1, 
          title: 'Горное озеро', 
          description: 'Красивое горное озеро', 
          match: 95, 
          matchText: 'Отлично подходит',
          tags: ['природа'],
          lat: 44.5,
          lng: 38.5,
          img: '',
          videos: [],
          foodOptions: [],
          activities: [],
          matchScore: 95,
          matchReasons: ['Отлично подходит по интересам'],
        },
        { 
          id: 3, 
          title: 'Исторический центр', 
          description: 'Старинный город', 
          match: 88, 
          matchText: 'Популярное место',
          tags: ['история'],
          lat: 44.6,
          lng: 38.6,
          img: '',
          videos: [],
          foodOptions: [],
          activities: [],
          matchScore: 88,
          matchReasons: ['Популярное место'],
        },
      ],
      summary: 'Найдено 2 места по вашим интересам',
      recommendations: [
        'Лучшее время для посещения - утро',
        'Не забудьте удобную обувь',
        'Возьмите с собой воду',
      ],
    };
  }

  async scanWine(input: WineScannerInput): Promise<WineScannerOutput> {
    await this.simulateDelay();

    const wineDescription = input.wineDescription || input.wineName || 'Вино';
    const wineTypes: Record<string, { type: string; region: string }> = {
      красное: { type: 'Красное сухое', region: 'Кубань' },
      белое: { type: 'Белое сухое', region: 'Кубань' },
      розовое: { type: 'Розовое', region: 'Кубань' },
      игристое: { type: 'Игристое', region: 'Кубань' },
    };

    const type = Object.entries(wineTypes).find(([key]) =>
      wineDescription.toLowerCase().includes(key)
    )?.[1] || wineTypes.красное;

    return {
      winery: {
        name: `Винодельня "${type.region}"`,
        location: 'Краснодарский край',
        description: 'Современная винодельня с дегустационным залом',
        match: 92,
      },
      wines: [
        {
          name: wineDescription,
          type: type.type,
          description: 'Фруктовые ноты, мягкое послевкусие',
        },
      ],
      nearbyLocations: [],
      tourRecommendation: 'Рекомендуем посетить утром для полной экскурсии',
    };
  }

  async getEmergencyRoute(input: EmergencyRouteInput): Promise<EmergencyRouteOutput> {
    await this.simulateDelay();

    const solutions: Record<string, { solution: string; estimatedTime: string }> = {
      weather: { solution: 'Маршрут с укрытиями', estimatedTime: '0 мин' },
      closed: { solution: 'Альтернативная точка назначения', estimatedTime: '5 мин' },
      crowded: { solution: 'Обходной маршрут', estimatedTime: '10 мин' },
      bored: { solution: 'Добавить активности', estimatedTime: '0 мин' },
      traffic: { solution: 'Изменить маршрут', estimatedTime: '15 мин' },
      budget: { solution: 'Бюджетные альтернативы', estimatedTime: '0 мин' },
    };

    const solution = solutions[input.problem] || { solution: 'Гибкий маршрут', estimatedTime: '0 мин' };

    return {
      alternatives: [{
        location: input.allLocations[0] || {
          id: 0,
          title: 'Альтернативная точка',
          description: '',
          match: 80,
          matchText: '',
          tags: [],
          lat: 44.5,
          lng: 38.5,
          img: '',
          videos: [],
          foodOptions: [],
          activities: [],
        },
        solution: solution.solution,
        distance: '2 км',
        estimatedTime: solution.estimatedTime,
      }],
      advice: `Не переживайте! ${solution.solution}.`,
    };
  }

  async personalize(_input: PersonalizationInput): Promise<PersonalizationOutput> {
    await this.simulateDelay();

    return {
      insights: [
        'Вы предпочитаете активные маршруты',
        'Вам нравится посещать винодельни',
        'Выбирайте утренние часы для лучших фото',
      ],
      adjustedPreferences: {
        foodPreferences: ['Горы', 'Вино', 'История'],
      },
      nextRecommendations: ['Рекомендуем посетить', 'Популярный выбор'],
    };
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }

  getMode(): 'demo' {
    return 'demo';
  }
}

export const demoService = new DemoService();

import { BaseAgent } from './BaseAgent';
import type { AgentResponse, RouteMatcherInput, RouteMatcherOutput } from '../types';

const SYSTEM_PROMPT = `Ты - ИИ-эксперт по туризму в Краснодарском крае. Подбери лучшие места. Отвечай ТОЛЬКО валидным JSON на русском языке, без markdown разметки.`;

export class RouteMatcherAgent extends BaseAgent {
  constructor() {
    super({
      name: 'RouteMatcherAgent',
      type: 'route_matcher',
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.3,
      maxTokens: 500,
    });
  }

  async process(input: RouteMatcherInput): Promise<AgentResponse<RouteMatcherOutput>> {
    try {
      const interests = input.userProfile.interests
        .filter(i => i.liked)
        .map(i => i.name)
        .join(', ') || 'не указаны';
      const companions = input.userProfile.companions.map(c => c.name).join(', ') || 'не указа';
      
      const response = await this.ollama.chat([
        { role: 'user', content: `Пользователь любит: ${interests}, едет: ${companions}. Подбери 3 лучших места из списка и верни JSON: {"matchedLocations":[{"id":1,"title":"название","description":"описание","matchScore":90,"matchReasons":["причина1"],"bestTimeToVisit":"утро"}],"summary":"краткий итог","recommendations":["совет1"]}` }
      ]);

      let data: RouteMatcherOutput;
      try {
        const cleaned = response.response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        data = JSON.parse(cleaned);
      } catch {
        data = {
          matchedLocations: [],
          summary: response.response || 'Маршрут составлен',
          recommendations: ['Посетите понравившиеся места'],
        };
      }

      return { success: true, data };
    } catch (error) {
      console.error('RouteMatcherAgent error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const routeMatcherAgent = new RouteMatcherAgent();

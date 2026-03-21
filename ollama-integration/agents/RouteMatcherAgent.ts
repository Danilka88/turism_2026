import { BaseAgent } from './BaseAgent';
import type { AgentResponse, RouteMatcherInput, RouteMatcherOutput } from '../types';

const SYSTEM_PROMPT = `Ты - ИИ-эксперт по туризму в Краснодарском крае. Подбери лучшие места. Отвечай на русском. JSON.`;

export class RouteMatcherAgent extends BaseAgent {
  constructor() {
    super({
      name: 'RouteMatcherAgent',
      type: 'route_matcher',
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.5,
    });
  }

  async process(input: RouteMatcherInput): Promise<AgentResponse<RouteMatcherOutput>> {
    try {
      const prompt = this.buildPrompt(input);
      const { data } = await this.callOllamaStructured<RouteMatcherOutput>(prompt, {
        matchedLocations: [{ id: 'number', title: 'string', matchScore: 'number', matchReasons: 'array<string>', bestTimeToVisit: 'string' }],
        summary: 'string',
        recommendations: 'array<string>',
      });

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private buildPrompt(input: RouteMatcherInput): string {
    const cats = input.userProfile.preferredCategories?.join(', ') || 'не указаны';
    const style = input.userProfile.travelStyle || 'не указан';
    const locs = input.locations.slice(0, 15).map(l => `- ${l.title}: ${l.description}`).join('\n');

    return `Подбери места для: категории=${cats}, стиль=${style}\n${locs}\n\nJSON: {"matchedLocations":[],"summary":"","recommendations":[]}`;
  }
}

export const routeMatcherAgent = new RouteMatcherAgent();

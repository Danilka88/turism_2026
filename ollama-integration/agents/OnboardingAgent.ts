import { BaseAgent } from './BaseAgent';
import type { AgentResponse, OnboardingInput, OnboardingOutput } from '../types';

const SYSTEM_PROMPT = `Ты - ИИ-аналитик для туристического приложения "Привет, Краснодарский край".
Создай профиль путешественника на основе интересов. Отвечай кратко, на русском. Верни JSON.`;

export class OnboardingAgent extends BaseAgent {
  constructor() {
    super({
      name: 'OnboardingAgent',
      type: 'onboarding',
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.7,
    });
  }

  async process(input: OnboardingInput): Promise<AgentResponse<OnboardingOutput>> {
    try {
      const prompt = this.buildPrompt(input);
      const { data } = await this.callOllamaStructured<OnboardingOutput>(prompt, {
        profile: {
          id: 'string',
          interests: 'array',
          preferredCategories: 'array<string>',
          travelStyle: 'string',
          budgetLevel: 'string',
        },
        summary: 'string',
        recommendedCategories: 'array<string>',
      });

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private buildPrompt(input: OnboardingInput): string {
    const names: Record<number, string> = {
      1: 'Вино и винодельни', 2: 'Горные прогулки', 3: 'Фермы и сыроварни',
      4: 'Дольмены', 5: 'Экстремальный спорт', 6: 'Спокойный пляж',
      7: 'Казачья история', 8: 'Гастрономия',
    };

    const interests = input.selectedInterests
      .map(i => `- ${names[i.id] || i.id}: ${i.liked ? 'понравилось' : 'не понравилось'}${i.comment ? ` (${i.comment})` : ''}`)
      .join('\n');

    return `Создай профиль путешественника.\n${interests}\n\nВерни JSON: {"profile":{"id":"uuid","interests":[],"preferredCategories":[],"travelStyle":"","budgetLevel":""},"summary":"","recommendedCategories":[]}`;
  }
}

export const onboardingAgent = new OnboardingAgent();

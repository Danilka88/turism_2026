import { BaseAgent } from './BaseAgent';
import type { AgentResponse, OnboardingInput, OnboardingOutput } from '../types';

const SYSTEM_PROMPT = `Ты - короткий ИИ-ассистент. Отвечай на русском, очень кратко, 2-3 предложения.`;

export class OnboardingAgent extends BaseAgent {
  constructor() {
    super({
      name: 'OnboardingAgent',
      type: 'onboarding',
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.3,
      maxTokens: 150,
    });
  }

  async process(input: OnboardingInput): Promise<AgentResponse<OnboardingOutput>> {
    try {
      const interests = input.selectedInterests
        .filter(i => i.liked)
        .map(i => i.id)
        .join(', ');

      const response = await this.ollama.chat([
        { role: 'user', content: `Профиль: интересы ${interests}. Кратко опиши стиль путешественника на русском.` }
      ]);

      const profile = {
        id: 'generated-' + Date.now(),
        interests: input.selectedInterests.map(i => ({ id: i.id, category: 'general', name: `Interest ${i.id}`, liked: i.liked })),
        companions: [],
        preferences: { foodPreferences: [], noKidsMode: false },
        history: { viewedLocations: [], selectedLocations: [], rejectedLocations: [], bookings: [] },
        preferredCategories: input.selectedInterests.filter(i => i.liked).map(i => `Category ${i.id}`),
        travelStyle: 'explorer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: {
          profile,
          summary: response.response || 'Профиль составлен',
          recommendedCategories: profile.preferredCategories,
        },
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const onboardingAgent = new OnboardingAgent();

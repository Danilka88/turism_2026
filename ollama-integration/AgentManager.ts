import { OllamaService } from './services/OllamaService';
import {
  onboardingAgent,
  routeMatcherAgent,
  wineScannerAgent,
  emergencyRouteAgent,
  descriptionGeneratorAgent,
  personalizationAgent,
} from './agents';
import type {
  AgentType,
  AgentResponse,
  OnboardingInput,
  OnboardingOutput,
  RouteMatcherInput,
  RouteMatcherOutput,
  WineScannerInput,
  WineScannerOutput,
  EmergencyRouteInput,
  EmergencyRouteOutput,
  DescriptionGeneratorInput,
  DescriptionGeneratorOutput,
  PersonalizationInput,
  PersonalizationOutput,
} from './types';

export interface AgentManagerConfig {
  baseUrl?: string;
  model?: string;
  timeout?: number;
}

class AgentManager {
  private static instance: AgentManager;
  private ollama: OllamaService;
  private isConnected: boolean = false;

  private constructor(config?: AgentManagerConfig) {
    this.ollama = new OllamaService({
      baseUrl: config?.baseUrl || 'http://localhost:11434',
      model: config?.model || 'qwen3.5:4b',
      timeout: config?.timeout || 60000,
    });
  }

  static getInstance(config?: AgentManagerConfig): AgentManager {
    if (!AgentManager.instance) {
      AgentManager.instance = new AgentManager(config);
    }
    return AgentManager.instance;
  }

  async checkConnection(): Promise<boolean> {
    try {
      this.isConnected = await this.ollama.isAvailable();
      return this.isConnected;
    } catch {
      this.isConnected = false;
      return false;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  async listModels(): Promise<string[]> {
    return this.ollama.getModels();
  }

  setModel(model: string): void {
    this.ollama.setModel(model);
  }

  async onboarding(input: OnboardingInput): Promise<AgentResponse<OnboardingOutput>> {
    return onboardingAgent.process(input);
  }

  async matchRoutes(input: RouteMatcherInput): Promise<AgentResponse<RouteMatcherOutput>> {
    return routeMatcherAgent.process(input);
  }

  async scanWine(input: WineScannerInput): Promise<AgentResponse<WineScannerOutput>> {
    return wineScannerAgent.process(input);
  }

  async emergencyRoute(input: EmergencyRouteInput): Promise<AgentResponse<EmergencyRouteOutput>> {
    return emergencyRouteAgent.process(input);
  }

  async generateDescription(input: DescriptionGeneratorInput): Promise<AgentResponse<DescriptionGeneratorOutput>> {
    return descriptionGeneratorAgent.process(input);
  }

  async personalize(input: PersonalizationInput): Promise<AgentResponse<PersonalizationOutput>> {
    return personalizationAgent.process(input);
  }

  async callAgent<T>(agentType: AgentType, input: unknown): Promise<AgentResponse<T>> {
    switch (agentType) {
      case 'onboarding':
        return this.onboarding(input as OnboardingInput) as Promise<AgentResponse<T>>;
      case 'route_matcher':
        return this.matchRoutes(input as RouteMatcherInput) as Promise<AgentResponse<T>>;
      case 'wine_scanner':
        return this.scanWine(input as WineScannerInput) as Promise<AgentResponse<T>>;
      case 'emergency_route':
        return this.emergencyRoute(input as EmergencyRouteInput) as Promise<AgentResponse<T>>;
      case 'description_generator':
        return this.generateDescription(input as DescriptionGeneratorInput) as Promise<AgentResponse<T>>;
      case 'personalization':
        return this.personalize(input as PersonalizationInput) as Promise<AgentResponse<T>>;
      default:
        return Promise.resolve({ success: false, error: `Unknown agent: ${agentType}` });
    }
  }
}

export const agentManager = AgentManager.getInstance();

export default AgentManager;

import { OllamaService, ollamaService } from '../services/OllamaService';
import type { AgentType, AgentResponse } from '../types';

export interface AgentConfig {
  name: string;
  type: AgentType;
  systemPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected ollama: OllamaService;

  constructor(config: AgentConfig, ollama?: OllamaService) {
    this.config = config;
    this.ollama = ollama || ollamaService;
  }

  abstract process(input: unknown): Promise<AgentResponse>;

  protected async callOllama(prompt: string, options?: {
    temperature?: number;
    maxTokens?: number;
    system?: string;
  }): Promise<string> {
    const response = await this.ollama.generate(prompt, {
      system: options?.system || this.config.systemPrompt,
      temperature: options?.temperature ?? this.config.temperature ?? 0.7,
      maxTokens: options?.maxTokens ?? this.config.maxTokens ?? 1000,
    });
    return response.response;
  }

  protected async callOllamaStructured<T>(prompt: string, schema: object): Promise<{ data: T; response: string }> {
    try {
      const result = await this.ollama.generateStructured<T>(prompt, {
        system: this.config.systemPrompt,
        temperature: 0.3,
        schema,
      });
      return { data: result.data, response: result.metadata.response || '' };
    } catch (error) {
      throw error;
    }
  }

  getConfig(): AgentConfig {
    return { ...this.config };
  }
}

export default BaseAgent;

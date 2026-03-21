export interface OllamaConfig {
  baseUrl: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

export interface OllamaRequest {
  model: string;
  prompt: string;
  system?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
  totalDuration?: number;
  evalCount?: number;
  promptEvalCount?: number;
}

export class OllamaService {
  private config: OllamaConfig;
  private defaultSystemPrompt = `Ты - ИИ-ассистент для туристического приложения "Привет, Краснодарский край". 
Ты помогаешь пользователям планировать путешествия по Краснодарскому краю.
Отвечай кратко, по делу и всегда на русском языке.
Если не уверен в ответе - скажи честно, что не знаешь.`;

  constructor(config: Partial<OllamaConfig> = {}) {
    this.config = {
      baseUrl: config.baseUrl || 'http://localhost:11434',
      model: config.model || 'qwen3.5:4b',
      temperature: config.temperature ?? 0.5,
      maxTokens: config.maxTokens ?? 200,
      timeout: config.timeout ?? 180000,
    };
  }

  setModel(model: string): void {
    this.config.model = model;
  }

  setTemperature(temperature: number): void {
    this.config.temperature = temperature;
  }

  async generate(
    prompt: string,
    options: {
      system?: string;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<OllamaResponse> {
    const startTime = Date.now();

    const request: OllamaRequest = {
      model: this.config.model,
      prompt: this.wrapPrompt(prompt, options.system),
      temperature: options.temperature ?? this.config.temperature,
      maxTokens: options.maxTokens ?? this.config.maxTokens,
      stream: false,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        model: data.model || this.config.model,
        response: data.response || '',
        done: true,
        totalDuration: Date.now() - startTime,
        evalCount: data.eval_count,
        promptEvalCount: data.prompt_eval_count,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  async generateStructured<T>(
    prompt: string,
    options: {
      system?: string;
      temperature?: number;
      schema?: object;
    } = {}
  ): Promise<{ data: T; metadata: OllamaResponse }> {
    const enhancedPrompt = `${prompt}

Ответ верни строго в формате JSON без дополнительного текста:
${JSON.stringify(options.schema || {}, null, 2)}`;

    const response = await this.generate(enhancedPrompt, {
      ...options,
      temperature: options.temperature ?? 0.3,
    });

    try {
      const cleanedResponse = response.response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const data = JSON.parse(cleanedResponse) as T;
      
      return {
        data,
        metadata: response,
      };
    } catch (error) {
      throw new Error(`Failed to parse JSON response: ${response.response}`);
    }
  }

  async chat(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options: {
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<OllamaResponse> {
    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            { role: 'system', content: this.defaultSystemPrompt },
            ...messages,
          ],
          stream: false,
          temperature: options.temperature ?? this.config.temperature,
          options: {
            num_predict: options.maxTokens ?? this.config.maxTokens,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        model: data.model || this.config.model,
        response: data.message?.content || '',
        done: true,
        totalDuration: Date.now() - startTime,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.config.baseUrl}/api/tags`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }

  async getModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/tags`);
      if (!response.ok) return [];
      
      const data = await response.json();
      return (data.models || []).map((m: { name: string }) => m.name);
    } catch {
      return [];
    }
  }

  private wrapPrompt(prompt: string, system?: string): string {
    const systemPrompt = system || this.defaultSystemPrompt;
    return `${systemPrompt}

${prompt}

Не добавляй пояснения к ответу, только ответ.`;
  }
}

// Singleton instance
export const ollamaService = new OllamaService();

export default OllamaService;

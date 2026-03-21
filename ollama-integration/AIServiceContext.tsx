import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { agentManager } from './AgentManager';
import { demoService, type DemoService } from './services/DemoService';
import { OllamaService } from './services/OllamaService';
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
  AgentResponse,
} from './types';

export type AIServiceMode = 'loading' | 'ollama' | 'demo' | 'error';

export interface AIServiceContextValue {
  mode: AIServiceMode;
  isOllamaAvailable: boolean;
  isDemoMode: boolean;
  checkConnection: () => Promise<boolean>;
  onboarding: (input: OnboardingInput) => Promise<AgentResponse<OnboardingOutput>>;
  matchRoutes: (input: RouteMatcherInput) => Promise<AgentResponse<RouteMatcherOutput>>;
  scanWine: (input: WineScannerInput) => Promise<AgentResponse<WineScannerOutput>>;
  emergencyRoute: (input: EmergencyRouteInput) => Promise<AgentResponse<EmergencyRouteOutput>>;
  personalize: (input: PersonalizationInput) => Promise<AgentResponse<PersonalizationOutput>>;
  ollamaService: OllamaService | null;
  demoService: DemoService;
}

const AIServiceContext = createContext<AIServiceContextValue | null>(null);

interface AIServiceProviderProps {
  children: ReactNode;
  fallbackToDemo?: boolean;
}

export function AIServiceProvider({ children, fallbackToDemo = true }: AIServiceProviderProps) {
  const [mode, setMode] = useState<AIServiceMode>('loading');
  const [isOllamaAvailable, setIsOllamaAvailable] = useState(false);
  const [ollamaService, setOllamaService] = useState<OllamaService | null>(null);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    setMode('loading');
    
    try {
      const connected = await agentManager.checkConnection();
      setIsOllamaAvailable(connected);
      
      if (connected) {
        setOllamaService(new OllamaService({
          baseUrl: 'http://localhost:11434',
          model: 'qwen3.5:4b',
        }));
        setMode('ollama');
        console.log('AI Service: Connected to Ollama');
        return true;
      }
      
      if (fallbackToDemo) {
        setMode('demo');
        console.log('AI Service: Falling back to demo mode');
        return false;
      }
      
      setMode('error');
      return false;
    } catch (error) {
      console.error('AI Service connection check failed:', error);
      
      if (fallbackToDemo) {
        setMode('demo');
        return false;
      }
      
      setMode('error');
      return false;
    }
  }, [fallbackToDemo]);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const handleError = <T,>(error: unknown): AgentResponse<T> => {
    console.error('AI Service error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  };

  const onboarding = useCallback(async (input: OnboardingInput): Promise<AgentResponse<OnboardingOutput>> => {
    if (fallbackToDemo) {
      try {
        const result = await demoService.getOnboardingProfile(input);
        return { success: true, data: result };
      } catch (e) {
        return handleError<OnboardingOutput>(e);
      }
    }
    
    if (mode === 'ollama' && ollamaService) {
      try {
        const result = await agentManager.onboarding(input);
        if (result.success) return result;
      } catch (e) {
        console.warn('Ollama onboarding failed, falling back to demo');
      }
    }
    
    return { success: false, error: 'AI service unavailable' };
  }, [mode, ollamaService, fallbackToDemo]);

  const matchRoutes = useCallback(async (input: RouteMatcherInput): Promise<AgentResponse<RouteMatcherOutput>> => {
    if (fallbackToDemo) {
      try {
        const result = await demoService.matchRoutes(input);
        return { success: true, data: result };
      } catch (e) {
        return handleError<RouteMatcherOutput>(e);
      }
    }
    
    if (mode === 'ollama' && ollamaService) {
      try {
        const result = await agentManager.matchRoutes(input);
        if (result.success) return result;
      } catch (e) {
        console.warn('Ollama matchRoutes failed, falling back to demo');
      }
    }
    
    return { success: false, error: 'AI service unavailable' };
  }, [mode, ollamaService, fallbackToDemo]);

  const scanWine = useCallback(async (input: WineScannerInput): Promise<AgentResponse<WineScannerOutput>> => {
    if (fallbackToDemo) {
      try {
        const result = await demoService.scanWine(input);
        return { success: true, data: result };
      } catch (e) {
        return handleError<WineScannerOutput>(e);
      }
    }
    
    if (mode === 'ollama' && ollamaService) {
      try {
        const result = await agentManager.scanWine(input);
        if (result.success) return result;
      } catch (e) {
        console.warn('Ollama scanWine failed, falling back to demo');
      }
    }
    
    return { success: false, error: 'AI service unavailable' };
  }, [mode, ollamaService, fallbackToDemo]);

  const emergencyRoute = useCallback(async (input: EmergencyRouteInput): Promise<AgentResponse<EmergencyRouteOutput>> => {
    if (fallbackToDemo) {
      try {
        const result = await demoService.getEmergencyRoute(input);
        return { success: true, data: result };
      } catch (e) {
        return handleError<EmergencyRouteOutput>(e);
      }
    }
    
    if (mode === 'ollama' && ollamaService) {
      try {
        const result = await agentManager.emergencyRoute(input);
        if (result.success) return result;
      } catch (e) {
        console.warn('Ollama emergencyRoute failed, falling back to demo');
      }
    }
    
    return { success: false, error: 'AI service unavailable' };
  }, [mode, ollamaService, fallbackToDemo]);

  const personalize = useCallback(async (input: PersonalizationInput): Promise<AgentResponse<PersonalizationOutput>> => {
    if (fallbackToDemo) {
      try {
        const result = await demoService.personalize(input);
        return { success: true, data: result };
      } catch (e) {
        return handleError<PersonalizationOutput>(e);
      }
    }
    
    if (mode === 'ollama' && ollamaService) {
      try {
        const result = await agentManager.personalize(input);
        if (result.success) return result;
      } catch (e) {
        console.warn('Ollama personalize failed, falling back to demo');
      }
    }
    
    return { success: false, error: 'AI service unavailable' };
  }, [mode, ollamaService, fallbackToDemo]);

  const value: AIServiceContextValue = {
    mode,
    isOllamaAvailable,
    isDemoMode: mode === 'demo',
    checkConnection,
    onboarding,
    matchRoutes,
    scanWine,
    emergencyRoute,
    personalize,
    ollamaService,
    demoService,
  };

  return (
    <AIServiceContext.Provider value={value}>
      {children}
    </AIServiceContext.Provider>
  );
}

export function useAIService(): AIServiceContextValue {
  const context = useContext(AIServiceContext);
  if (!context) {
    throw new Error('useAIService must be used within AIServiceProvider');
  }
  return context;
}

export function useAIServiceMode(): AIServiceMode {
  const { mode } = useAIService();
  return mode;
}

export function useIsDemoMode(): boolean {
  const { isDemoMode } = useAIService();
  return isDemoMode;
}

export default AIServiceContext;

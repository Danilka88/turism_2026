# Ollama Integration Module

Модуль интеграции с Ollama для туристического приложения "Привет, Краснодарский край".

## Структура

```
ollama-integration/
├── agents/                 # Агенты
│   ├── BaseAgent.ts       # Базовый класс агента
│   ├── onboarding/        # Профилирование пользователя
│   ├── route_matcher/     # Подбор маршрута
│   ├── wine_scanner/      # Распознавание вина
│   ├── emergency_route/   # Экстренный маршрут
│   ├── description_generator/ # Генерация описаний
│   └── personalization/    # Персонализация
├── prompts/               # Промты для агентов
├── skills/                # Описания скилов
├── services/              # Ollama сервис
├── types/                 # TypeScript типы
├── AgentManager.ts         # Оркестратор агентов
└── index.ts              # Главный экспорт
```

## Быстрый старт

```bash
# Установите Ollama
brew install ollama

# Запустите Ollama с моделью
ollama serve
ollama pull qwen2.5:4b
```

## Использование

```typescript
import { agentManager } from './ollama-integration';

// Проверка подключения
const connected = await agentManager.checkConnection();

// Подбор маршрута
const result = await agentManager.matchRoutes({
  userProfile: { preferredCategories: ['wine', 'nature'] },
  locations: [...],
});

// Экстренный маршрут
const emergency = await agentManager.emergencyRoute({
  problem: 'weather',
  allLocations: [...],
});
```

## Агенты

| Агент | Описание | Trigger |
|-------|----------|---------|
| OnboardingAgent | Профиль путешественника | После выбора интересов |
| RouteMatcherAgent | Подбор мест | При формировании маршрута |
| WineScannerAgent | Распознавание вина | При сканировании бутылки |
| EmergencyRouteAgent | Альтернативы | При проблемах |
| DescriptionGeneratorAgent | Описания мест | При добавлении места |
| PersonalizationAgent | Обучение | После действий |

## Конфигурация

```typescript
const manager = AgentManager.getInstance({
  baseUrl: 'http://localhost:11434',
  model: 'qwen2.5:4b',
  timeout: 60000,
});
```

## Fallback

Если Ollama недоступен, используются демо-данные и простые алгоритмы matching.

# Ollama Integration Module

Модуль интеграции с Ollama для туристического приложения "Привет, Краснодарский край".

## Структура

```
ollama-integration/
├── agents/                 # Агенты ИИ
│   ├── BaseAgent.ts           # Базовый класс агента
│   ├── OnboardingAgent.ts     # Профилирование пользователя
│   ├── RouteMatcherAgent.ts    # Подбор маршрута
│   ├── WineScannerAgent.ts     # Распознавание вина
│   ├── VisionAgent.ts          # Vision-анализ (база виноделен)
│   ├── EmergencyRouteAgent.ts  # Экстренный маршрут
│   ├── DescriptionGenerator.ts # Генерация описаний
│   └── PersonalizationAgent.ts  # Персонализация
├── services/
│   ├── OllamaService.ts       # Ollama API клиент
│   └── DemoService.ts         # Fallback демо-данные
├── types/                   # TypeScript типы
├── AgentManager.ts           # Оркестратор агентов
├── AIServiceContext.tsx      # React контекст (автопереключение)
└── index.ts                 # Главный экспорт
```

## Быстрый старт

```bash
# 1. Установите Ollama
brew install ollama  # macOS
# или скачайте с https://ollama.com

# 2. Запустите Ollama сервер
ollama serve

# 3. В отдельном терминале скачайте модель
ollama pull qwen3.5:4b

# 4. Запустите приложение
npm run dev
```

## Тестирование агентов

В приложении нажмите кнопку **"Тест"** в правом верхнем углу для проверки всех агентов.

## Агенты

| Агент | Описание | Модель |
|-------|----------|--------|
| **OnboardingAgent** | Профилирование пользователя по интересам | qwen3.5:4b |
| **RouteMatcherAgent** | Подбор мест по интересам и компании | qwen3.5:4b |
| **WineScannerAgent** | Распознавание вина по тексту | qwen3.5:4b |
| **VisionAgent** | Анализ фото бутылки + база виноделен Кубани | qwen3.5:4b |
| **EmergencyRouteAgent** | Альтернативы при проблемах (погода, закрыто и т.д.) | qwen3.5:4b |
| **DescriptionGeneratorAgent** | Генерация описаний локаций | qwen3.5:4b |
| **PersonalizationAgent** | Обучение на действиях пользователя | qwen3.5:4b |

## Использование в коде

```typescript
import { agentManager } from './ollama-integration';

// Проверка подключения
const connected = await agentManager.checkConnection();

// Подбор маршрута
const result = await agentManager.matchRoutes({
  userProfile: { interests: [...], companions: [...] },
  locations: [...],
});

// Анализ вина (VisionAgent)
import { visionAgent } from './ollama-integration/agents/VisionAgent';
const wine = await visionAgent.process({ text: 'Фанагория белое' });

// Экстренный маршрут
const emergency = await agentManager.emergencyRoute({
  problem: 'weather',
  allLocations: [...],
});
```

## Конфигурация

```typescript
// В AgentManager
const manager = AgentManager.getInstance({
  baseUrl: 'http://localhost:11434',
  model: 'qwen3.5:4b',
  timeout: 180000, // 3 минуты
});

// В OllamaService для отдельных агентов
const ollama = new OllamaService({
  model: 'qwen3.5:4b',
  temperature: 0.3,
  maxTokens: 200,
  timeout: 180000,
});
```

## Режимы работы

### Ollama (основной)
- Использует локальную модель `qwen3.5:4b`
- Автоматическое переключение при недоступности

### Demo (fallback)
- Если Ollama недоступен
- Демо-данные для всех агентов
- Полностью рабочее приложение без ИИ

## VisionAgent - База виноделен

VisionAgent содержит базу данных виноделен Краснодарского края:

| Винодельня | Регион | Сорта |
|-----------|--------|-------|
| Фанагория | станица Натухаевская | Каберне, Мерло, Шардоне, Рислинг |
| Абрау-Дюрсо | Новороссийск | Пино Нуар, Шардоне, Каберне |
| Гай-Кодзор | Геленджик | Каберне, Мерло, Совиньон |
| Шато Тамань | Тамань | Каберне, Шардоне, Мерло |

Пример использования:
```
Запрос: "Фанагория белое вино"
Ответ: {
  wineName: "Фанагория белое",
  winery: "Фанагория",
  region: "Краснодарский край, станица Натухаевская",
  grapeVariety: "Шардоне, Алиготе, Рислинг",
  year: "N/A",
  description: "Белое вино с фруктовыми нотами...",
  confidence: 95
}
```

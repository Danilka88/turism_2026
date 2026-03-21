# Skill: ИИ Агент для туристического приложения

## Описание
Модуль Ollama-интеграции для туристического приложения "Привет, Краснодарский край".

## Агенты

### 1. OnboardingAgent
**Роль:** Создание профиля путешественника
**Trigger:** После выбора интересов пользователем
**Вход:** selectedInterests[]
**Выход:** UserProfile, summary, recommendedCategories

### 2. RouteMatcherAgent
**Роль:** Подбор мест по профилю
**Trigger:** После онбординга, при выборе маршрута
**Вход:** userProfile, locations[], filters?
**Выход:** matchedLocations[], summary, recommendations

### 3. WineScannerAgent
**Роль:** Распознавание вина и винодельни
**Trigger:** При сканировании бутылки
**Вход:** wineDescription?, wineName?, grapeVariety?
**Выход:** winery, wines[], nearbyLocations[], tourRecommendation

### 4. EmergencyRouteAgent
**Роль:** Поиск альтернатив при проблемах
**Trigger:** При выборе проблемы (погода, закрыто и т.д.)
**Вход:** problem, currentLocation?, userPreferences?, allLocations[]
**Выход:** alternatives[], advice

### 5. DescriptionGeneratorAgent
**Роль:** Генерация описаний мест
**Trigger:** При добавлении нового места
**Вход:** location data, tone?
**Выход:** title, descriptions, tags, matchText

### 6. PersonalizationAgent
**Роль:** Обучение на истории пользователя
**Trigger:** После действий пользователя
**Вход:** userProfile, recentActions[]
**Выход:** insights[], adjustedPreferences, nextRecommendations

## Использование

```typescript
import { agentManager } from './ollama-integration';

// Проверка подключения
const isConnected = await agentManager.checkConnection();

// Подбор маршрута
const result = await agentManager.matchRoutes({
  userProfile: { preferredCategories: ['wine'] },
  locations: [...],
});

// Экстренный маршрут
const emergency = await agentManager.emergencyRoute({
  problem: 'weather',
  allLocations: [...],
});
```

## Конфигурация

Модель по умолчанию: `qwen2.5:4b`
Base URL: `http://localhost:11434`

## Workflow

```
Пользователь → Onboarding → RouteMatcher → Results
                    ↓
              WineScanner → Wine Route
                    ↓
              Emergency → Alternative Route
                    ↓
              Personalization → Improved Recommendations
```

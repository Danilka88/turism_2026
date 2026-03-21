# Skill: PersonalizationAgent

## Описание
Учится на действиях пользователя и улучшает рекомендации.

## Параметры
- **Input:** `PersonalizationInput` - профиль + действия
- **Output:** `PersonalizationOutput` - инсайты + корректировки

## Типы действий
- `view` - Пользователь посмотрел место
- `select` - Пользователь добавил в маршрут
- `reject` - Пользователь пропустил
- `book` - Пользователь забронировал

## Промт
См. `../prompts/personalization.md`

## Trigger
Вызывается после каждого действия пользователя (с debounce).

## Пример вызова
```typescript
const result = await agentManager.personalize({
  userProfile: {
    preferredCategories: ['wine', 'nature'],
  },
  recentActions: [
    { type: 'view', locationId: 8, timestamp: '2024-01-15T10:00:00' },
    { type: 'select', locationId: 34, timestamp: '2024-01-15T10:05:00' },
  ]
});
```

## Fallback
Если Ollama недоступен - используется простое правило:
- Собирать статистику по категориям
- Отсортировывать по popularity

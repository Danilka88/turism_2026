# Skill: RouteMatcherAgent

## Описание
匹配用户兴趣和可用位置，计算匹配度。

## Параметры
- **Input:** `RouteMatcherInput` - профиль + локации + фильтры
- **Output:** `RouteMatcherOutput` - отсортированные места

## Промт
См. `../prompts/route_matcher.md`

## Trigger
1. После онбординга - первичный подбор
2. При изменении фильтров
3. При добавлении новых мест

## Пример вызова
```typescript
const result = await agentManager.matchRoutes({
  userProfile: {
    preferredCategories: ['wine', 'nature'],
    travelStyle: 'активный',
    companions: [{ id: 'partner', name: 'Партнёр', icon: '❤️' }],
  },
  locations: [...],
  filters: { categories: ['wine', 'nature'] }
});
```

## Fallback
Если Ollama недоступен - используется расчёт matchScore по тегам:
- Совпадение категории: +20
- Подходит для компании: +15
- Совпадение стиля: +10

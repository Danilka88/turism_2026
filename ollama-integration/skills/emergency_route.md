# Skill: EmergencyRouteAgent

## Описание
Находит альтернативные места при проблемах в путешествии.

## Параметры
- **Input:** `EmergencyRouteInput` - проблема + контекст
- **Output:** `EmergencyRouteOutput` - альтернативы + совет

## Типы проблем
- `weather` - Погода испортилась
- `closed` - Объект закрыт
- `crowded` - Толпы народу
- `bored` - Скучно стало
- `traffic` - Пробки/нет машины
- `budget` - Хочу дёшево

## Промт
См. `../prompts/emergency_route.md`

## Trigger
Вызывается при выборе проблемы на экране "Экстренный маршрут".

## Пример вызова
```typescript
const result = await agentManager.emergencyRoute({
  problem: 'weather',
  currentLocation: { id: 6, title: 'Скала Парус', lat: 44.43, lng: 38.18 },
  allLocations: [...],
});
```

## Fallback
Если Ollama недоступен - используется жёсткий маппинг:
- weather → indoor places
- closed → nearby alternatives
- crowded → off-beat locations

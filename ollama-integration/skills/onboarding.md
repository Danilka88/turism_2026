# Skill: OnboardingAgent

## Описание
Создаёт профиль путешественника на основе выбранных интересов.

## Параметры
- **Input:** `OnboardingInput` - массив выбранных интересов
- **Output:** `OnboardingOutput` - профиль + рекомендации

## Промт
См. `../prompts/onboarding.md`

## Trigger
Вызывается после завершения онбординга (swipe карточек интересов).

## Пример вызова
```typescript
const result = await agentManager.onboarding({
  selectedInterests: [
    { id: 1, liked: true, comment: 'Люблю хорошее вино' },
    { id: 2, liked: true },
  ]
});
```

## Fallback
Если Ollama недоступен - используется демо-профиль:
```json
{
  "preferredCategories": ["wine", "nature"],
  "travelStyle": "смешанный",
  "budgetLevel": "medium"
}
```

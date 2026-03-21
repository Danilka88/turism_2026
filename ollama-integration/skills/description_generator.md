# Skill: DescriptionGeneratorAgent

## Описание
Генерирует привлекательные описания для туристических мест.

## Параметры
- **Input:** `DescriptionGeneratorInput` - данные места + тон
- **Output:** `DescriptionGeneratorOutput` - описания

## Тоны
- `formal` - Официальный, информативный
- `casual` - Дружелюбный, простой
- `adventurous` - Вдохновляющий, приключенческий
- `romantic` - Романтичный, для пар

## Промт
См. `../prompts/description_generator.md`

## Trigger
Вызывается:
1. При добавлении нового места (кабинет владельца)
2. При необходимости обновить описание
3. При генерации контента для места

## Пример вызова
```typescript
const result = await agentManager.generateDescription({
  location: {
    title: 'Гуамское ущелье',
    description: 'Узкоколейка среди скал',
    tags: ['природа', 'горы'],
  },
  tone: 'adventurous',
});
```

## Fallback
Если Ollama недоступен - используются шаблоны описаний.

# Skill: WineScannerAgent

## Описание
Распознаёт вино по описанию и предлагает маршрут на винодельню.

## Параметры
- **Input:** `WineScannerInput` - описание вина
- **Output:** `WineScannerOutput` - винодельня + маршрут

## Промт
См. `../prompts/wine_scanner.md`

## Trigger
Вызывается при сканировании бутылки вина пользователем.

## Пример вызова
```typescript
const result = await agentManager.scanWine({
  wineDescription: 'Красное сухое с нотами сливы',
  grapeVariety: 'Каберне Совиньон',
});
```

## Fallback
Если Ollama недоступен - поиск по ключевым словам в базе:
- "каберне" → Фанагория
- "абрау" → Абрау-Дюрсо
- "гай" / "кодзор" → Гай-Кодзор

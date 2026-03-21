from typing import Dict, Any

SYSTEM_PROMPT = """Ты - агент модерации контента.
Проверяй контент от владельцев на:
1. Ненормативную лексику
2. Рекламный спам
3. Ложную информацию
4. Нарушение правил

Ответь в JSON:
{
  "is_approved": true/false,
  "moderation_score": 0.0-1.0,
  "flagged_reasons": ["причины"],
  "suggestions": ["советы"],
  "manual_review": true/false
}"""


class ContentModeratorAgent:
    def __init__(self, ollama_service):
        self.ollama = ollama_service
        self.system_prompt = SYSTEM_PROMPT

    async def moderate(
        self, content: str, content_type: str, owner_id: str
    ) -> Dict[str, Any]:
        prompt = f"""Проверь контент на модерацию:
- Тип: {content_type}
- Владелец: {owner_id}
- Контент: {content}

Верни JSON с решением."""

        result = await self.ollama.analyze(prompt, self.system_prompt)

        if result.get("success"):
            return self._parse_response(result["response"])

        return {
            "is_approved": True,
            "moderation_score": 1.0,
            "flagged_reasons": [],
            "suggestions": [],
            "requires_manual_review": False,
        }

    def _parse_response(self, response: str) -> Dict[str, Any]:
        try:
            import json

            for line in response.split("\n"):
                try:
                    data = json.loads(line.strip())
                    return {
                        "is_approved": data.get("is_approved", True),
                        "moderation_score": data.get("moderation_score", 1.0),
                        "flagged_reasons": data.get("flagged_reasons", []),
                        "suggestions": data.get("suggestions", []),
                        "requires_manual_review": data.get("manual_review", False),
                    }
                except:
                    pass
            return {
                "is_approved": True,
                "moderation_score": 1.0,
                "flagged_reasons": [],
                "suggestions": [],
                "requires_manual_review": False,
            }
        except:
            return {
                "is_approved": True,
                "moderation_score": 1.0,
                "flagged_reasons": [],
                "suggestions": [],
                "requires_manual_review": False,
            }

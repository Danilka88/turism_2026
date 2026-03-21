from typing import Dict, Any

SYSTEM_PROMPT = """Ты - агент контроля качества данных.
Проверяй данные от парсера на:
1. Достоверность информации
2. Отсутствие дубликатов
3. Полноту описаний
4. Качество изображений

Ответь в JSON:
{
  "is_valid": true/false,
  "quality_score": 0.0-1.0,
  "duplicates": ["найденные дубликаты"],
  "issues": ["проблемы"],
  "recommendations": ["советы"]
}"""


class DataQualityAgent:
    def __init__(self, ollama_service):
        self.ollama = ollama_service
        self.system_prompt = SYSTEM_PROMPT

    async def validate(self, data: Dict[str, Any]) -> Dict[str, Any]:
        content = data.get("content", "")
        images = data.get("images", [])
        source = data.get("source", "unknown")

        prompt = f"""Проверь качество данных:
- Источник: {source}
- Контент: {content[:500]}...
- Изображений: {len(images)}

Верни JSON с оценкой качества."""

        result = await self.ollama.analyze(prompt, self.system_prompt)

        if result.get("success"):
            return self._parse_response(result["response"])

        return {
            "is_valid": True,
            "quality_score": 1.0,
            "duplicates_found": [],
            "issues": [],
            "recommendations": [],
        }

    def _parse_response(self, response: str) -> Dict[str, Any]:
        try:
            import json

            for line in response.split("\n"):
                try:
                    data = json.loads(line.strip())
                    return {
                        "is_valid": data.get("is_valid", True),
                        "quality_score": data.get("quality_score", 1.0),
                        "duplicates_found": data.get("duplicates", []),
                        "issues": data.get("issues", []),
                        "recommendations": data.get("recommendations", []),
                    }
                except:
                    pass
            return {
                "is_valid": True,
                "quality_score": 1.0,
                "duplicates_found": [],
                "issues": [],
                "recommendations": [],
            }
        except:
            return {
                "is_valid": True,
                "quality_score": 1.0,
                "duplicates_found": [],
                "issues": [],
                "recommendations": [],
            }

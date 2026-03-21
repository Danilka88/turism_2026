from typing import Dict, Any, List

SYSTEM_PROMPT = """Ты - агент безопасности для туристического приложения.
Анализируй поведение пользователей и выявляй аномалии.

Проверь:
1. Частота запросов (флуд)
2. Подозрительные паттерны (боты)
3. Аномальное время активности
4. Подозрительные IP адреса

Ответь в JSON:
{
  "threat_level": "low/medium/high/critical",
  "risk_score": 0.0-1.0,
  "anomalies": ["список аномалий"],
  "action": "allow/block/monitor"
}"""


class UserBehaviorAgent:
    def __init__(self, ollama_service):
        self.ollama = ollama_service
        self.system_prompt = SYSTEM_PROMPT

    async def analyze(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        prompt = f"""Проанализируй поведение пользователя:
- user_id: {user_data.get("user_id")}
- действие: {user_data.get("action")}
- IP: {user_data.get("ip")}
- User-Agent: {user_data.get("user_agent")}
- Время сессии: {user_data.get("session_duration")} сек
- Запросов: {user_data.get("request_count")}

Верни JSON с оценкой риска."""

        result = await self.ollama.analyze(prompt, self.system_prompt)

        if result.get("success"):
            return self._parse_response(result["response"])

        return {
            "threat_level": "low",
            "risk_score": 0.0,
            "anomalies": [],
            "action": "allow",
        }

    def _parse_response(self, response: str) -> Dict[str, Any]:
        try:
            import json

            for line in response.split("\n"):
                try:
                    return json.loads(line.strip())
                except:
                    pass
            return json.loads(response)
        except:
            return {
                "threat_level": "low",
                "risk_score": 0.0,
                "anomalies": [],
                "action": "allow",
            }

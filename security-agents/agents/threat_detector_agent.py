from typing import Dict, Any

SYSTEM_PROMPT = """Ты - агент обнаружения угроз безопасности.
Проверяй запросы на:
1. SQL-инъекции
2. XSS-атаки
3. CSRF
4. Подозрительные паттерны

Ответь в JSON:
{
  "threat_detected": true/false,
  "threat_type": "sql_injection/xss/csrf/suspicious/none",
  "confidence": 0.0-1.0,
  "blocked": true/false,
  "action": "block/allow/log"
}"""


class ThreatDetectorAgent:
    def __init__(self, ollama_service):
        self.ollama = ollama_service
        self.system_prompt = SYSTEM_PROMPT

    async def detect(
        self, ip: str, request_data: Dict, endpoint: str
    ) -> Dict[str, Any]:
        prompt = f"""Проанализируй запрос на угрозы:
- IP: {ip}
- Endpoint: {endpoint}
- Данные: {str(request_data)[:500]}

Верни JSON с решением."""

        result = await self.ollama.analyze(prompt, self.system_prompt)

        if result.get("success"):
            return self._parse_response(result["response"])

        return {
            "threat_detected": False,
            "threat_type": None,
            "confidence": 0.0,
            "blocked": False,
            "action_taken": "allowed",
        }

    def _parse_response(self, response: str) -> Dict[str, Any]:
        try:
            import json

            for line in response.split("\n"):
                try:
                    data = json.loads(line.strip())
                    return {
                        "threat_detected": data.get("threat_detected", False),
                        "threat_type": data.get("threat_type"),
                        "confidence": data.get("confidence", 0.0),
                        "blocked": data.get("blocked", False),
                        "action_taken": data.get("action", "allowed"),
                    }
                except:
                    pass
            return {
                "threat_detected": False,
                "threat_type": None,
                "confidence": 0.0,
                "blocked": False,
                "action_taken": "allowed",
            }
        except:
            return {
                "threat_detected": False,
                "threat_type": None,
                "confidence": 0.0,
                "blocked": False,
                "action_taken": "allowed",
            }

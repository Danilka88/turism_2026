import httpx
from typing import Dict, Any, Optional


class OllamaRouteService:
    def __init__(
        self, base_url: str = "http://localhost:11434", model: str = "qwen3.5:4b"
    ):
        self.base_url = base_url
        self.model = model
        self.client = httpx.Client(timeout=60.0)

    async def analyze(
        self, prompt: str, system: Optional[str] = None
    ) -> Dict[str, Any]:
        messages = []

        if system:
            messages.append({"role": "system", "content": system})

        messages.append({"role": "user", "content": prompt})

        try:
            response = self.client.post(
                f"{self.base_url}/api/chat",
                json={"model": self.model, "messages": messages, "stream": False},
            )

            if response.status_code == 200:
                data = response.json()
                return {
                    "success": True,
                    "response": data.get("message", {}).get("content", ""),
                    "model": self.model,
                }
            else:
                return {"success": False, "error": f"API error: {response.status_code}"}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def close(self):
        self.client.close()


ollama_service = OllamaRouteService()

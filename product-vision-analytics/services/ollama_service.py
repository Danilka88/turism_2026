import httpx
import base64
from typing import Optional, Dict, Any
import json


class OllamaService:
    def __init__(
        self, base_url: str = "http://localhost:11434", model: str = "qwen2.5:3b"
    ):
        self.base_url = base_url
        self.model = model
        self.timeout = 180.0

    async def is_available(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                return response.status_code == 200
        except Exception:
            return False

    async def generate(self, prompt: str, system: Optional[str] = None) -> str:
        try:
            payload = {
                "model": self.model,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.7, "num_predict": 200},
            }

            if system:
                payload["system"] = system

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/generate", json=payload
                )

                if response.status_code == 200:
                    data = response.json()
                    return data.get("response", "")
                else:
                    raise Exception(f"Ollama error: {response.status_code}")

        except Exception as e:
            raise Exception(f"Failed to generate response: {str(e)}")

    async def analyze_image(self, image_base64: str, prompt: str) -> str:
        try:
            payload = {
                "model": "llava:7b",
                "prompt": prompt,
                "images": [image_base64],
                "stream": False,
                "options": {"temperature": 0.7, "num_predict": 300},
            }

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/generate", json=payload
                )

                if response.status_code == 200:
                    data = response.json()
                    return data.get("response", "")
                else:
                    raise Exception(f"Ollama vision error: {response.status_code}")

        except Exception as e:
            raise Exception(f"Failed to analyze image: {str(e)}")

    async def chat(self, messages: list, system: Optional[str] = None) -> str:
        try:
            payload = {"model": self.model, "messages": messages, "stream": False}

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(f"{self.base_url}/api/chat", json=payload)

                if response.status_code == 200:
                    data = response.json()
                    return data.get("message", {}).get("content", "")
                else:
                    raise Exception(f"Ollama chat error: {response.status_code}")

        except Exception as e:
            raise Exception(f"Failed to chat: {str(e)}")


ollama_service = OllamaService()

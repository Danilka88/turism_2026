from typing import Optional, Dict, Any
from services.ollama_service import ollama_service
from services.geocoding_service import geocoding_service
from database.products_db import (
    search_products,
    get_product_by_id,
    get_products_by_category,
)
from database.producers_db import search_producers, get_producer_by_id
from prompts.product_analysis import PRODUCT_ANALYSIS_PROMPT, VISION_ANALYSIS_PROMPT
import json
import re


class ProductVisionAgent:
    def __init__(self):
        self.ollama = ollama_service
        self.demo_mode = False

    async def initialize(self):
        self.demo_mode = not await self.ollama.is_available()

    async def analyze_from_text(self, product_text: str) -> Dict[str, Any]:
        if self.demo_mode:
            return self._demo_analyze(product_text)

        try:
            response = await self.ollama.generate(
                prompt=f"Проанализируй продукт: {product_text}",
                system=PRODUCT_ANALYSIS_PROMPT,
            )

            result = self._parse_json_response(response)
            if result:
                return self._enrich_product_data(result)
            return self._demo_analyze(product_text)

        except Exception as e:
            return self._demo_analyze(product_text)

    async def analyze_from_image(self, image_base64: str) -> Dict[str, Any]:
        if self.demo_mode:
            return self._demo_analyze("Изображение этикетки")

        try:
            response = await self.ollama.analyze_image(
                image_base64=image_base64,
                prompt="Проанализируй этикетку продукта. Определи название, производителя, категорию.",
            )

            result = self._parse_json_response(response)
            if result:
                return self._enrich_product_data(result)
            return self._demo_analyze("Изображение этикетки")

        except Exception as e:
            return self._demo_analyze("Изображение этикетки")

    def _demo_analyze(self, product_text: str) -> Dict[str, Any]:
        text_lower = product_text.lower()

        category = "other"
        if any(w in text_lower for w in ["вино", "вина", "вина"]):
            category = "wines"
        elif any(w in text_lower for w in ["сыр", "сулугуни", "брынза", "адыгейск"]):
            category = "dairy"
        elif any(w in text_lower for w in ["колбас", "мясо", "сосиск"]):
            category = "meat"
        elif any(w in text_lower for w in ["мёд", "мед", "пчел"]):
            category = "honey"
        elif any(w in text_lower for w in ["маринован", "солен", "консерв"]):
            category = "preserves"

        products = search_products(product_text)
        if products:
            product = products[0]
            return {
                "product": product,
                "confidence": 0.95,
                "recommendations": [
                    f"Рекомендуем посетить производителя: {product.get('brand', 'Неизвестно')}",
                    "Забронируйте экскурсию на производство",
                ],
                "source": "demo_database",
            }

        return {
            "product": {"name": product_text, "category": category, "confidence": 0.6},
            "confidence": 0.6,
            "recommendations": [
                "Попробуйте загрузить фото этикетки",
                "Уточните название продукта",
            ],
            "source": "demo",
        }

    def _parse_json_response(self, response: str) -> Optional[Dict[str, Any]]:
        try:
            json_match = re.search(r"\{.*\}", response, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
        except Exception:
            pass
        return None

    def _enrich_product_data(self, result: Dict[str, Any]) -> Dict[str, Any]:
        product_name = result.get("name", "")

        products = search_products(product_name)
        if products:
            result["product"] = products[0]
            result["source"] = "database"
        else:
            result["product"] = result
            result["source"] = "ai"

        category = result.get("category", "other")
        result["recommendations"] = self._generate_recommendations(category)

        return result

    def _generate_recommendations(self, category: str) -> list:
        recommendations = {
            "wines": [
                "Посетите дегустацию на винодельне",
                "Забронируйте экскурсию по подвалам",
                "Купите вина напрямую у производителя",
            ],
            "dairy": [
                "Запишитесь на мастер-класс по сыроварению",
                "Попробуйте свежие сыры на ферме",
                "Купите молочные продукты",
            ],
            "meat": [
                "Посетите экскурсию на мясокомбинат",
                "Продегустируйте колбасы",
                "Купите продукцию",
            ],
            "honey": [
                "Посетите пасеку",
                "Попробуйте разные сорта мёда",
                "Узнайте о пчеловодстве",
            ],
            "preserves": [
                "Поучаствуйте в мастер-классе по маринованию",
                "Попробуйте домашние заготовки",
            ],
        }
        return recommendations.get(category, ["Найдите производителя в регионе"])


product_vision_agent = ProductVisionAgent()

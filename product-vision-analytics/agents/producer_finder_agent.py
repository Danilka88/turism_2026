from typing import Optional, Dict, Any, List
from services.ollama_service import ollama_service
from services.geocoding_service import geocoding_service
from database.producers_db import (
    search_producers,
    get_producer_by_id,
    get_producers_by_type,
    get_producers_by_region,
    get_producers_nearby,
    get_all_producers,
)
from database.products_db import get_products_by_producer
import json


class ProducerFinderAgent:
    def __init__(self):
        self.ollama = ollama_service
        self.demo_mode = False
        self.geocoding = geocoding_service

    async def initialize(self):
        self.demo_mode = not await self.ollama.is_available()

    async def find_by_product(self, product_name: str) -> Dict[str, Any]:
        if self.demo_mode:
            return self._demo_find_by_product(product_name)

        try:
            response = await self.ollama.generate(
                prompt=f"Найди производителя для продукта: {product_name}",
                system="Ты эксперт по производителям Краснодарского края. Определи тип производителя.",
            )

            producers = search_producers(product_name)
            if producers:
                return self._format_producer_result(producers[0])

            return self._demo_find_by_product(product_name)

        except Exception:
            return self._demo_find_by_product(product_name)

    async def find_by_name(self, producer_name: str) -> Optional[Dict[str, Any]]:
        producers = search_producers(producer_name)
        if producers:
            return self._format_producer_result(producers[0])
        return None

    async def find_by_type(self, producer_type: str) -> List[Dict[str, Any]]:
        producers = get_producers_by_type(producer_type)
        return [self._format_producer_result(p) for p in producers]

    async def find_by_region(self, region: str) -> List[Dict[str, Any]]:
        producers = get_producers_by_region(region)
        return [self._format_producer_result(p) for p in producers]

    async def find_nearby(
        self, latitude: float, longitude: float, radius_km: float = 50
    ) -> List[Dict[str, Any]]:
        producers = get_producers_nearby(latitude, longitude, radius_km)
        result = []

        for producer in producers:
            route = self.geocoding.get_route_info(
                latitude,
                longitude,
                producer.get("latitude", latitude),
                producer.get("longitude", longitude),
            )
            producer_result = self._format_producer_result(producer)
            producer_result["route"] = route
            result.append(producer_result)

        return result

    async def get_producer_details(self, producer_id: str) -> Optional[Dict[str, Any]]:
        producer = get_producer_by_id(producer_id)
        if not producer:
            return None

        result = self._format_producer_result(producer)

        products = get_products_by_producer(producer_id)
        result["products"] = [
            {"id": p["id"], "name": p["name"], "category": p["category"]}
            for p in products
        ]

        return result

    def _demo_find_by_product(self, product_name: str) -> Dict[str, Any]:
        producers = search_producers(product_name)

        if not producers:
            all_producers = get_all_producers()

            text_lower = product_name.lower()
            if any(w in text_lower for w in ["вино", "вина"]):
                all_producers = [
                    p for p in all_producers if p.get("producer_type") == "winery"
                ]
            elif any(w in text_lower for w in ["сыр", "молоч"]):
                all_producers = [
                    p
                    for p in all_producers
                    if p.get("producer_type") == "cheese_factory"
                ]
            elif any(w in text_lower for w in ["мясо", "колбас"]):
                all_producers = [
                    p
                    for p in all_producers
                    if p.get("producer_type") == "meat_processing"
                ]
            elif any(w in text_lower for w in ["мёд", "мед"]):
                all_producers = [
                    p for p in all_producers if p.get("producer_type") == "honey_farm"
                ]

            if all_producers:
                return {
                    "producer": self._format_producer_result(all_producers[0]),
                    "alternatives": [
                        self._format_producer_result(p) for p in all_producers[1:4]
                    ],
                    "source": "demo",
                }

            return {
                "error": "Производитель не найден",
                "suggestion": "Попробуйте уточнить название продукта",
                "source": "demo",
            }

        return {
            "producer": self._format_producer_result(producers[0]),
            "alternatives": [self._format_producer_result(p) for p in producers[1:3]],
            "source": "demo_database",
        }

    def _format_producer_result(self, producer: dict) -> Dict[str, Any]:
        return {
            "id": producer.get("id"),
            "name": producer.get("name"),
            "producer_type": producer.get("producer_type"),
            "region": producer.get("region"),
            "city": producer.get("city"),
            "address": producer.get("address"),
            "description": producer.get("description"),
            "phone": producer.get("phone"),
            "email": producer.get("email"),
            "website": producer.get("website"),
            "working_hours": producer.get("working_hours"),
            "rating": producer.get("rating"),
            "reviews_count": producer.get("reviews_count"),
            "distance_km": producer.get("distance_km"),
        }


producer_finder_agent = ProducerFinderAgent()

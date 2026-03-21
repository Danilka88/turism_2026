from typing import Optional, Dict, Any, List
from database.degustations_db import (
    get_all_degustations,
    get_degustation_by_id,
    get_degustations_by_producer,
    get_degustations_by_type,
)
from database.producers_db import get_producer_by_id
from prompts.product_analysis import DEGUSTATION_PROMPT
import json


class DegustationAgent:
    def __init__(self):
        self.demo_mode = False

    async def initialize(self):
        from services.ollama_service import ollama_service

        self.ollama = ollama_service
        self.demo_mode = not await self.ollama.is_available()

    async def get_all_degustations(self) -> List[Dict[str, Any]]:
        degustations = get_all_degustations()
        return [self._format_degustation(d) for d in degustations]

    async def get_degustation_by_id(self, deg_id: str) -> Optional[Dict[str, Any]]:
        degustation = get_degustation_by_id(deg_id)
        if not degustation:
            return None

        result = self._format_degustation(degustation)

        producer = get_producer_by_id(degustation.get("producer_id"))
        if producer:
            result["producer"] = self._format_producer_summary(producer)

        return result

    async def get_degustations_for_producer(
        self, producer_id: str
    ) -> List[Dict[str, Any]]:
        degustations = get_degustations_by_producer(producer_id)
        return [self._format_degustation(d) for d in degustations]

    async def get_degustations_by_type(self, deg_type: str) -> List[Dict[str, Any]]:
        degustations = get_degustations_by_type(deg_type)
        return [self._format_degustation(d) for d in degustations]

    async def recommend_degustation(
        self,
        producer_id: Optional[str] = None,
        guest_count: int = 4,
        duration_preference: Optional[str] = None,
    ) -> Dict[str, Any]:
        if producer_id:
            degustations = get_degustations_by_producer(producer_id)
        else:
            degustations = get_all_degustations()

        if not degustations:
            return {
                "error": "Дегустации не найдены",
                "suggestion": "Попробуйте другой тип или производителя",
            }

        best_match = None
        for deg in degustations:
            min_g = deg.get("min_guests", 1)
            max_g = deg.get("max_guests", 100)

            if min_g <= guest_count <= max_g:
                if best_match is None:
                    best_match = deg
                elif deg.get("rating", 0) > best_match.get("rating", 0):
                    best_match = deg

        if not best_match:
            best_match = max(degustations, key=lambda x: x.get("rating", 0))

        result = self._format_degustation(best_match)
        result["recommendation_reason"] = self._get_recommendation_reason(
            best_match, guest_count
        )
        result["estimated_total"] = best_match.get("price_per_person", 0) * guest_count

        producer = get_producer_by_id(best_match.get("producer_id"))
        if producer:
            result["producer"] = self._format_producer_summary(producer)

        return result

    async def create_custom_degustation(
        self, producer_id: str, items: List[str], duration_minutes: int = 60
    ) -> Dict[str, Any]:
        producer = get_producer_by_id(producer_id)
        if not producer:
            return {"error": "Производитель не найден"}

        producer_type = producer.get("producer_type", "")

        custom_deg = {
            "id": f"custom_{producer_id[:6]}",
            "name": "Индивидуальная дегустация",
            "description": f"Дегустация из {len(items)} позиций",
            "producer_id": producer_id,
            "degustation_type": self._infer_type_from_producer(producer_type),
            "duration_minutes": duration_minutes,
            "price_per_person": self._calculate_price(len(items), duration_minutes),
            "min_guests": 2,
            "max_guests": 10,
            "items": items,
            "pairing_suggestions": self._suggest_pairings(items),
            "is_custom": True,
        }

        result = self._format_degustation(custom_deg)
        result["producer"] = self._format_producer_summary(producer)

        return result

    async def get_wine_degustations(self) -> List[Dict[str, Any]]:
        return await self.get_degustations_by_type("wine")

    async def get_cheese_degustations(self) -> List[Dict[str, Any]]:
        return await self.get_degustations_by_type("cheese")

    async def get_mixed_degustations(self) -> List[Dict[str, Any]]:
        return await self.get_degustations_by_type("mixed")

    def _format_degustation(self, deg: dict) -> Dict[str, Any]:
        return {
            "id": deg.get("id"),
            "name": deg.get("name"),
            "description": deg.get("description"),
            "degustation_type": deg.get("degustation_type"),
            "duration_minutes": deg.get("duration_minutes"),
            "price_per_person": deg.get("price_per_person"),
            "min_guests": deg.get("min_guests"),
            "max_guests": deg.get("max_guests"),
            "items": deg.get("items", []),
            "pairing_suggestions": deg.get("pairing_suggestions", []),
            "rating": deg.get("rating"),
            "is_custom": deg.get("is_custom", False),
        }

    def _format_producer_summary(self, producer: dict) -> Dict[str, Any]:
        return {
            "id": producer.get("id"),
            "name": producer.get("name"),
            "producer_type": producer.get("producer_type"),
            "region": producer.get("region"),
            "city": producer.get("city"),
            "rating": producer.get("rating"),
            "phone": producer.get("phone"),
            "working_hours": producer.get("working_hours"),
        }

    def _infer_type_from_producer(self, producer_type: str) -> str:
        type_mapping = {
            "winery": "wine",
            "cheese_factory": "cheese",
            "meat_processing": "meat",
            "honey_farm": "honey",
            "farm": "mixed",
        }
        return type_mapping.get(producer_type, "mixed")

    def _calculate_price(self, items_count: int, duration: int) -> float:
        base_price = items_count * 300
        duration_multiplier = duration / 60
        return round(base_price * duration_multiplier, -1)

    def _suggest_pairings(self, items: List[str]) -> List[str]:
        pairings = []
        items_text = " ".join(items).lower()

        if any(w in items_text for w in ["вино", "вина"]):
            pairings.extend(["Сыры", "Мясная нарезка", "Фрукты"])
        if any(w in items_text for w in ["сыр", "брынз"]):
            pairings.extend(["Мёд", "Орехи", "Виноград"])
        if any(w in items_text for w in ["мясо", "колбас"]):
            pairings.extend(["Хрен", "Горчица", "Чёрный хлеб"])

        if not pairings:
            pairings = ["Хлеб", "Оливки", "Орехи"]

        return pairings[:5]

    def _get_recommendation_reason(self, deg: dict, guest_count: int) -> str:
        reasons = []

        if deg.get("min_guests", 0) <= guest_count <= deg.get("max_guests", 100):
            reasons.append("Размер группы подходит")

        rating = deg.get("rating", 0)
        if rating >= 4.8:
            reasons.append("Высокий рейтинг")
        elif rating >= 4.5:
            reasons.append("Хороший рейтинг")

        duration = deg.get("duration_minutes", 0)
        if duration <= 90:
            reasons.append("Оптимальная продолжительность")

        return ". ".join(reasons) if reasons else "Подходящая дегустация"


degustation_agent = DegustationAgent()

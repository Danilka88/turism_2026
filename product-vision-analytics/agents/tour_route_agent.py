from typing import Optional, Dict, Any, List
from services.ollama_service import ollama_service
from services.geocoding_service import geocoding_service
from database.tours_db import (
    get_tours_by_producer,
    get_tour_by_id,
    get_all_tours,
    get_tours_by_type,
    search_tours,
    get_popular_tours,
)
from database.producers_db import get_producer_by_id
from prompts.product_analysis import ROUTE_FORMATION_PROMPT
import json


class TourRouteAgent:
    def __init__(self):
        self.ollama = ollama_service
        self.geocoding = geocoding_service
        self.demo_mode = False

    async def initialize(self):
        self.demo_mode = not await self.ollama.is_available()

    async def get_tours_for_producer(self, producer_id: str) -> List[Dict[str, Any]]:
        tours = get_tours_by_producer(producer_id)

        producer = get_producer_by_id(producer_id)

        result = []
        for tour in tours:
            tour_result = self._format_tour_result(tour)

            if producer:
                tour_result["producer"] = {
                    "name": producer.get("name"),
                    "region": producer.get("region"),
                    "city": producer.get("city"),
                }

            result.append(tour_result)

        return result

    async def get_tour_details(self, tour_id: str) -> Optional[Dict[str, Any]]:
        tour = get_tour_by_id(tour_id)
        if not tour:
            return None

        result = self._format_tour_result(tour)

        producer = get_producer_by_id(tour.get("producer_id"))
        if producer:
            result["producer"] = self._format_producer_summary(producer)
            result["coordinates"] = {
                "latitude": producer.get("latitude"),
                "longitude": producer.get("longitude"),
            }

        return result

    async def get_tours_by_type(self, tour_type: str) -> List[Dict[str, Any]]:
        tours = get_tours_by_type(tour_type)
        return [self._format_tour_result(tour) for tour in tours]

    async def search_tours(self, query: str) -> List[Dict[str, Any]]:
        tours = search_tours(query)
        return [self._format_tour_result(tour) for tour in tours]

    async def get_popular_tours(self, limit: int = 5) -> List[Dict[str, Any]]:
        tours = get_popular_tours(limit)
        return [self._format_tour_result(tour) for tour in tours]

    async def get_tours_with_route(
        self, tour_id: str, user_lat: float, user_lon: float
    ) -> Optional[Dict[str, Any]]:
        tour = await self.get_tour_details(tour_id)
        if not tour or not tour.get("coordinates"):
            return None

        producer = get_producer_by_id(tour.get("producer", {}).get("id"))
        if not producer:
            return None

        route = self.geocoding.get_route_info(
            user_lat,
            user_lon,
            producer.get("latitude", user_lat),
            producer.get("longitude", user_lon),
        )

        tour["route"] = route

        nearby_tours = get_tours_by_producer(producer.get("id"))
        tour["producer_tours_count"] = len(nearby_tours)

        return tour

    async def form_route_from_product(
        self,
        product_info: Dict[str, Any],
        user_lat: Optional[float] = None,
        user_lon: Optional[float] = None,
    ) -> Dict[str, Any]:
        producer_id = product_info.get("producer_id") or product_info.get(
            "producer", {}
        ).get("id")

        if not producer_id:
            return {
                "error": "Не указан производитель",
                "available_tours": await self.get_popular_tours(3),
            }

        producer = get_producer_by_id(producer_id)
        if not producer:
            return {
                "error": "Производитель не найден",
                "available_tours": await self.get_popular_tours(3),
            }

        tours = get_tours_by_producer(producer_id)

        result = {
            "producer": self._format_producer_summary(producer),
            "tours": [self._format_tour_result(t) for t in tours],
            "nearest_tour": self._format_tour_result(tours[0]) if tours else None,
        }

        if (
            user_lat
            and user_lon
            and producer.get("latitude")
            and producer.get("longitude")
        ):
            route = self.geocoding.get_route_info(
                user_lat, user_lon, producer.get("latitude"), producer.get("longitude")
            )
            result["route_to_producer"] = route

        return result

    async def get_all_tour_types(self) -> List[str]:
        return ["excursion", "master_class", "degustation", "meet_producer", "workshop"]

    def _format_tour_result(self, tour: dict) -> Dict[str, Any]:
        return {
            "id": tour.get("id"),
            "title": tour.get("title"),
            "description": tour.get("description"),
            "tour_type": tour.get("tour_type"),
            "duration_minutes": tour.get("duration_minutes"),
            "price": tour.get("price"),
            "max_guests": tour.get("max_guests"),
            "includes": tour.get("includes", []),
            "requirements": tour.get("requirements", []),
            "schedule": tour.get("schedule"),
            "rating": tour.get("rating"),
            "reviews_count": tour.get("reviews_count"),
            "producer_id": tour.get("producer_id"),
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
            "website": producer.get("website"),
        }


tour_route_agent = TourRouteAgent()

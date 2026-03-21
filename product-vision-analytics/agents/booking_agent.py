from typing import Optional, Dict, Any
from datetime import date, datetime, timedelta
from services.booking_service import booking_service
from database.tours_db import get_tour_by_id, get_tours_by_producer
from database.producers_db import get_producer_by_id
from prompts.product_analysis import BOOKING_RECOMMENDATION_PROMPT
import json


class BookingAgent:
    def __init__(self):
        self.booking_service = booking_service
        self.demo_mode = False

    async def initialize(self):
        from services.ollama_service import ollama_service

        self.ollama = ollama_service
        self.demo_mode = not await self.ollama.is_available()

    async def check_availability(
        self, tour_id: str, booking_date: str, time: str, guests: int
    ) -> Dict[str, Any]:
        tour = get_tour_by_id(tour_id)
        if not tour:
            return {"available": False, "error": "Тур не найден"}

        max_guests = tour.get("max_guests", 1)
        available = self.booking_service.check_availability(
            tour_id, booking_date, time, guests, max_guests
        )

        return {
            "available": available,
            "tour_id": tour_id,
            "date": booking_date,
            "time": time,
            "guests": guests,
            "max_guests": max_guests,
            "price_per_person": tour.get("price"),
            "total_price": tour.get("price", 0) * guests,
        }

    async def create_booking(self, booking_data: dict) -> Dict[str, Any]:
        tour_id = booking_data.get("tour_id")
        tour = get_tour_by_id(tour_id)

        if not tour:
            return {"success": False, "error": "Тур не найден"}

        guests = booking_data.get("guests", 1)
        total_price = tour.get("price", 0) * guests

        booking = self.booking_service.create_booking(
            {**booking_data, "total_price": total_price}
        )

        result = {
            "success": True,
            "booking": self._format_booking(booking),
            "tour": {
                "id": tour.get("id"),
                "title": tour.get("title"),
                "duration_minutes": tour.get("duration_minutes"),
                "price_per_person": tour.get("price"),
                "includes": tour.get("includes", []),
            },
        }

        producer = get_producer_by_id(tour.get("producer_id"))
        if producer:
            result["producer"] = {
                "name": producer.get("name"),
                "phone": producer.get("phone"),
                "address": producer.get("address"),
                "working_hours": producer.get("working_hours"),
            }

        return result

    async def get_booking(self, booking_id: str) -> Optional[Dict[str, Any]]:
        booking = self.booking_service.get_booking(booking_id)
        if not booking:
            return None

        result = self._format_booking(booking)

        tour = get_tour_by_id(booking.get("tour_id"))
        if tour:
            result["tour"] = {
                "id": tour.get("id"),
                "title": tour.get("title"),
                "duration_minutes": tour.get("duration_minutes"),
            }

        return result

    async def cancel_booking(self, booking_id: str) -> Dict[str, Any]:
        success = self.booking_service.cancel_booking(booking_id)

        if success:
            return {
                "success": True,
                "message": "Бронирование отменено",
                "booking_id": booking_id,
            }

        return {"success": False, "error": "Бронирование не найдено"}

    async def confirm_booking(self, booking_id: str) -> Dict[str, Any]:
        booking = self.booking_service.confirm_booking(booking_id)

        if booking:
            return {
                "success": True,
                "message": "Бронирование подтверждено",
                "booking": self._format_booking(booking),
            }

        return {"success": False, "error": "Бронирование не найдено"}

    async def get_available_slots(
        self, tour_id: str, start_date: Optional[str] = None, days: int = 7
    ) -> Dict[str, Any]:
        tour = get_tour_by_id(tour_id)
        if not tour:
            return {"error": "Тур не найден", "slots": []}

        if not start_date:
            start_date = date.today().strftime("%Y-%m-%d")

        slots = []
        schedule = tour.get("schedule", "")

        current_date = datetime.strptime(start_date, "%Y-%m-%d")

        for i in range(days):
            check_date = (current_date + timedelta(days=i)).strftime("%Y-%m-%d")
            day_slots = self.booking_service.generate_slots(
                tour_id, check_date, schedule
            )
            slots.extend(day_slots)

        return {
            "tour_id": tour_id,
            "tour_title": tour.get("title"),
            "start_date": start_date,
            "slots": slots,
        }

    async def recommend_booking(self, tour_id: str, guests: int = 2) -> Dict[str, Any]:
        tour = get_tour_by_id(tour_id)
        if not tour:
            return {"error": "Тур не найден"}

        best_date = None
        best_time = None

        today = date.today()
        schedule = tour.get("schedule", "10:00, 14:00")
        times = [t.strip() for t in schedule.split(",")]

        for i in range(7):
            check_date = today + timedelta(days=i)

            for time in times:
                if self.booking_service.check_availability(
                    tour_id,
                    check_date.strftime("%Y-%m-%d"),
                    time,
                    guests,
                    tour.get("max_guests", 1),
                ):
                    best_date = check_date.strftime("%Y-%m-%d")
                    best_time = time
                    break

            if best_date:
                break

        if not best_date:
            return {
                "error": "Нет доступных мест на ближайшую неделю",
                "suggestion": "Попробуйте изменить количество гостей или дату",
            }

        total_price = tour.get("price", 0) * guests

        producer = get_producer_by_id(tour.get("producer_id"))

        result = {
            "tour": {
                "id": tour.get("id"),
                "title": tour.get("title"),
                "duration_minutes": tour.get("duration_minutes"),
                "price_per_person": tour.get("price"),
            },
            "recommended_date": best_date,
            "recommended_time": best_time,
            "guests": guests,
            "total_price": total_price,
            "confirmation_needed": True,
            "contact_phone": producer.get("phone") if producer else None,
        }

        if producer:
            result["producer"] = {
                "name": producer.get("name"),
                "address": producer.get("address"),
                "phone": producer.get("phone"),
                "working_hours": producer.get("working_hours"),
            }

        return result

    async def get_bookings_by_date(self, booking_date: str) -> list:
        bookings = self.booking_service.get_bookings_by_date(booking_date)
        return [self._format_booking(b) for b in bookings]

    def _format_booking(self, booking: dict) -> Dict[str, Any]:
        return {
            "id": booking.get("id"),
            "confirmation_code": booking.get("confirmation_code"),
            "tour_id": booking.get("tour_id"),
            "date": str(booking.get("date")),
            "time": booking.get("time"),
            "guests": booking.get("guests"),
            "contact_name": booking.get("contact_name"),
            "contact_phone": booking.get("contact_phone"),
            "contact_email": booking.get("contact_email"),
            "special_requests": booking.get("special_requests"),
            "status": booking.get("status"),
            "total_price": booking.get("total_price"),
            "created_at": booking.get("created_at"),
        }


booking_agent = BookingAgent()

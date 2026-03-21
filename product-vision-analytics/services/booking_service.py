from typing import Dict, List, Optional
from datetime import datetime, timedelta
import uuid


class BookingService:
    def __init__(self):
        self.bookings: Dict[str, dict] = {}
        self._slots_cache: Dict[str, List[dict]] = {}

    def generate_slots(
        self, tour_id: str, date: str, schedule: Optional[str] = None
    ) -> List[dict]:
        if not schedule:
            schedule = "10:00, 12:00, 14:00, 16:00"

        times = [t.strip() for t in schedule.split(",")]

        slots = []
        for time in times:
            slot_id = f"{tour_id}_{date}_{time.replace(':', '')}"
            slots.append(
                {
                    "slot_id": slot_id,
                    "tour_id": tour_id,
                    "date": date,
                    "time": time,
                    "available": True,
                    "booked_count": 0,
                }
            )

        return slots

    def check_availability(
        self, tour_id: str, date: str, time: str, guests: int, max_guests: int
    ) -> bool:
        booking_key = f"{tour_id}_{date}_{time}"

        if booking_key in self.bookings:
            total_booked = sum(
                b["guests"]
                for b in self.bookings[booking_key]
                if b.get("status") != "cancelled"
            )
            return (total_booked + guests) <= max_guests

        return True

    def create_booking(self, booking_data: dict) -> dict:
        booking_id = f"book_{uuid.uuid4().hex[:8]}"

        booking = {
            "id": booking_id,
            "tour_id": booking_data.get("tour_id"),
            "date": booking_data.get("date"),
            "time": booking_data.get("time"),
            "guests": booking_data.get("guests"),
            "contact_name": booking_data.get("contact_name"),
            "contact_phone": booking_data.get("contact_phone"),
            "contact_email": booking_data.get("contact_email"),
            "special_requests": booking_data.get("special_requests"),
            "status": "pending",
            "total_price": booking_data.get("total_price", 0),
            "confirmation_code": self._generate_confirmation_code(),
            "created_at": datetime.now().isoformat(),
            "updated_at": None,
        }

        booking_key = f"{booking['tour_id']}_{booking['date']}_{booking['time']}"
        if booking_key not in self.bookings:
            self.bookings[booking_key] = []
        self.bookings[booking_key].append(booking)

        return booking

    def _generate_confirmation_code(self) -> str:
        import random
        import string

        return "".join(random.choices(string.ascii_uppercase + string.digits, k=8))

    def get_booking(self, booking_id: str) -> Optional[dict]:
        for bookings in self.bookings.values():
            for booking in bookings:
                if booking["id"] == booking_id:
                    return booking
        return None

    def get_bookings_by_date(self, date: str) -> List[dict]:
        result = []
        for bookings in self.bookings.values():
            for booking in bookings:
                if str(booking.get("date")) == str(date):
                    result.append(booking)
        return result

    def update_status(self, booking_id: str, status: str) -> Optional[dict]:
        for bookings in self.bookings.values():
            for booking in bookings:
                if booking["id"] == booking_id:
                    booking["status"] = status
                    booking["updated_at"] = datetime.now().isoformat()
                    return booking
        return None

    def cancel_booking(self, booking_id: str) -> bool:
        booking = self.update_status(booking_id, "cancelled")
        return booking is not None

    def confirm_booking(self, booking_id: str) -> Optional[dict]:
        return self.update_status(booking_id, "confirmed")

    def get_upcoming_bookings(self, days: int = 7) -> List[dict]:
        result = []
        cutoff_date = (datetime.now() + timedelta(days=days)).strftime("%Y-%m-%d")

        for bookings in self.bookings.values():
            for booking in bookings:
                if str(booking.get("date")) <= cutoff_date and booking.get(
                    "status"
                ) in ["pending", "confirmed"]:
                    result.append(booking)

        return sorted(result, key=lambda x: str(x.get("date")))


booking_service = BookingService()

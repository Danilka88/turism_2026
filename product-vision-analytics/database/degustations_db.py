from typing import Dict, List, Optional
from datetime import datetime, date
import uuid


DEGUSTATIONS_DB: Dict[str, dict] = {}
BOOKINGS_DB: Dict[str, dict] = {}


def init_degustations_db():
    degustations = [
        {
            "id": "deg_001",
            "name": "Винильная дегустация 'Пять сортов'",
            "description": "Классическая дегустация красных и белых вин с профессиональным сомелье.",
            "producer_id": "prod_101",
            "degustation_type": "wine",
            "duration_minutes": 90,
            "price_per_person": 2500,
            "min_guests": 4,
            "max_guests": 15,
            "items": [
                "Вино белое сухое 'Шардоне Резерв'",
                "Вино красное сухое 'Каберне Совиньон'",
                "Вино красное выдержанное 'Мерло'",
                "Вино розовое 'Пино Нуар розе'",
                "Вино сладкое 'Мускат'",
            ],
            "pairing_suggestions": [
                "Сыры (козий, бри)",
                "Мясная нарезка",
                "Фруктовая тарелка",
            ],
            "photo_url": "/images/deg_wine.jpg",
            "rating": 4.8,
        },
        {
            "id": "deg_002",
            "name": "Сырная дегустация 'Сырный калейдоскоп'",
            "description": "Попробуйте 8 видов сыров Адыгеи и узнайте их особенности.",
            "producer_id": "prod_103",
            "degustation_type": "cheese",
            "duration_minutes": 60,
            "price_per_person": 1500,
            "min_guests": 3,
            "max_guests": 12,
            "items": [
                "Адыгейский сыр классический",
                "Адыгейский сыр копчёный",
                "Сулугуни свежий",
                "Сулугуни копчёный",
                "Брынза",
                "Рикотта",
                "Камамбер",
                "Гауда",
            ],
            "pairing_suggestions": ["Мёд", "Орехи", "Виноград", "Инжир"],
            "photo_url": "/images/deg_cheese.jpg",
            "rating": 4.9,
        },
        {
            "id": "deg_003",
            "name": "Мясная дегустация 'Кубанские деликатесы'",
            "description": "Продегустируйте лучшие колбасы и копчёности Краснодарского края.",
            "producer_id": "prod_105",
            "degustation_type": "meat",
            "duration_minutes": 60,
            "price_per_person": 1800,
            "min_guests": 4,
            "max_guests": 20,
            "items": [
                "Колбаса 'Кубанская' варёная",
                "Колбаса 'Домашняя' полукопчёная",
                "Сервелат 'Московский'",
                "Грудинка копчёная",
                "Корейка копчёная",
                "Буженина",
                "Карбонад",
                "Шпикачки",
            ],
            "pairing_suggestions": [
                "Чёрный хлеб",
                "Маринованные овощи",
                "Горчица",
                "Хрен",
            ],
            "photo_url": "/images/deg_meat.jpg",
            "rating": 4.6,
        },
        {
            "id": "deg_004",
            "name": "Медовая дегустация 'Ароматы гор'",
            "description": "Откройте для себя мир вкусов настоящего горного мёда.",
            "producer_id": "prod_106",
            "degustation_type": "honey",
            "duration_minutes": 45,
            "price_per_person": 1200,
            "min_guests": 2,
            "max_guests": 15,
            "items": [
                "Мёд разнотравье",
                "Мёд липовый",
                "Мёд гречишный",
                "Мёд с прополисом",
                "Перга",
                "Мёд в сотах",
            ],
            "pairing_suggestions": ["Чай", "Блины", "Творог", "Сыр"],
            "photo_url": "/images/deg_honey.jpg",
            "rating": 4.9,
        },
        {
            "id": "deg_005",
            "name": "Смешанная дегустация 'Кубанский стол'",
            "description": "Полный набор продуктов Краснодарского края для настоящих гурманов.",
            "producer_id": "prod_101",
            "degustation_type": "mixed",
            "duration_minutes": 120,
            "price_per_person": 4000,
            "min_guests": 4,
            "max_guests": 12,
            "items": [
                "Вино красное 'Каберне Резерв'",
                "Вино белое 'Шардоне'",
                "Сыр адыгейский",
                "Сыр сулугуни",
                "Колбаса 'Кубанская'",
                "Мёд горный",
                "Варенье из инжира",
                "Оливки кубанские",
                "Чурчхела",
            ],
            "pairing_suggestions": ["Орехи", "Фрукты", "Мясо", "Хлеб"],
            "photo_url": "/images/deg_mixed.jpg",
            "rating": 4.9,
        },
    ]

    for deg in degustations:
        DEGUSTATIONS_DB[deg["id"]] = deg


init_degustations_db()


def get_all_degustations() -> List[dict]:
    return list(DEGUSTATIONS_DB.values())


def get_degustation_by_id(deg_id: str) -> Optional[dict]:
    return DEGUSTATIONS_DB.get(deg_id)


def get_degustations_by_producer(producer_id: str) -> List[dict]:
    return [d for d in DEGUSTATIONS_DB.values() if d.get("producer_id") == producer_id]


def get_degustations_by_type(deg_type: str) -> List[dict]:
    return [
        d for d in DEGUSTATIONS_DB.values() if d.get("degustation_type") == deg_type
    ]


def create_booking(booking_data: dict) -> dict:
    tour_id = booking_data.get("tour_id")
    guests = booking_data.get("guests", 1)

    from database.tours_db import get_tour_by_id

    tour = get_tour_by_id(tour_id)
    if not tour:
        raise ValueError(f"Тур с ID {tour_id} не найден")

    if guests > tour.get("max_guests"):
        raise ValueError(
            f"Превышено максимальное количество гостей: {tour.get('max_guests')}"
        )

    total_price = tour.get("price") * guests

    booking = {
        "id": f"book_{uuid.uuid4().hex[:8]}",
        "tour_id": tour_id,
        "date": booking_data.get("date"),
        "time": booking_data.get("time"),
        "guests": guests,
        "contact_name": booking_data.get("contact_name"),
        "contact_phone": booking_data.get("contact_phone"),
        "contact_email": booking_data.get("contact_email"),
        "special_requests": booking_data.get("special_requests"),
        "status": "pending",
        "total_price": total_price,
        "created_at": datetime.now().isoformat(),
        "updated_at": None,
    }

    BOOKINGS_DB[booking["id"]] = booking
    return booking


def get_booking_by_id(booking_id: str) -> Optional[dict]:
    return BOOKINGS_DB.get(booking_id)


def get_bookings_by_tour(tour_id: str) -> List[dict]:
    return [b for b in BOOKINGS_DB.values() if b.get("tour_id") == tour_id]


def get_bookings_by_date(booking_date: date) -> List[dict]:
    return [b for b in BOOKINGS_DB.values() if str(b.get("date")) == str(booking_date)]


def update_booking_status(booking_id: str, status: str) -> Optional[dict]:
    if booking_id in BOOKINGS_DB:
        BOOKINGS_DB[booking_id]["status"] = status
        BOOKINGS_DB[booking_id]["updated_at"] = datetime.now().isoformat()
        return BOOKINGS_DB[booking_id]
    return None


def cancel_booking(booking_id: str) -> Optional[dict]:
    return update_booking_status(booking_id, "cancelled")

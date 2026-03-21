from typing import Dict, List, Optional
from datetime import datetime
import uuid


TOURS_DB: Dict[str, dict] = {}


def init_tours_db():
    tours = [
        {
            "id": "tour_001",
            "title": "Экскурсия по винодельне 'Фанагория'",
            "description": "Познакомьтесь с историей крупнейшей винодельни России. Посетите старинные подвалы, узнаете о технологии производства вина и продегустируете лучшие сорта.",
            "producer_id": "prod_101",
            "tour_type": "excursion",
            "duration_minutes": 120,
            "price": 1500,
            "max_guests": 25,
            "includes": [
                "Трансфер от автовокзала Темрюка",
                "Экскурсия по производству (1 час)",
                "Посещение старинных подвалов",
                "Дегустация 5 вин",
                "Пирожок и чай",
            ],
            "requirements": ["Возраст 18+ для дегустации"],
            "schedule": "Пн, Ср, Пт, Сб в 11:00 и 15:00",
            "photo_urls": [
                "/images/tour_fanagoria_1.jpg",
                "/images/tour_fanagoria_2.jpg",
            ],
            "rating": 4.8,
            "reviews_count": 890,
            "is_active": True,
        },
        {
            "id": "tour_002",
            "title": "Мастер-класс 'Сыроварение для начинающих'",
            "description": "Научитесь готовить настоящий адыгейский сыр под руководством опытных сыроделов. Узнаете все секреты традиционного производства.",
            "producer_id": "prod_103",
            "tour_type": "master_class",
            "duration_minutes": 180,
            "price": 2500,
            "max_guests": 10,
            "includes": [
                "Мастер-класс по сыроварению (2 часа)",
                "Все ингредиенты",
                "Дегустация 5 видов сыра",
                "Обед (блюда с сыром)",
                "Сертификат сыродела",
                "250г домашнего сыра на вынос",
            ],
            "requirements": ["Желательно закрытая обувь"],
            "schedule": "Сб, Вс в 10:00",
            "photo_urls": ["/images/tour_mamonki_1.jpg"],
            "rating": 4.9,
            "reviews_count": 420,
            "is_active": True,
        },
        {
            "id": "tour_003",
            "title": "Винификация: от винограда до бутылки",
            "description": "Уникальная возможность пройти все этапы производства вина вместе с виноделами. Сбор урожая (в сезон), прессование, брожение.",
            "producer_id": "prod_101",
            "tour_type": "workshop",
            "duration_minutes": 240,
            "price": 3500,
            "max_guests": 8,
            "includes": [
                "Экскурсия по виноградникам",
                "Сбор винограда (сезон)",
                "Участие в прессовании",
                "Дегустация 8 вин",
                "Обед на террасе с видом на виноградники",
                "Бутылка вина собственного розлива",
            ],
            "requirements": [
                "Возраст 18+",
                "Удобная одежда",
                "Сезон: сентябрь-октябрь",
            ],
            "schedule": "Пт, Сб по предварительной записи",
            "photo_urls": ["/images/tour_fanagoria_vin.jpg"],
            "rating": 5.0,
            "reviews_count": 156,
            "is_active": True,
        },
        {
            "id": "tour_004",
            "title": "Знакомство с пчеловодством",
            "description": "Узнайте всё о жизни пчёл, посетите настоящую пасеку и продегустируйте натуральный мёд разных сортов.",
            "producer_id": "prod_106",
            "tour_type": "excursion",
            "duration_minutes": 150,
            "price": 1800,
            "max_guests": 15,
            "includes": [
                "Экскурсия по пасеке",
                "Знакомство с жизнью пчёл",
                "Дегустация 6 видов мёда",
                "Чай с мёдом и блинами",
                "Бутылка мёда 500г в подарок",
            ],
            "requirements": ["Отсутствие аллергии на пчелиные укусы"],
            "schedule": "Ежедневно в 10:00 и 14:00",
            "photo_urls": ["/images/tour_paseka_1.jpg", "/images/tour_paseka_2.jpg"],
            "rating": 4.9,
            "reviews_count": 310,
            "is_active": True,
        },
        {
            "id": "tour_005",
            "title": "Экскурсия 'За кулибами мясокомбината'",
            "description": "Посетите современное мясоперерабатывающее производство и узнайте, как делают качественные колбасы и копчёности.",
            "producer_id": "prod_105",
            "tour_type": "excursion",
            "duration_minutes": 90,
            "price": 1200,
            "max_guests": 20,
            "includes": [
                "Экскурсия по производственным цехам",
                "Рассказ о технологии",
                "Дегустация 8 видов колбас",
                "Пакет продукции в подарок",
            ],
            "requirements": ["Предварительная запись обязательна"],
            "schedule": "Пн-Чт в 11:00",
            "photo_urls": ["/images/tour_meat_1.jpg"],
            "rating": 4.5,
            "reviews_count": 245,
            "is_active": True,
        },
        {
            "id": "tour_006",
            "title": "Дегустация игристых вин 'Абрау-Дюрсо'",
            "description": "Попробуйте лучшие игристые вина, произведённые классическим методом, и узнайте историю завода.",
            "producer_id": "prod_102",
            "tour_type": "degustation",
            "duration_minutes": 90,
            "price": 2000,
            "max_guests": 20,
            "includes": [
                "Экскурсия по заводу",
                "Посещение тоннелей выдержки",
                "Дегустация 7 игристых вин",
                "Икорная закуска",
            ],
            "requirements": ["Возраст 18+"],
            "schedule": "Ежедневно в 12:00, 15:00, 18:00",
            "photo_urls": ["/images/tour_abrau_1.jpg"],
            "rating": 4.9,
            "reviews_count": 1560,
            "is_active": True,
        },
        {
            "id": "tour_007",
            "title": "Встреча с производителем: сыроделы Адыгеи",
            "description": "Встреча с семьёй сыроделов, ужин с домашними сырами и рассказ о традициях адыгейского сыроварения.",
            "producer_id": "prod_103",
            "tour_type": "meet_producer",
            "duration_minutes": 210,
            "price": 3000,
            "max_guests": 8,
            "includes": [
                "Встреча с производителями",
                "Рассказ о истории семьи",
                "Ужин из 5 блюд с сыром",
                "Дегустация 8 видов сыра",
                "Домашнее вино",
                "Сувенирный набор",
            ],
            "requirements": ["Только по предварительной записи"],
            "schedule": "Сб вечер",
            "photo_urls": ["/images/tour_meet_cheese.jpg"],
            "rating": 5.0,
            "reviews_count": 89,
            "is_active": True,
        },
        {
            "id": "tour_008",
            "title": "Маринование по-кубански",
            "description": "Узнайте секреты квашения и маринования овощей. Приготовьте домашние заготовки и заберите их с собой.",
            "producer_id": "prod_108",
            "tour_type": "workshop",
            "duration_minutes": 150,
            "price": 2000,
            "max_guests": 12,
            "includes": [
                "Мастер-класс по маринованию",
                "Все ингредиенты и тара",
                "Приготовление 3 видов заготовок",
                "Чай и угощение",
                "Все заготовки на вынос",
            ],
            "requirements": ["Возраст 12+"],
            "schedule": "Сб, Вс в 11:00",
            "photo_urls": ["/images/tour_pickle.jpg"],
            "rating": 4.6,
            "reviews_count": 178,
            "is_active": True,
        },
        {
            "id": "tour_009",
            "title": "Коньячный мастер-класс",
            "description": "Погружение в мир коньячного производства. Дегустация коньяков разной выдержки, ужин с блюдами южной кухни.",
            "producer_id": "prod_109",
            "tour_type": "degustation",
            "duration_minutes": 180,
            "price": 3500,
            "max_guests": 15,
            "includes": [
                "Экскурсия по производству",
                "Рассказ о выдержке коньяка",
                "Дегустация 5 коньяков",
                "Сигарный мастер-класс",
                "Ужин из 5 блюд",
            ],
            "requirements": ["Возраст 21+"],
            "schedule": "Пт, Сб в 18:00",
            "photo_urls": ["/images/tour_cognac.jpg"],
            "rating": 4.8,
            "reviews_count": 234,
            "is_active": True,
        },
        {
            "id": "tour_010",
            "title": "День на молочной ферме",
            "description": "Проведите день на настоящей молочной ферме: кормление животных, доение, приготовление творога и сыра.",
            "producer_id": "prod_107",
            "tour_type": "master_class",
            "duration_minutes": 300,
            "price": 4000,
            "max_guests": 6,
            "includes": [
                "Кормление коров и телят",
                "Процесс доения",
                "Мастер-класс по сыроварению",
                "Приготовление творога",
                "Обед из молочных продуктов",
                "Набор фермерской продукции",
            ],
            "requirements": ["Удобная одежда и обувь"],
            "schedule": "Сб, Вс по предварительной записи",
            "photo_urls": ["/images/tour_ferma_1.jpg"],
            "rating": 4.9,
            "reviews_count": 156,
            "is_active": True,
        },
    ]

    for tour in tours:
        TOURS_DB[tour["id"]] = tour


init_tours_db()


def get_all_tours() -> List[dict]:
    return [t for t in TOURS_DB.values() if t.get("is_active")]


def get_tour_by_id(tour_id: str) -> Optional[dict]:
    return TOURS_DB.get(tour_id)


def get_tours_by_producer(producer_id: str) -> List[dict]:
    return [
        t
        for t in TOURS_DB.values()
        if t.get("producer_id") == producer_id and t.get("is_active")
    ]


def get_tours_by_type(tour_type: str) -> List[dict]:
    return [
        t
        for t in TOURS_DB.values()
        if t.get("tour_type") == tour_type and t.get("is_active")
    ]


def search_tours(query: str) -> List[dict]:
    query_lower = query.lower()
    results = []
    for tour in TOURS_DB.values():
        if (
            query_lower in tour.get("title", "").lower()
            or query_lower in tour.get("description", "").lower()
        ):
            results.append(tour)
    return [t for t in results if t.get("is_active")]


def get_popular_tours(limit: int = 5) -> List[dict]:
    all_tours = get_all_tours()
    return sorted(all_tours, key=lambda x: x.get("reviews_count", 0), reverse=True)[
        :limit
    ]


def get_recommended_tours(producer_id: str, limit: int = 3) -> List[dict]:
    tours = get_tours_by_producer(producer_id)
    return sorted(tours, key=lambda x: x.get("rating", 0), reverse=True)[:limit]

from typing import Dict, List, Optional
from datetime import datetime
import uuid


PRODUCERS_DB: Dict[str, dict] = {}


def init_producers_db():
    producers = [
        {
            "id": "prod_101",
            "name": "Винодельня 'Фанагория'",
            "producer_type": "winery",
            "region": "Краснодарский край",
            "city": "Темрюк",
            "address": "Темрюкский район, ст. Старотитаровская",
            "description": "Крупнейшая винодельня России. Производит вина под брендами Фанагория, Аристов, Номер 1 Резерв. Виноградники занимают более 7 000 га.",
            "website": "https://fanagoria.ru",
            "phone": "+7 (86148) 91-111",
            "email": "info@fanagoria.ru",
            "latitude": 45.2667,
            "longitude": 37.4667,
            "logo_url": "/images/fanagoria_logo.png",
            "photo_urls": ["/images/fanagoria_1.jpg", "/images/fanagoria_2.jpg"],
            "working_hours": "Пн-Сб: 09:00-18:00, Вс: 10:00-16:00",
            "rating": 4.8,
            "reviews_count": 1250,
        },
        {
            "id": "prod_102",
            "name": "Завод 'Абрау-Дюрсо'",
            "producer_type": "winery",
            "region": "Краснодарский край",
            "city": "Новороссийск",
            "address": "г. Новороссийск, с. Абрау-Дюрсо",
            "description": "Легендарный завод игристых вин. Производит игристые вина классическим методом шампанизации с 1870 года.",
            "website": "https://abrau-durso.ru",
            "phone": "+7 (8617) 79-00-00",
            "email": "info@abrau-durso.ru",
            "latitude": 44.7083,
            "longitude": 37.5917,
            "logo_url": "/images/abrau_logo.png",
            "photo_urls": ["/images/abrau_1.jpg", "/images/abrau_2.jpg"],
            "working_hours": "Ежедневно: 10:00-19:00",
            "rating": 4.9,
            "reviews_count": 2100,
        },
        {
            "id": "prod_103",
            "name": "Сыродельня 'Мамоньки'",
            "producer_type": "cheese_factory",
            "region": "Республика Адыгея",
            "city": "Майкоп",
            "address": "г. Майкоп, ул. Пионерская, 42",
            "description": "Семейная сыродельня, производящая адыгейские сыры по традиционным рецептам. Использует только местное молоко от фермерских хозяйств.",
            "website": "https://syrodelka-mamonki.ru",
            "phone": "+7 (8772) 55-55-55",
            "email": "syrodelka@mamonki.ru",
            "latitude": 44.6078,
            "longitude": 40.1058,
            "logo_url": "/images/mamonki_logo.png",
            "photo_urls": ["/images/mamonki_1.jpg", "/images/mamonki_2.jpg"],
            "working_hours": "Пн-Пт: 08:00-17:00, Сб: 09:00-14:00",
            "rating": 4.7,
            "reviews_count": 580,
        },
        {
            "id": "prod_104",
            "name": "Сырзавод 'Адыгея'",
            "producer_type": "cheese_factory",
            "region": "Республика Адыгея",
            "city": "Майкоп",
            "address": "Майкопский район, пгт. Энем",
            "description": "Современное предприятие по производству сыров. Производит более 50 видов сыров, включая сулугуни, брынзу, адыгейский сыр.",
            "website": "https://syrzavod.ru",
            "phone": "+7 (8772) 98-00-00",
            "email": "info@syrzavod.ru",
            "latitude": 44.5667,
            "longitude": 40.2167,
            "logo_url": "/images/adygea_logo.png",
            "photo_urls": ["/images/adygea_1.jpg"],
            "working_hours": "Пн-Пт: 08:00-18:00",
            "rating": 4.5,
            "reviews_count": 320,
        },
        {
            "id": "prod_105",
            "name": "Мясокомбинат 'Кубань'",
            "producer_type": "meat_processing",
            "region": "Краснодарский край",
            "city": "Краснодар",
            "address": "г. Краснодар, ул. Калинина, 325",
            "description": "Один из крупнейших мясоперерабатывающих заводов края. Производит колбасы, копчёности, мясные деликатесы.",
            "website": "https://myasokuban.ru",
            "phone": "+7 (861) 255-55-55",
            "email": "info@myasokuban.ru",
            "latitude": 45.0500,
            "longitude": 38.9833,
            "logo_url": "/images/kuban_meat_logo.png",
            "photo_urls": ["/images/kuban_meat_1.jpg"],
            "working_hours": "Пн-Пт: 08:00-17:00",
            "rating": 4.4,
            "reviews_count": 890,
        },
        {
            "id": "prod_106",
            "name": "Пасека 'Горная'",
            "producer_type": "honey_farm",
            "region": "Краснодарский край",
            "city": "Апшеронск",
            "address": "г. Апшеронск, ул. Горная, 15",
            "description": "Экологически чистая пасека в предгорьях Кавказа. Производит мёд разнотравья, липовый, гречишный мед и продукты пчеловодства.",
            "website": "https://gornaya-paseka.ru",
            "phone": "+7 (918) 123-45-67",
            "email": "paseka@gornaya.ru",
            "latitude": 44.4667,
            "longitude": 39.7333,
            "logo_url": "/images/gornaya_logo.png",
            "photo_urls": ["/images/paseka_1.jpg", "/images/paseka_2.jpg"],
            "working_hours": "Ежедневно: 08:00-20:00",
            "rating": 4.9,
            "reviews_count": 420,
        },
        {
            "id": "prod_107",
            "name": "Ферма 'Золотая Нива'",
            "producer_type": "farm",
            "region": "Краснодарский край",
            "city": "Тимашёвск",
            "address": "г. Тимашёвск, х. Октябрьский",
            "description": "Молочная ферма полного цикла. Производит брынзу, творог, сметану, масло из собственного молока.",
            "website": "https://ferma-zniva.ru",
            "phone": "+7 (86130) 4-55-55",
            "email": "ferma@zniva.ru",
            "latitude": 45.6167,
            "longitude": 38.9500,
            "logo_url": "/images/zniva_logo.png",
            "photo_urls": ["/images/ferma_1.jpg"],
            "working_hours": "Пн-Сб: 07:00-16:00",
            "rating": 4.6,
            "reviews_count": 280,
        },
        {
            "id": "prod_108",
            "name": "Консервный завод 'Томато'",
            "producer_type": "preserve_factory",
            "region": "Краснодарский край",
            "city": "Славянск-на-Кубани",
            "address": "г. Славянск-на-Кубани, ул. Промышленная, 8",
            "description": "Производит маринованные овощи, соусы, соки из овощей, выращенных в Краснодарском крае.",
            "website": "https://tomato-kuban.ru",
            "phone": "+7 (86146) 4-55-55",
            "email": "info@tomato-kuban.ru",
            "latitude": 45.2667,
            "longitude": 38.1333,
            "logo_url": "/images/tomato_logo.png",
            "photo_urls": ["/images/tomato_1.jpg"],
            "working_hours": "Пн-Пт: 08:00-17:00",
            "rating": 4.3,
            "reviews_count": 195,
        },
        {
            "id": "prod_109",
            "name": "Кубанская винодельня",
            "producer_type": "winery",
            "region": "Краснодарский край",
            "city": "Краснодар",
            "address": "г. Краснодар, ул. Виноградная, 55",
            "description": "Производит вина, коньяки, настойки. Виноградники расположены в предгорьях Кавказа.",
            "website": "https://kuban-wine.ru",
            "phone": "+7 (861) 210-55-55",
            "email": "wine@kuban.ru",
            "latitude": 45.0333,
            "longitude": 38.9833,
            "logo_url": "/images/kuban_wine_logo.png",
            "photo_urls": ["/images/kuban_wine_1.jpg"],
            "working_hours": "Пн-Пт: 09:00-18:00",
            "rating": 4.5,
            "reviews_count": 560,
        },
        {
            "id": "prod_110",
            "name": "Мясокомбинат 'Краснодарский'",
            "producer_type": "meat_processing",
            "region": "Краснодарский край",
            "city": "Краснодар",
            "address": "г. Краснодар, ул. Бородинская, 150",
            "description": "Производит колбасные изделия, копчёности, мясные полуфабрикаты. Работает с 1955 года.",
            "website": "https://krasnodar-meat.ru",
            "phone": "+7 (861) 231-55-55",
            "email": "info@krasnodar-meat.ru",
            "latitude": 45.0500,
            "longitude": 38.9500,
            "logo_url": "/images/krasnodar_meat_logo.png",
            "photo_urls": ["/images/krasnodar_meat_1.jpg"],
            "working_hours": "Пн-Пт: 08:00-17:00",
            "rating": 4.4,
            "reviews_count": 670,
        },
    ]

    for producer in producers:
        PRODUCERS_DB[producer["id"]] = producer


init_producers_db()


def get_all_producers() -> List[dict]:
    return list(PRODUCERS_DB.values())


def get_producer_by_id(producer_id: str) -> Optional[dict]:
    return PRODUCERS_DB.get(producer_id)


def get_producers_by_type(producer_type: str) -> List[dict]:
    return [p for p in PRODUCERS_DB.values() if p.get("producer_type") == producer_type]


def get_producers_by_region(region: str) -> List[dict]:
    return [
        p
        for p in PRODUCERS_DB.values()
        if region.lower() in p.get("region", "").lower()
    ]


def search_producers(query: str) -> List[dict]:
    query_lower = query.lower()
    results = []
    for producer in PRODUCERS_DB.values():
        if (
            query_lower in producer.get("name", "").lower()
            or query_lower in producer.get("region", "").lower()
            or query_lower in producer.get("description", "").lower()
        ):
            results.append(producer)
    return results


def get_producers_nearby(lat: float, lon: float, radius_km: float = 50) -> List[dict]:
    results = []
    for producer in PRODUCERS_DB.values():
        producer_lat = producer.get("latitude")
        producer_lon = producer.get("longitude")
        if producer_lat and producer_lon:
            distance = (
                (lat - producer_lat) ** 2 + (lon - producer_lon) ** 2
            ) ** 0.5 * 111
            if distance <= radius_km:
                results.append({**producer, "distance_km": round(distance, 1)})
    return sorted(results, key=lambda x: x["distance_km"])

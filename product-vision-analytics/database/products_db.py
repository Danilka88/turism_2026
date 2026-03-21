from typing import Dict, List, Optional
from datetime import datetime
import uuid


PRODUCTS_DB: Dict[str, dict] = {}


def init_products_db():
    products = [
        {
            "id": "prod_001",
            "name": "Вино красное сухое 'Фанагория Номер 1 Резерв'",
            "category": "wines",
            "subcategory": "red_wine",
            "brand": "Фанагория",
            "producer_id": "prod_101",
            "description": "Выдержанное красное вино из винограда Каберне-Совиньон",
            "ingredients": ["Виноград Каберне-Совиньон", "Дрожжи", "Диоксид серы"],
            "certifications": ["ГОСТ", "Халяль"],
            "image_url": "/images/fanagoria_reserve.jpg",
        },
        {
            "id": "prod_002",
            "name": "Вино игристое 'Абрау-Дюрсо' Брют",
            "category": "wines",
            "subcategory": "sparkling_wine",
            "brand": "Абрау-Дюрсо",
            "producer_id": "prod_102",
            "description": "Премиальное игристое вино классическим методом",
            "ingredients": ["Виноград Пино Нуар", "Шардоне", "Рисовый крахмал"],
            "certifications": ["ГОСТ"],
            "image_url": "/images/abrau_brut.jpg",
        },
        {
            "id": "prod_003",
            "name": "Сыр Адыгейский классический",
            "category": "dairy",
            "subcategory": "cheese_hard",
            "brand": "Сыродельня 'Мамоньки'",
            "producer_id": "prod_103",
            "description": "Традиционный адыгейский сыр из коровьего молока",
            "ingredients": ["Молоко коровье", "Соль поваренная", "Закваска"],
            "certifications": ["ГОСТ Р 53590"],
            "image_url": "/images/adygea_cheese.jpg",
        },
        {
            "id": "prod_004",
            "name": "Сулугуни копчёный",
            "category": "dairy",
            "subcategory": "cheese_soft",
            "brand": "Сырзавод 'Адыгея'",
            "producer_id": "prod_104",
            "description": "Копчёный грузинский сыр из коровьего молока",
            "ingredients": ["Молоко", "Соль", "Закваска мезофильная"],
            "certifications": ["ГОСТ"],
            "image_url": "/images/suluguni_smoked.jpg",
        },
        {
            "id": "prod_005",
            "name": "Колбаса 'Кубанская' варёная",
            "category": "meat",
            "subcategory": "sausages",
            "brand": "Мясокомбинат 'Кубань'",
            "producer_id": "prod_105",
            "description": "Классическая колбаса по-кубански из свинины и говядины",
            "ingredients": [
                "Свинина",
                "Говядина",
                "Шпик",
                "Соль",
                "Перец",
                "Мускатный орех",
            ],
            "certifications": ["ГОСТ 23670"],
            "image_url": "/images/kuban_sausage.jpg",
        },
        {
            "id": "prod_006",
            "name": "Мёд разнотравье горный",
            "category": "honey",
            "subcategory": "honey_native",
            "brand": "Пасека 'Горная'",
            "producer_id": "prod_106",
            "description": "Натуральный мёд с горных лугов Апшеронского района",
            "ingredients": ["Мёд натуральный"],
            "certifications": ["Органический", "Пасечный"],
            "image_url": "/images/mountain_honey.jpg",
        },
        {
            "id": "prod_007",
            "name": "Брынза коровий",
            "category": "dairy",
            "subcategory": "cheese_soft",
            "brand": "Ферма 'Золотая Нива'",
            "producer_id": "prod_107",
            "description": "Мягкий рассольный сыр из цельного коровьего молока",
            "ingredients": ["Молоко коровье цельное", "Соль", "Закваска"],
            "certifications": ["ГОСТ"],
            "image_url": "/images/brynza.jpg",
        },
        {
            "id": "prod_008",
            "name": "Помидоры маринованные 'Кубанские'",
            "category": "preserves",
            "subcategory": "vegetables",
            "brand": "Консервзавод 'Томато'",
            "producer_id": "prod_108",
            "description": "Хрустящие маринованные помидоры по-кубански",
            "ingredients": [
                "Помидоры",
                "Уксус",
                "Соль",
                "Сахар",
                "Чеснок",
                "Перец горошком",
            ],
            "certifications": ["ГОСТ"],
            "image_url": "/images/pickled_tomatoes.jpg",
        },
        {
            "id": "prod_009",
            "name": "Коньяк 'Кубань' 5 звезд",
            "category": "wines",
            "subcategory": "cognac",
            "brand": "Кубанская винодельня",
            "producer_id": "prod_109",
            "description": "Выдержанный коньяк 5 лет выдержки",
            "ingredients": ["Коньячный спирт", "Вода", "Сахарный колер"],
            "certifications": ["ГОСТ 13741"],
            "image_url": "/images/kuban_cognac.jpg",
        },
        {
            "id": "prod_010",
            "name": "Сервелат 'Московский'",
            "category": "meat",
            "subcategory": "sausages",
            "brand": "Мясокомбинат 'Краснодарский'",
            "producer_id": "prod_110",
            "description": "Сытный сервелат высшего сорта",
            "ingredients": ["Свинина", "Говядина", "Шпик", "Соль", "Специи"],
            "certifications": ["ГОСТ"],
            "image_url": "/images/servelat.jpg",
        },
    ]

    for product in products:
        product["created_at"] = datetime.now().isoformat()
        PRODUCTS_DB[product["id"]] = product


init_products_db()


def get_all_products() -> List[dict]:
    return list(PRODUCTS_DB.values())


def get_product_by_id(product_id: str) -> Optional[dict]:
    return PRODUCTS_DB.get(product_id)


def get_products_by_producer(producer_id: str) -> List[dict]:
    return [p for p in PRODUCTS_DB.values() if p.get("producer_id") == producer_id]


def get_products_by_category(category: str) -> List[dict]:
    return [p for p in PRODUCTS_DB.values() if p.get("category") == category]


def add_product(product_data: dict) -> dict:
    product_data["id"] = f"prod_{uuid.uuid4().hex[:6]}"
    product_data["created_at"] = datetime.now().isoformat()
    PRODUCTS_DB[product_data["id"]] = product_data
    return product_data


def search_products(query: str) -> List[dict]:
    query_lower = query.lower()
    results = []
    for product in PRODUCTS_DB.values():
        if (
            query_lower in product.get("name", "").lower()
            or query_lower in product.get("brand", "").lower()
            or query_lower in product.get("description", "").lower()
        ):
            results.append(product)
    return results

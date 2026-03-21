# Product Vision Analytics

Интеллектуальная система визуального анализа продуктов Краснодарского края для производственного туризма.

## Возможности

### Визуальный анализ продуктов
Агент анализирует этикетки продуктов и распознаёт:
- Производителя и бренд
- Тип продукции (сыры, вина, колбасы, соления, мёд и др.)
- Географическое происхождение
- Особенности производства

### Формирование туристических маршрутов
На основе распознанных продуктов система предлагает:
- Маршруты на производства
- Мастер-классы и дегустации
- Встречи с производителями
- Экскурсии по цехам

### Производственный туризм
Полный цикл от анализа продукта до бронирования тура:
- История предприятия
- Технология производства
- Онлайн-запись на экскурсию
- Покупка продукции

## Структура проекта

```
product-vision-analytics/
├── main.py                    # Точка входа FastAPI
├── requirements.txt          # Зависимости
├── api/
│   └── routes.py             # API эндпоинты
├── agents/
│   ├── product_vision_agent.py      # Визуальный анализ этикеток
│   ├── producer_finder_agent.py     # Поиск производителей
│   ├── tour_route_agent.py         # Формирование туристических маршрутов
│   ├── degustation_agent.py        # Планирование дегустаций
│   └── booking_agent.py            # Бронирование экскурсий
├── services/
│   ├── ollama_service.py          # Интеграция с Ollama
│   ├── geocoding_service.py       # Геолокация и маршруты
│   └── booking_service.py         # Система бронирования
├── models/
│   └── schemas.py                 # Pydantic модели данных
├── database/
│   ├── products_db.py            # База продуктов (10+ записей)
│   ├── producers_db.py           # База производителей (10+ записей)
│   ├── tours_db.py               # База туров (10+ записей)
│   └── degustations_db.py        # База дегустаций
└── prompts/
    └── product_analysis.py       # Промпты для ИИ агентов
```

## Быстрый старт

### Установка

```bash
cd product-vision-analytics
pip install -r requirements.txt
```

### Запуск

```bash
python main.py
# или
uvicorn main:app --reload --port 8004
```

Сервер запустится на http://localhost:8004

### Проверка статуса

```bash
curl http://localhost:8004/api/health
```

## API эндпоинты

### Анализ продукта

```bash
# Анализ по тексту
POST /api/analyze-product
{
  "product_text": "Сыр Адыгейский классический"
}

# Анализ по фото (base64)
POST /api/analyze-product
{
  "image_base64": "data:image/jpeg;base64,..."
}
```

### Поиск производителя

```bash
# По названию продукта
POST /api/find-producer
{
  "product_name": "Вино Фанагория"
}

# По названию производителя
POST /api/find-producer
{
  "name": "Фанагория"
}

# По типу производителя
POST /api/find-producer
{
  "producer_type": "winery"
}

# По региону
POST /api/find-producer
{
  "region": "Темрюк"
}

# Ближайшие производители
POST /api/find-producer
{
  "latitude": 45.0444,
  "longitude": 38.9764,
  "radius_km": 50
}
```

### Туры

```bash
# Получить все туры
GET /api/tours

# Популярные туры
GET /api/tours?limit=5

# Туры по типу
GET /api/tours?tour_type=excursion

# Туры производителя
GET /api/tours?producer_id=prod_101

# Поиск туров
GET /api/tours?search=сыроварение

# Детали тура
GET /api/tours/tour_001

# Тур с маршрутом
GET /api/tours/tour_001/with-route?user_lat=45.0444&user_lon=38.9764
```

### Дегустации

```bash
# Все дегустации
GET /api/degustations

# По типу
GET /api/degustations?degustation_type=wine

# Дегустации производителя
GET /api/degustations?producer_id=prod_101

# Рекомендация дегустации
POST /api/degustations/recommend?producer_id=prod_101&guest_count=4
```

### Бронирование

```bash
# Проверка доступности
GET /api/booking/availability?tour_id=tour_001&date=2024-06-15&time=11:00&guests=4

# Доступные слоты
GET /api/booking/slots/tour_001?start_date=2024-06-01&days=7

# Рекомендация бронирования
POST /api/booking/recommend?tour_id=tour_001&guests=2

# Создать бронирование
POST /api/booking
{
  "tour_id": "tour_001",
  "date": "2024-06-15",
  "time": "11:00",
  "guests": 4,
  "contact_name": "Иван Петров",
  "contact_phone": "+7 999 123-45-67",
  "contact_email": "ivan@example.com",
  "special_requests": "Нужен переводчик"
}

# Получить бронирование
GET /api/booking/book_abc12345

# Отменить бронирование
POST /api/booking/book_abc12345/cancel
```

## Агенты

### ProductVisionAgent
Анализ этикеток продуктов с использованием Ollama Vision API.

**Функции:**
- Анализ изображения этикетки
- Анализ текстового описания
- Определение категории продукта
- Рекомендации по производственному туризму

**Demo режим:** Автоматически при недоступности Ollama

### ProducerFinderAgent
Поиск производителей по различным критериям.

**Функции:**
- Поиск по названию продукта
- Поиск по названию производителя
- Поиск по типу (winery, cheese_factory, etc.)
- Поиск по региону
- Поиск ближайших производителей

### TourRouteAgent
Формирование туристических маршрутов.

**Функции:**
- Получение туров производителя
- Детали тура с информацией о маршруте
- Туры по типу
- Поиск туров
- Популярные туры
- Маршруты с геолокацией

### DegustationAgent
Планирование дегустационных программ.

**Функции:**
- Список всех дегустаций
- Дегустации по типу (wine, cheese, meat, honey, mixed)
- Дегустации производителя
- Рекомендация дегустации
- Создание индивидуальной программы

### BookingAgent
Система бронирования экскурсий.

**Функции:**
- Проверка доступности
- Доступные слоты
- Рекомендация даты/времени
- Создание бронирования
- Подтверждение/отмена бронирования
- Генерация кодов подтверждения

## Базы данных

### Producers DB (10+ производителей)
| ID | Название | Тип | Регион |
|----|----------|-----|--------|
| prod_101 | Фанагория | winery | Темрюк |
| prod_102 | Абрау-Дюрсо | winery | Новороссийск |
| prod_103 | Сыродельня 'Мамоньки' | cheese_factory | Майкоп |
| prod_104 | Сырзавод 'Адыгея' | cheese_factory | Майкоп |
| prod_105 | Мясокомбинат 'Кубань' | meat_processing | Краснодар |
| prod_106 | Пасека 'Горная' | honey_farm | Апшеронск |
| prod_107 | Ферма 'Золотая Нива' | farm | Тимашёвск |
| prod_108 | Консервный завод 'Томато' | preserve_factory | Славянск |
| prod_109 | Кубанская винодельня | winery | Краснодар |
| prod_110 | Мясокомбинат 'Краснодарский' | meat_processing | Краснодар |

### Tours DB (10+ туров)
| ID | Название | Тип | Цена |
|----|----------|-----|------|
| tour_001 | Экскурсия по 'Фанагории' | excursion | 1500₽ |
| tour_002 | Мастер-класс 'Сыроварение' | master_class | 2500₽ |
| tour_003 | Винификация | workshop | 3500₽ |
| tour_004 | Знакомство с пчеловодством | excursion | 1800₽ |
| tour_005 | За кулисами мясокомбината | excursion | 1200₽ |
| tour_006 | Дегустация 'Абрау-Дюрсо' | degustation | 2000₽ |
| tour_007 | Встреча с производителем | meet_producer | 3000₽ |
| tour_008 | Маринование по-кубански | workshop | 2000₽ |
| tour_009 | Коньячный мастер-класс | degustation | 3500₽ |
| tour_010 | День на молочной ферме | master_class | 4000₽ |

### Products DB (10+ продуктов)
| Категория | Примеры |
|-----------|---------|
| wines | Фанагория Резерв, Абрау-Дюрсо Брют |
| dairy | Адыгейский, Сулугуни, Брынза |
| meat | Колбаса Кубанская, Сервелат |
| honey | Мёд разнотравье горный |
| preserves | Помидоры маринованные |

## Конфигурация Ollama

По умолчанию используется Ollama с моделью `qwen2.5:3b` для текстовых запросов.

Для визуального анализа (анализ этикеток) требуется модель с поддержкой vision, например `llava:7b`.

### Проверка статуса Ollama

```bash
curl http://localhost:8004/api/ollama-status
```

Ответ:
```json
{
  "ollama_available": true,
  "mode": "ollama",
  "model": "qwen2.5:3b"
}
```

Если Ollama недоступна, система автоматически переключается в Demo режим.

## Технологии

- **FastAPI** — высокопроизводительный веб-фреймворк
- **Ollama** — локальный ИИ для анализа текста и изображений
- **Pydantic** — валидация данных
- **GeoPy** — геолокация и расчёт расстояний
- **httpx** — асинхронные HTTP запросы

## Интеграция с экосистемой

```
product-vision-analytics/
        ↓
   [Визуальный анализ]
        ↓
   [ProducerFinder] ←→ [route-intelligence]
        ↓
   [TourRouteAgent]
        ↓
   [DegustationAgent] ←→ [BookingAgent]
        ↓
   [Основное приложение]
```

## Лицензия

MIT

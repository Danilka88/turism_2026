from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import date

from agents.product_vision_agent import product_vision_agent
from agents.producer_finder_agent import producer_finder_agent
from agents.tour_route_agent import tour_route_agent
from agents.degustation_agent import degustation_agent
from agents.booking_agent import booking_agent


router = APIRouter(prefix="/api")


class ProductAnalysisRequest(BaseModel):
    image_base64: Optional[str] = None
    product_text: Optional[str] = None
    include_tours: bool = True


class ProducerSearchRequest(BaseModel):
    name: Optional[str] = None
    product_name: Optional[str] = None
    producer_type: Optional[str] = None
    region: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    radius_km: float = 50


class BookingRequest(BaseModel):
    tour_id: str
    date: str
    time: str
    guests: int
    contact_name: str
    contact_phone: str
    contact_email: Optional[str] = None
    special_requests: Optional[str] = None


class CreateBookingRequest(BaseModel):
    tour_id: str
    date: str
    time: str
    guests: int
    contact_name: str
    contact_phone: str
    contact_email: Optional[str] = None
    special_requests: Optional[str] = None


@router.get("/health")
async def health_check():
    return {"status": "healthy", "module": "product-vision-analytics"}


@router.get("/ollama-status")
async def ollama_status():
    from services.ollama_service import ollama_service

    available = await ollama_service.is_available()
    return {
        "ollama_available": available,
        "mode": "ollama" if available else "demo",
        "model": ollama_service.model,
    }


@router.post("/analyze-product")
async def analyze_product(request: ProductAnalysisRequest):
    if request.image_base64:
        result = await product_vision_agent.analyze_from_image(request.image_base64)
    elif request.product_text:
        result = await product_vision_agent.analyze_from_text(request.product_text)
    else:
        raise HTTPException(
            status_code=400, detail="Требуется image_base64 или product_text"
        )

    if request.include_tours and result.get("product", {}).get("producer_id"):
        producer_result = await producer_finder_agent.get_producer_details(
            result["product"]["producer_id"]
        )
        if producer_result:
            result["producer"] = producer_result
            result["tours"] = await tour_route_agent.get_tours_for_producer(
                result["product"]["producer_id"]
            )

    return result


@router.post("/find-producer")
async def find_producer(request: ProducerSearchRequest):
    if request.name:
        result = await producer_finder_agent.find_by_name(request.name)
        if result:
            return {"producer": result}
        raise HTTPException(status_code=404, detail="Производитель не найден")

    if request.product_name:
        return await producer_finder_agent.find_by_product(request.product_name)

    if request.producer_type:
        producers = await producer_finder_agent.find_by_type(request.producer_type)
        return {"producers": producers}

    if request.region:
        producers = await producer_finder_agent.find_by_region(request.region)
        return {"producers": producers}

    if request.latitude and request.longitude:
        producers = await producer_finder_agent.find_nearby(
            request.latitude, request.longitude, request.radius_km
        )
        return {"producers": producers}

    raise HTTPException(status_code=400, detail="Не указан критерий поиска")


@router.get("/producers/{producer_id}")
async def get_producer(producer_id: str):
    result = await producer_finder_agent.get_producer_details(producer_id)
    if not result:
        raise HTTPException(status_code=404, detail="Производитель не найден")
    return result


@router.get("/producers")
async def list_producers(
    producer_type: Optional[str] = None, region: Optional[str] = None
):
    if producer_type:
        return {"producers": await producer_finder_agent.find_by_type(producer_type)}
    if region:
        return {"producers": await producer_finder_agent.find_by_region(region)}
    return {"error": "Укажите producer_type или region"}


@router.get("/tours")
async def list_tours(
    tour_type: Optional[str] = None,
    producer_id: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(default=10, le=50),
):
    if producer_id:
        tours = await tour_route_agent.get_tours_for_producer(producer_id)
        return {"tours": tours[:limit]}

    if tour_type:
        tours = await tour_route_agent.get_tours_by_type(tour_type)
        return {"tours": tours[:limit]}

    if search:
        tours = await tour_route_agent.search_tours(search)
        return {"tours": tours[:limit]}

    tours = await tour_route_agent.get_popular_tours(limit)
    return {"tours": tours}


@router.get("/tours/{tour_id}")
async def get_tour(tour_id: str):
    result = await tour_route_agent.get_tour_details(tour_id)
    if not result:
        raise HTTPException(status_code=404, detail="Тур не найден")
    return result


@router.get("/tours/{tour_id}/with-route")
async def get_tour_with_route(
    tour_id: str, user_lat: float = Query(...), user_lon: float = Query(...)
):
    result = await tour_route_agent.get_tours_with_route(tour_id, user_lat, user_lon)
    if not result:
        raise HTTPException(status_code=404, detail="Тур не найден")
    return result


@router.get("/tour-types")
async def get_tour_types():
    types = await tour_route_agent.get_all_tour_types()
    return {"tour_types": types}


@router.get("/degustations")
async def list_degustations(
    degustation_type: Optional[str] = None, producer_id: Optional[str] = None
):
    if producer_id:
        return {
            "degustations": await degustation_agent.get_degustations_for_producer(
                producer_id
            )
        }
    if degustation_type:
        return {
            "degustations": await degustation_agent.get_degustations_by_type(
                degustation_type
            )
        }
    return {"degustations": await degustation_agent.get_all_degustations()}


@router.get("/degustations/{deg_id}")
async def get_degustation(deg_id: str):
    result = await degustation_agent.get_degustation_by_id(deg_id)
    if not result:
        raise HTTPException(status_code=404, detail="Дегустация не найдена")
    return result


@router.post("/degustations/recommend")
async def recommend_degustation(
    producer_id: Optional[str] = None,
    guest_count: int = 4,
    duration_preference: Optional[str] = None,
):
    return await degustation_agent.recommend_degustation(
        producer_id, guest_count, duration_preference
    )


@router.get("/booking/availability")
async def check_availability(tour_id: str, date: str, time: str, guests: int):
    return await booking_agent.check_availability(tour_id, date, time, guests)


@router.get("/booking/slots/{tour_id}")
async def get_available_slots(
    tour_id: str, start_date: Optional[str] = None, days: int = Query(default=7, le=30)
):
    return await booking_agent.get_available_slots(tour_id, start_date, days)


@router.post("/booking/recommend")
async def recommend_booking(tour_id: str, guests: int = 2):
    return await booking_agent.recommend_booking(tour_id, guests)


@router.post("/booking")
async def create_booking(request: CreateBookingRequest):
    booking_data = request.model_dump()
    return await booking_agent.create_booking(booking_data)


@router.get("/booking/{booking_id}")
async def get_booking(booking_id: str):
    result = await booking_agent.get_booking(booking_id)
    if not result:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    return result


@router.post("/booking/{booking_id}/cancel")
async def cancel_booking(booking_id: str):
    return await booking_agent.cancel_booking(booking_id)


@router.post("/booking/{booking_id}/confirm")
async def confirm_booking(booking_id: str):
    return await booking_agent.confirm_booking(booking_id)


@router.get("/products")
async def list_products(
    category: Optional[str] = None, producer_id: Optional[str] = None
):
    from database.products_db import (
        get_all_products,
        get_products_by_category,
        get_products_by_producer,
    )

    if producer_id:
        products = get_products_by_producer(producer_id)
    elif category:
        products = get_products_by_category(category)
    else:
        products = get_all_products()

    return {"products": products}


@router.get("/products/{product_id}")
async def get_product(product_id: str):
    from database.products_db import get_product_by_id

    product = get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Продукт не найден")
    return product


@router.get("/nearby-attractions")
async def get_nearby_attractions(
    producer_id: str, radius_km: float = Query(default=30, le=100)
):
    producer = await producer_finder_agent.get_producer_details(producer_id)
    if not producer or not producer.get("latitude"):
        raise HTTPException(status_code=404, detail="Производитель не найден")

    lat, lon = producer["latitude"], producer["longitude"]
    nearby_producers = await producer_finder_agent.find_nearby(lat, lon, radius_km)

    attractions = []
    for p in nearby_producers:
        if p.get("id") != producer_id:
            attractions.append(
                {
                    "type": "producer",
                    "name": p.get("name"),
                    "category": p.get("producer_type"),
                    "distance_km": p.get("distance_km"),
                    "rating": p.get("rating"),
                }
            )

    return {
        "center": {"name": producer.get("name"), "latitude": lat, "longitude": lon},
        "attractions": attractions,
    }

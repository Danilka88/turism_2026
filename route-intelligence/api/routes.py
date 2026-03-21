from fastapi import APIRouter, HTTPException
from datetime import datetime

from agents import (
    nearby_finder_agent,
    distance_calculator_agent,
    route_quality_agent,
    feedback_analyzer_agent,
)
from models.schemas import (
    NearbyRequest,
    NearbyResponse,
    DistanceRequest,
    DistanceResponse,
    RouteAnalyzeRequest,
    RouteAnalyzeResponse,
    RoutePlanRequest,
    RoutePlanResponse,
    FeedbackRequest,
    FeedbackResponse,
    Location,
)

router = APIRouter()


@router.post("/nearby", response_model=NearbyResponse)
async def find_nearby(request: NearbyRequest):
    results = nearby_finder_agent.find_nearby(
        lat=request.lat,
        lng=request.lng,
        radius_km=request.radius_km,
        category=request.category,
        limit=request.limit,
    )

    locations = [
        Location(
            lat=r["lat"], lng=r["lng"], name=r.get("name"), category=r.get("category")
        )
        for r in results
    ]

    return NearbyResponse(
        locations=locations,
        total_found=len(results),
        search_radius_km=request.radius_km,
        timestamp=datetime.utcnow(),
    )


@router.post("/distance", response_model=DistanceResponse)
async def calculate_distance(request: DistanceRequest):
    result = distance_calculator_agent.calculate(
        from_lat=request.from_location.lat,
        from_lng=request.from_location.lng,
        to_lat=request.to_location.lat,
        to_lng=request.to_location.lng,
        transport=request.transport,
    )

    return DistanceResponse(
        distance_km=result["distance_km"],
        duration_minutes=result["duration_minutes"],
        route_available=result["route_available"],
        timestamp=datetime.utcnow(),
    )


@router.post("/analyze", response_model=RouteAnalyzeResponse)
async def analyze_route(request: RouteAnalyzeRequest):
    locations_dict = [
        {"lat": loc.lat, "lng": loc.lng, "name": loc.name, "category": loc.category}
        for loc in request.locations
    ]

    result = await route_quality_agent.analyze(
        locations=locations_dict, transport=request.transport
    )

    return RouteAnalyzeResponse(
        quality_score=result["quality_score"],
        total_distance_km=result["total_distance_km"],
        total_duration_minutes=result["total_duration_minutes"],
        optimized_order=result.get("optimal_order", []),
        issues=result.get("issues", []),
        suggestions=result.get("suggestions", []),
        timestamp=datetime.utcnow(),
    )


@router.post("/plan", response_model=RoutePlanResponse)
async def plan_route(request: RoutePlanRequest):
    locations_dict = [
        {"lat": loc.lat, "lng": loc.lng, "name": loc.name, "category": loc.category}
        for loc in request.locations
    ]

    matrix = distance_calculator_agent.calculate_matrix(locations_dict, "car")

    return RoutePlanResponse(
        route=request.locations,
        total_distance_km=sum(sum(row) for row in matrix["distance_matrix"]) / 2,
        total_duration_minutes=0,
        segments=[],
        quality_score=8.5,
        timestamp=datetime.utcnow(),
    )


@router.post("/feedback", response_model=FeedbackResponse)
async def analyze_feedback(request: FeedbackRequest):
    result = await feedback_analyzer_agent.analyze(
        comment=request.comment or "", rating=request.rating, tags=request.tags
    )

    return FeedbackResponse(
        sentiment=result["sentiment"],
        key_points=result["key_points"],
        improvements=result["improvements"],
        rating_prediction=result["rating_prediction"],
        timestamp=datetime.utcnow(),
    )


@router.get("/transport-types")
async def get_transport_types():
    return {
        "types": [
            {"id": "car", "name": "Автомобиль", "speed_kmh": 60, "icon": "🚗"},
            {"id": "bus", "name": "Автобус", "speed_kmh": 40, "icon": "🚌"},
            {"id": "train", "name": "Поезд", "speed_kmh": 80, "icon": "🚂"},
            {"id": "plane", "name": "Самолёт", "speed_kmh": 800, "icon": "✈️"},
            {"id": "walk", "name": "Пешком", "speed_kmh": 5, "icon": "🚶"},
            {"id": "bike", "name": "Велосипед", "speed_kmh": 15, "icon": "🚴"},
        ]
    }

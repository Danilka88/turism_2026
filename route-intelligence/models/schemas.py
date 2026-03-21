from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class TransportType(str, Enum):
    CAR = "car"
    BUS = "bus"
    TRAIN = "train"
    PLANE = "plane"
    WALK = "walk"
    BIKE = "bike"


class Location(BaseModel):
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)
    name: Optional[str] = None
    category: Optional[str] = None


class NearbyRequest(BaseModel):
    lat: float
    lng: float
    radius_km: float = Field(default=10, ge=0, le=100)
    category: Optional[str] = None
    limit: int = Field(default=10, ge=1, le=50)


class NearbyResponse(BaseModel):
    locations: List[Location]
    total_found: int
    search_radius_km: float
    timestamp: datetime


class DistanceRequest(BaseModel):
    from_location: Location
    to_location: Location
    transport: TransportType = TransportType.CAR


class DistanceResponse(BaseModel):
    distance_km: float
    duration_minutes: float
    route_available: bool
    alternative_routes: List[dict] = []
    timestamp: datetime


class RouteAnalyzeRequest(BaseModel):
    locations: List[Location]
    transport: TransportType = TransportType.CAR
    preferences: Optional[dict] = None


class RouteAnalyzeResponse(BaseModel):
    quality_score: float = Field(ge=0, le=10)
    total_distance_km: float
    total_duration_minutes: float
    optimized_order: List[int]
    issues: List[str] = []
    suggestions: List[str] = []
    timestamp: datetime


class RoutePlanRequest(BaseModel):
    locations: List[Location]
    start_location: Optional[Location] = None
    end_location: Optional[Location] = None
    transport_modes: List[TransportType]
    avoid_tolls: bool = False
    scenic_route: bool = False
    max_duration_hours: Optional[float] = None


class RoutePlanResponse(BaseModel):
    route: List[Location]
    total_distance_km: float
    total_duration_minutes: float
    segments: List[dict]
    quality_score: float
    alternative_routes: List[dict] = []
    timestamp: datetime


class FeedbackRequest(BaseModel):
    user_id: str
    location_id: str
    rating: float = Field(ge=1, le=5)
    comment: Optional[str] = None
    tags: List[str] = []


class FeedbackResponse(BaseModel):
    sentiment: str
    key_points: List[str]
    improvements: List[str]
    rating_prediction: float
    timestamp: datetime

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
from enum import Enum


class ProductCategory(str, Enum):
    WINES = "wines"
    DAIRY = "dairy"
    MEAT = "meat"
    PRESERVES = "preserves"
    HONEY = "honey"
    OTHER = "other"


class ProductSubcategory(str, Enum):
    RED_WINE = "red_wine"
    WHITE_WINE = "white_wine"
    ROSE_WINE = "rose_wine"
    SPARKLING_WINE = "sparkling_wine"
    COGNAC = "cognac"
    LIQUOR = "liquor"
    CHEESE_HARD = "cheese_hard"
    CHEESE_SOFT = "cheese_soft"
    CHEESE_FARMER = "cheese_farmer"
    SAUSAGES = "sausages"
    SMOKED_MEAT = "smoked_meat"
    VEGETABLES = "vegetables"
    HONEY_NATIVE = "honey_native"
    HONEY_PRODUCTS = "honey_products"


class ProductBase(BaseModel):
    name: str
    category: ProductCategory
    subcategory: Optional[ProductSubcategory] = None
    brand: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None


class ProductCreate(ProductBase):
    producer_id: str


class Product(ProductBase):
    id: str
    producer_id: str
    ingredients: Optional[List[str]] = None
    nutritional_value: Optional[dict] = None
    certifications: Optional[List[str]] = None
    created_at: datetime


class ProducerType(str, Enum):
    WINERY = "winery"
    CHEESE_FACTORY = "cheese_factory"
    MEAT_PROCESSING = "meat_processing"
    HONEY_FARM = "honey_farm"
    PRESERVE_FACTORY = "preserve_factory"
    FARM = "farm"
    BREWERY = "brewery"


class ProducerBase(BaseModel):
    name: str
    producer_type: ProducerType
    region: str
    city: Optional[str] = None
    address: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None


class Producer(ProducerBase):
    id: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    logo_url: Optional[str] = None
    photo_urls: Optional[List[str]] = None
    working_hours: Optional[str] = None
    rating: Optional[float] = None
    reviews_count: Optional[int] = None


class TourType(str, Enum):
    EXCURSION = "excursion"
    MASTER_CLASS = "master_class"
    DEGUSTATION = "degustation"
    MEET_PRODUCER = "meet_producer"
    WORKSHOP = "workshop"


class TourBase(BaseModel):
    title: str
    description: str
    producer_id: str
    tour_type: TourType
    duration_minutes: int
    price: float
    max_guests: int
    includes: List[str]
    requirements: Optional[List[str]] = None


class Tour(TourBase):
    id: str
    schedule: Optional[str] = None
    photo_urls: Optional[List[str]] = None
    rating: Optional[float] = None
    reviews_count: Optional[int] = None
    is_active: bool = True


class DegustationType(str, Enum):
    WINE = "wine"
    CHEESE = "cheese"
    MEAT = "meat"
    HONEY = "honey"
    MIXED = "mixed"


class DegustationProgramBase(BaseModel):
    name: str
    description: str
    producer_id: str
    degustation_type: DegustationType
    duration_minutes: int
    price_per_person: float
    min_guests: int
    max_guests: int
    items: List[str]
    pairing_suggestions: Optional[List[str]] = None


class DegustationProgram(DegustationProgramBase):
    id: str
    photo_url: Optional[str] = None
    rating: Optional[float] = None


class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class BookingBase(BaseModel):
    tour_id: str
    date: date
    time: str
    guests: int
    contact_name: str
    contact_phone: str
    contact_email: Optional[str] = None
    special_requests: Optional[str] = None


class BookingCreate(BookingBase):
    pass


class Booking(BookingBase):
    id: str
    status: BookingStatus
    total_price: float
    created_at: datetime
    updated_at: Optional[datetime] = None


class ProductAnalysisRequest(BaseModel):
    image_base64: str
    include_tours: bool = True


class ProductAnalysisResult(BaseModel):
    product: Optional[Product] = None
    producer: Optional[Producer] = None
    confidence: float
    recommendations: List[str]
    recommended_tours: Optional[List[Tour]] = None
    nearby_attractions: Optional[List[str]] = None
    error: Optional[str] = None


class RouteInfo(BaseModel):
    distance_km: float
    duration_minutes: int
    transport_type: str
    waypoints: Optional[List[dict]] = None


class TourWithRoute(BaseModel):
    tour: Tour
    route: RouteInfo
    nearby_producers: Optional[List[Producer]] = None

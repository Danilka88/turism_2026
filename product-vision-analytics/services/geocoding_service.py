from typing import Optional
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import math


class GeocodingService:
    def __init__(self):
        self.geolocator = Nominatim(user_agent="product_vision_analytics")
        self._cache: dict = {}

    def get_coordinates(self, address: str) -> Optional[tuple[float, float]]:
        if address in self._cache:
            return self._cache[address]

        try:
            location = self.geolocator.geocode(address)
            if location:
                coords = (location.latitude, location.longitude)
                self._cache[address] = coords
                return coords
        except Exception:
            pass

        return None

    def calculate_distance(
        self, lat1: float, lon1: float, lat2: float, lon2: float
    ) -> float:
        try:
            point1 = (lat1, lon1)
            point2 = (lat2, lon2)
            distance_km = geodesic(point1, point2).kilometers
            return round(distance_km, 1)
        except Exception:
            return 0.0

    def estimate_travel_time(
        self, distance_km: float, transport_type: str = "car"
    ) -> int:
        speeds = {"car": 60, "bus": 40, "train": 50, "walk": 5, "bicycle": 15}
        speed = speeds.get(transport_type, 60)
        return int((distance_km / speed) * 60)

    def get_route_info(
        self,
        start_lat: float,
        start_lon: float,
        end_lat: float,
        end_lon: float,
        transport_type: str = "car",
    ) -> dict:
        distance = self.calculate_distance(start_lat, start_lon, end_lat, end_lon)
        duration = self.estimate_travel_time(distance, transport_type)

        return {
            "distance_km": distance,
            "duration_minutes": duration,
            "transport_type": transport_type,
            "waypoints": [
                {"lat": start_lat, "lon": start_lon},
                {"lat": end_lat, "lon": end_lon},
            ],
        }


geocoding_service = GeocodingService()

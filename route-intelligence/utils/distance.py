import math
from typing import Tuple


def haversine(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    R = 6371

    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lng = math.radians(lng2 - lng1)

    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lng / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c


def get_bearing(lat1: float, lng1: float, lat2: float, lng2: float) -> str:
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lng = math.radians(lng2 - lng1)

    y = math.sin(delta_lng) * math.cos(lat2_rad)
    x = math.cos(lat1_rad) * math.sin(lat2_rad) - math.sin(lat1_rad) * math.cos(
        lat2_rad
    ) * math.cos(delta_lng)

    bearing = math.degrees(math.atan2(y, x))
    bearing = (bearing + 360) % 360

    directions = ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"]
    index = round(bearing / 45) % 8

    return directions[index]


def calculate_center(points: list) -> Tuple[float, float]:
    if not points:
        return (0, 0)

    lat_sum = sum(p["lat"] for p in points)
    lng_sum = sum(p["lng"] for p in points)

    return (lat_sum / len(points), lng_sum / len(points))


def is_within_radius(
    center_lat: float,
    center_lng: float,
    point_lat: float,
    point_lng: float,
    radius_km: float,
) -> bool:
    distance = haversine(center_lat, center_lng, point_lat, point_lng)
    return distance <= radius_km

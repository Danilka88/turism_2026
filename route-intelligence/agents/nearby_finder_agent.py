from typing import Dict, Any, List
import math


class NearbyFinderAgent:
    def __init__(self):
        self.locations_db = []

    def set_locations_db(self, locations: List[Dict]):
        self.locations_db = locations

    def find_nearby(
        self,
        lat: float,
        lng: float,
        radius_km: float = 10,
        category: str = None,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        results = []

        for loc in self.locations_db:
            if category and loc.get("category") != category:
                continue

            distance = self._haversine_distance(lat, lng, loc["lat"], loc["lng"])

            if distance <= radius_km:
                results.append(
                    {
                        **loc,
                        "distance_km": round(distance, 2),
                        "bearing": self._calculate_bearing(
                            lat, lng, loc["lat"], loc["lng"]
                        ),
                    }
                )

        results.sort(key=lambda x: x["distance_km"])

        return results[:limit]

    def _haversine_distance(
        self, lat1: float, lng1: float, lat2: float, lng2: float
    ) -> float:
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

    def _calculate_bearing(
        self, lat1: float, lng1: float, lat2: float, lng2: float
    ) -> str:
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

    def optimize_order(
        self, locations: List[Dict], start_lat: float, start_lng: float
    ) -> List[int]:
        remaining = list(range(len(locations)))
        order = []
        current_lat, current_lng = start_lat, start_lng

        while remaining:
            nearest_idx = None
            nearest_dist = float("inf")

            for idx in remaining:
                dist = self._haversine_distance(
                    current_lat,
                    current_lng,
                    locations[idx]["lat"],
                    locations[idx]["lng"],
                )
                if dist < nearest_dist:
                    nearest_dist = dist
                    nearest_idx = idx

            if nearest_idx is not None:
                order.append(nearest_idx)
                current_lat = locations[nearest_idx]["lat"]
                current_lng = locations[nearest_idx]["lng"]
                remaining.remove(nearest_idx)

        return order


nearby_finder_agent = NearbyFinderAgent()

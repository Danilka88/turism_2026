from typing import Dict, Any, List
import math


class DistanceCalculatorAgent:
    TRANSPORT_SPEEDS = {
        "car": 60,
        "bus": 40,
        "train": 80,
        "plane": 800,
        "walk": 5,
        "bike": 15,
    }

    TRANSPORT_FACTORS = {
        "car": 1.0,
        "bus": 1.3,
        "train": 1.1,
        "plane": 0.3,
        "walk": 1.0,
        "bike": 1.0,
    }

    def calculate(
        self,
        from_lat: float,
        from_lng: float,
        to_lat: float,
        to_lng: float,
        transport: str = "car",
    ) -> Dict[str, Any]:
        distance_km = self._haversine_distance(from_lat, from_lng, to_lat, to_lng)

        base_speed = self.TRANSPORT_SPEEDS.get(transport, 60)
        factor = self.TRANSPORT_FACTORS.get(transport, 1.0)
        adjusted_speed = base_speed * factor

        duration_minutes = (
            (distance_km / adjusted_speed) * 60 if adjusted_speed > 0 else 0
        )

        return {
            "distance_km": round(distance_km, 2),
            "duration_minutes": round(duration_minutes, 1),
            "distance_m": round(distance_km * 1000),
            "transport": transport,
            "route_available": True,
            "estimated_arrival": self._format_duration(duration_minutes),
        }

    def calculate_matrix(
        self, locations: List[Dict], transport: str = "car"
    ) -> Dict[str, Any]:
        n = len(locations)
        matrix = [[0.0] * n for _ in range(n)]
        duration_matrix = [[0.0] * n for _ in range(n)]

        for i in range(n):
            for j in range(n):
                if i != j:
                    result = self.calculate(
                        locations[i]["lat"],
                        locations[i]["lng"],
                        locations[j]["lat"],
                        locations[j]["lng"],
                        transport,
                    )
                    matrix[i][j] = result["distance_km"]
                    duration_matrix[i][j] = result["duration_minutes"]

        return {
            "distance_matrix": matrix,
            "duration_matrix": duration_matrix,
            "total_distance": sum(sum(row) for row in matrix),
            "transport": transport,
        }

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

    def _format_duration(self, minutes: float) -> str:
        if minutes < 60:
            return f"{int(minutes)} мин"
        hours = int(minutes // 60)
        mins = int(minutes % 60)
        return f"{hours} ч {mins} мин"


distance_calculator_agent = DistanceCalculatorAgent()

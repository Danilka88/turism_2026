from typing import Dict, Any, List
from agents.distance_calculator_agent import distance_calculator_agent


class RouteQualityAgent:
    def __init__(self, ollama_service=None):
        self.ollama = ollama_service
        self.distance_calc = distance_calculator_agent

    async def analyze(
        self, locations: List[Dict], transport: str = "car"
    ) -> Dict[str, Any]:
        if len(locations) < 2:
            return {
                "quality_score": 10.0,
                "issues": [],
                "suggestions": ["Недостаточно мест для анализа"],
                "total_distance_km": 0,
                "total_duration_minutes": 0,
            }

        issues = []
        suggestions = []
        score = 10.0

        matrix = self.distance_calc.calculate_matrix(locations, transport)
        total_distance = sum(sum(matrix["distance_matrix"]))

        avg_segment = total_distance / (len(locations) - 1)

        if avg_segment > 100:
            issues.append("Слишком большие расстояния между точками")
            score -= 2
            suggestions.append("Рассмотрите более близкие места")

        if len(locations) > 8:
            issues.append("Слишком много точек для одного дня")
            score -= 1
            suggestions.append("Разделите маршрут на несколько дней")

        variance = self._calculate_variance(matrix["distance_matrix"])
        if variance > 5000:
            issues.append("Неравномерное распределение расстояний")
            score -= 1
            suggestions.append("Оптимизируйте порядок посещения")

        categories = set(loc.get("category") for loc in locations)
        if len(categories) < 2 and len(locations) > 3:
            issues.append("Однообразие маршрута")
            score -= 1
            suggestions.append("Добавьте разнообразия: культуру, природу, еду")

        score = max(0, min(10, score))

        return {
            "quality_score": round(score, 1),
            "total_distance_km": round(total_distance, 1),
            "total_duration_minutes": round(total_distance / 60 * 60, 0),
            "avg_segment_km": round(avg_segment, 1),
            "issues": issues,
            "suggestions": suggestions,
            "diversity_score": len(categories) / max(len(locations), 1),
            "optimal_order": self._get_optimal_order(locations),
        }

    def _calculate_variance(self, matrix: List[List[float]]) -> float:
        flat = [val for row in matrix for val in row if val > 0]
        if not flat:
            return 0
        mean = sum(flat) / len(flat)
        return sum((x - mean) ** 2 for x in flat) / len(flat)

    def _get_optimal_order(self, locations: List[Dict]) -> List[int]:
        if not locations:
            return []

        optimized = [0]
        remaining = list(range(1, len(locations)))

        while remaining:
            current = locations[optimized[-1]]
            nearest_idx = None
            nearest_dist = float("inf")

            for idx in remaining:
                dist = self._haversine(
                    current["lat"],
                    current["lng"],
                    locations[idx]["lat"],
                    locations[idx]["lng"],
                )
                if dist < nearest_dist:
                    nearest_dist = dist
                    nearest_idx = idx

            if nearest_idx is not None:
                optimized.append(nearest_idx)
                remaining.remove(nearest_idx)

        return optimized

    def _haversine(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        import math

        R = 6371
        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        delta_lat = math.radians(lat2 - lat1)
        delta_lng = math.radians(lng2 - lng1)
        a = (
            math.sin(delta_lat / 2) ** 2
            + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lng / 2) ** 2
        )
        return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


route_quality_agent = RouteQualityAgent()

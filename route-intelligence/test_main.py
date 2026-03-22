import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

from main import app
from agents import nearby_finder_agent
from agents.distance_calculator_agent import DistanceCalculatorAgent
from agents.nearby_finder_agent import NearbyFinderAgent
from utils.distance import haversine, get_bearing, calculate_center, is_within_radius
from models.schemas import TransportType, Location


client = TestClient(app)


class TestDistanceCalculator:
    def setup_method(self):
        self.agent = DistanceCalculatorAgent()

    def test_calculate_distance_car(self):
        result = self.agent.calculate(
            from_lat=44.6, from_lng=38.0, to_lat=44.7, to_lng=38.1, transport="car"
        )
        assert "distance_km" in result
        assert "duration_minutes" in result
        assert result["transport"] == "car"
        assert result["route_available"] is True

    def test_calculate_distance_walk(self):
        result = self.agent.calculate(
            from_lat=44.6, from_lng=38.0, to_lat=44.7, to_lng=38.1, transport="walk"
        )
        assert result["transport"] == "walk"
        assert result["duration_minutes"] > 0

    def test_calculate_distance_plane(self):
        result = self.agent.calculate(
            from_lat=44.6, from_lng=38.0, to_lat=55.0, to_lng=60.0, transport="plane"
        )
        base_speed = 800
        factor = 0.3
        adjusted_speed = base_speed * factor
        expected_duration = (result["distance_km"] / adjusted_speed) * 60
        assert result["transport"] == "plane"
        assert result["duration_minutes"] > 0

    def test_calculate_matrix(self):
        locations = [
            {"lat": 44.6, "lng": 38.0, "name": "A"},
            {"lat": 44.7, "lng": 38.1, "name": "B"},
            {"lat": 44.8, "lng": 38.2, "name": "C"},
        ]
        result = self.agent.calculate_matrix(locations, "car")

        assert "distance_matrix" in result
        assert "duration_matrix" in result
        assert len(result["distance_matrix"]) == 3
        assert len(result["distance_matrix"][0]) == 3
        assert result["distance_matrix"][0][0] == 0

    def test_known_distance_krasnodar_to_anapa(self):
        result = self.agent.calculate(
            from_lat=45.0448,
            from_lng=38.9760,
            to_lat=44.8973,
            to_lng=37.3152,
            transport="car",
        )
        assert 80 < result["distance_km"] < 150


class TestNearbyFinder:
    def setup_method(self):
        self.agent = NearbyFinderAgent()
        self.test_locations = [
            {"lat": 44.6, "lng": 38.0, "name": "Гай-Кодзор", "category": "winery"},
            {"lat": 44.65, "lng": 38.05, "name": "Тонкий мыс", "category": "nature"},
            {"lat": 44.9, "lng": 38.5, "name": "Геленджик", "category": "city"},
            {"lat": 44.5, "lng": 37.9, "name": "Абрау-Дюрсо", "category": "winery"},
        ]
        self.agent.set_locations_db(self.test_locations)

    def test_find_nearby_default_radius(self):
        results = self.agent.find_nearby(44.6, 38.0, radius_km=10)
        assert len(results) > 0
        assert all(r["distance_km"] <= 10 for r in results)

    def test_find_nearby_with_category_filter(self):
        results = self.agent.find_nearby(
            lat=44.6, lng=38.0, radius_km=50, category="winery"
        )
        assert all(r["category"] == "winery" for r in results)

    def test_find_nearby_limit(self):
        results = self.agent.find_nearby(lat=44.6, lng=38.0, radius_km=50, limit=2)
        assert len(results) <= 2

    def test_find_nearby_sorted_by_distance(self):
        results = self.agent.find_nearby(lat=44.6, lng=38.0, radius_km=50)
        distances = [r["distance_km"] for r in results]
        assert distances == sorted(distances)

    def test_find_nearby_empty_result(self):
        results = self.agent.find_nearby(lat=0, lng=0, radius_km=1)
        assert len(results) == 0


class TestUtils:
    def test_haversine_known_points(self):
        dist = haversine(44.6, 38.0, 44.7, 38.1)
        assert 10 < dist < 20

    def test_haversine_same_point(self):
        dist = haversine(44.6, 38.0, 44.6, 38.0)
        assert dist == 0

    def test_get_bearing_north(self):
        bearing = get_bearing(44.6, 38.0, 44.7, 38.0)
        assert bearing in ["С", "СВ", "В"]

    def test_calculate_center(self):
        points = [
            {"lat": 44.0, "lng": 38.0},
            {"lat": 46.0, "lng": 40.0},
        ]
        lat, lng = calculate_center(points)
        assert lat == 45.0
        assert lng == 39.0

    def test_calculate_center_empty(self):
        lat, lng = calculate_center([])
        assert lat == 0
        assert lng == 0

    def test_is_within_radius_true(self):
        assert is_within_radius(44.6, 38.0, 44.65, 38.05, 10) is True

    def test_is_within_radius_false(self):
        assert is_within_radius(44.6, 38.0, 50.0, 50.0, 10) is False


class TestAPIEndpoints:
    def test_health_check(self):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

    def test_root_endpoint(self):
        response = client.get("/")
        assert response.status_code == 200
        assert "service" in response.json()

    def test_distance_endpoint(self):
        response = client.post(
            "/api/route/distance",
            json={
                "from_location": {"lat": 44.6, "lng": 38.0},
                "to_location": {"lat": 44.7, "lng": 38.1},
                "transport": "car",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert "distance_km" in data
        assert "duration_minutes" in data

    def test_nearby_endpoint(self):
        with patch.object(nearby_finder_agent, "find_nearby", return_value=[]):
            response = client.post(
                "/api/route/nearby",
                json={"lat": 44.6, "lng": 38.0, "radius_km": 10, "limit": 5},
            )
        assert response.status_code == 200
        data = response.json()
        assert "locations" in data

    def test_transport_types_endpoint(self):
        response = client.get("/api/route/transport-types")
        assert response.status_code == 200
        data = response.json()
        assert "types" in data
        assert len(data["types"]) == 6


class TestSchemas:
    def test_location_valid(self):
        loc = Location(lat=44.6, lng=38.0, name="Test", category="nature")
        assert loc.lat == 44.6
        assert loc.lng == 38.0

    def test_location_lat_validation(self):
        with pytest.raises(Exception):
            Location(lat=100, lng=38.0)

    def test_transport_type_enum(self):
        assert TransportType.CAR.value == "car"
        assert TransportType.PLANE.value == "plane"

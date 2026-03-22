import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from database import producers_db, tours_db, degustations_db, products_db
from models.schemas import (
    ProductCategory,
    ProducerType,
    TourType,
    DegustationType,
    BookingStatus,
)


class TestProducersDB:
    def test_get_all_producers(self):
        producers = producers_db.get_all_producers()
        assert len(producers) > 0
        assert all("id" in p for p in producers)

    def test_get_producer_by_id(self):
        producer = producers_db.get_producer_by_id("prod_101")
        assert producer is not None
        assert producer["name"] == "Винодельня 'Фанагория'"

    def test_get_producer_by_id_not_found(self):
        producer = producers_db.get_producer_by_id("nonexistent")
        assert producer is None

    def test_get_producers_by_type(self):
        wineries = producers_db.get_producers_by_type("winery")
        assert len(wineries) > 0
        assert all(p["producer_type"] == "winery" for p in wineries)

    def test_get_producers_by_type_no_results(self):
        result = producers_db.get_producers_by_type("nonexistent_type")
        assert result == []

    def test_get_producers_by_region(self):
        result = producers_db.get_producers_by_region("Краснодарский")
        assert len(result) > 0
        assert any("Краснодарский" in p.get("region", "") for p in result)

    def test_search_producers(self):
        result = producers_db.search_producers("Фанагория")
        assert len(result) > 0
        assert any("Фанагория" in p.get("name", "") for p in result)

    def test_search_producers_empty(self):
        result = producers_db.search_producers("xyznonexistent123")
        assert result == []

    def test_get_producers_nearby(self):
        result = producers_db.get_producers_nearby(45.0, 38.0, radius_km=100)
        assert len(result) > 0
        assert all("distance_km" in p for p in result)

    def test_get_producers_nearby_no_results(self):
        result = producers_db.get_producers_nearby(0, 0, radius_km=1)
        assert result == []


class TestToursDB:
    def test_get_all_tours(self):
        tours = tours_db.get_all_tours()
        assert len(tours) > 0
        assert all("id" in t for t in tours)
        assert all(t.get("is_active") for t in tours)

    def test_get_tour_by_id(self):
        tour = tours_db.get_tour_by_id("tour_001")
        assert tour is not None
        assert tour["title"] == "Экскурсия по винодельне 'Фанагория'"

    def test_get_tour_by_id_not_found(self):
        tour = tours_db.get_tour_by_id("nonexistent")
        assert tour is None

    def test_get_tours_by_producer(self):
        tours = tours_db.get_tours_by_producer("prod_101")
        assert len(tours) > 0
        assert all(t["producer_id"] == "prod_101" for t in tours)

    def test_get_tours_by_type(self):
        tours = tours_db.get_tours_by_type("excursion")
        assert len(tours) > 0
        assert all(t["tour_type"] == "excursion" for t in tours)

    def test_search_tours(self):
        result = tours_db.search_tours("сыр")
        assert len(result) > 0

    def test_search_tours_empty(self):
        result = tours_db.search_tours("xyznonexistent123")
        assert result == []

    def test_get_popular_tours(self):
        tours = tours_db.get_popular_tours(limit=3)
        assert len(tours) <= 3
        reviews = [t.get("reviews_count", 0) for t in tours]
        assert reviews == sorted(reviews, reverse=True)

    def test_get_recommended_tours(self):
        tours = tours_db.get_recommended_tours("prod_101", limit=2)
        assert len(tours) <= 2
        ratings = [t.get("rating", 0) for t in tours]
        assert ratings == sorted(ratings, reverse=True)


class TestDegustationsDB:
    def test_get_all_degustations(self):
        degustations = degustations_db.get_all_degustations()
        assert isinstance(degustations, list)

    def test_get_degustation_by_id(self):
        result = degustations_db.get_degustation_by_id("deg_001")
        if result:
            assert "id" in result

    def test_get_degustations_by_type(self):
        result = degustations_db.get_degustations_by_type("wine")
        assert isinstance(result, list)

    def test_get_degustations_for_producer(self):
        result = degustations_db.get_degustations_by_producer("prod_101")
        assert isinstance(result, list)


class TestProductsDB:
    def test_get_all_products(self):
        products = products_db.get_all_products()
        assert isinstance(products, list)

    def test_get_product_by_id(self):
        result = products_db.get_product_by_id("prod_wine_001")
        if result:
            assert "id" in result

    def test_get_products_by_category(self):
        result = products_db.get_products_by_category("wines")
        assert isinstance(result, list)

    def test_get_products_by_producer(self):
        result = products_db.get_products_by_producer("prod_101")
        assert isinstance(result, list)


class TestSchemas:
    def test_product_category_enum(self):
        assert ProductCategory.WINES.value == "wines"
        assert ProductCategory.DAIRY.value == "dairy"
        assert ProductCategory.MEAT.value == "meat"
        assert ProductCategory.HONEY.value == "honey"

    def test_producer_type_enum(self):
        assert ProducerType.WINERY.value == "winery"
        assert ProducerType.CHEESE_FACTORY.value == "cheese_factory"
        assert ProducerType.MEAT_PROCESSING.value == "meat_processing"
        assert ProducerType.HONEY_FARM.value == "honey_farm"

    def test_tour_type_enum(self):
        assert TourType.EXCURSION.value == "excursion"
        assert TourType.MASTER_CLASS.value == "master_class"
        assert TourType.DEGUSTATION.value == "degustation"
        assert TourType.MEET_PRODUCER.value == "meet_producer"

    def test_degustation_type_enum(self):
        assert DegustationType.WINE.value == "wine"
        assert DegustationType.CHEESE.value == "cheese"
        assert DegustationType.MEAT.value == "meat"
        assert DegustationType.MIXED.value == "mixed"

    def test_booking_status_enum(self):
        assert BookingStatus.PENDING.value == "pending"
        assert BookingStatus.CONFIRMED.value == "confirmed"
        assert BookingStatus.CANCELLED.value == "cancelled"
        assert BookingStatus.COMPLETED.value == "completed"

    def test_product_schema_validation(self):
        from models.schemas import Product, ProductBase

        product = ProductBase(
            name="Тестовое вино",
            category=ProductCategory.WINES,
            brand="Тестовый бренд",
            description="Описание",
        )
        assert product.name == "Тестовое вино"
        assert product.category == ProductCategory.WINES

    def test_booking_schema_validation(self):
        from models.schemas import BookingBase
        from datetime import date

        booking = BookingBase(
            tour_id="tour_001",
            date=date.today(),
            time="14:00",
            guests=4,
            contact_name="Иван Иванов",
            contact_phone="+7 999 123-45-67",
        )
        assert booking.tour_id == "tour_001"
        assert booking.guests == 4


class TestTourRouteAgent:
    @pytest.mark.asyncio
    async def test_get_popular_tours(self):
        from agents.tour_route_agent import TourRouteAgent

        agent = TourRouteAgent()
        result = await agent.get_popular_tours(5)

        assert len(result) <= 5
        assert all("title" in t for t in result)

    @pytest.mark.asyncio
    async def test_get_tours_for_producer(self):
        from agents.tour_route_agent import TourRouteAgent

        agent = TourRouteAgent()
        result = await agent.get_tours_for_producer("prod_101")

        assert all(t["producer_id"] == "prod_101" for t in result)

    @pytest.mark.asyncio
    async def test_get_tours_by_type(self):
        from agents.tour_route_agent import TourRouteAgent

        agent = TourRouteAgent()
        result = await agent.get_tours_by_type("excursion")

        assert all(t["tour_type"] == "excursion" for t in result)

    @pytest.mark.asyncio
    async def test_search_tours(self):
        from agents.tour_route_agent import TourRouteAgent

        agent = TourRouteAgent()
        result = await agent.search_tours("вино")

        assert isinstance(result, list)

    @pytest.mark.asyncio
    async def test_get_all_tour_types(self):
        from agents.tour_route_agent import TourRouteAgent

        agent = TourRouteAgent()
        result = await agent.get_all_tour_types()

        assert isinstance(result, list)


class TestProducerFinderAgent:
    @pytest.mark.asyncio
    async def test_find_by_name(self):
        from agents.producer_finder_agent import ProducerFinderAgent

        agent = ProducerFinderAgent()
        result = await agent.find_by_name("Фанагория")

        if result:
            assert "name" in result

    @pytest.mark.asyncio
    async def test_find_by_type(self):
        from agents.producer_finder_agent import ProducerFinderAgent

        agent = ProducerFinderAgent()
        result = await agent.find_by_type("winery")

        assert isinstance(result, list)

    @pytest.mark.asyncio
    async def test_find_by_region(self):
        from agents.producer_finder_agent import ProducerFinderAgent

        agent = ProducerFinderAgent()
        result = await agent.find_by_region("Краснодарский")

        assert isinstance(result, list)

    @pytest.mark.asyncio
    async def test_get_producer_details(self):
        from agents.producer_finder_agent import ProducerFinderAgent

        agent = ProducerFinderAgent()
        result = await agent.get_producer_details("prod_101")

        assert result is not None
        assert result["id"] == "prod_101"


class TestDegustationAgent:
    @pytest.mark.asyncio
    async def test_get_all_degustations(self):
        from agents.degustation_agent import DegustationAgent

        agent = DegustationAgent()
        result = await agent.get_all_degustations()

        assert isinstance(result, list)

    @pytest.mark.asyncio
    async def test_get_degustations_by_type(self):
        from agents.degustation_agent import DegustationAgent

        agent = DegustationAgent()
        result = await agent.get_degustations_by_type("wine")

        assert isinstance(result, list)

    @pytest.mark.asyncio
    async def test_get_degustations_for_producer(self):
        from agents.degustation_agent import DegustationAgent

        agent = DegustationAgent()
        result = await agent.get_degustations_for_producer("prod_101")

        assert isinstance(result, list)


class TestBookingAgent:
    @pytest.mark.asyncio
    async def test_check_availability(self):
        from agents.booking_agent import BookingAgent

        agent = BookingAgent()
        result = await agent.check_availability("tour_001", "2026-03-25", "14:00", 4)

        assert isinstance(result, dict)

    @pytest.mark.asyncio
    async def test_get_available_slots(self):
        from agents.booking_agent import BookingAgent

        agent = BookingAgent()
        result = await agent.get_available_slots("tour_001", "2026-03-25", 7)

        assert isinstance(result, dict)

    @pytest.mark.asyncio
    async def test_recommend_booking(self):
        from agents.booking_agent import BookingAgent

        agent = BookingAgent()
        result = await agent.recommend_booking("tour_001", 4)

        assert isinstance(result, dict)


class TestProductVisionAgent:
    @pytest.mark.asyncio
    async def test_analyze_from_text(self):
        from agents.product_vision_agent import ProductVisionAgent

        agent = ProductVisionAgent()
        result = await agent.analyze_from_text("Красное сухое вино Фанагория")

        assert isinstance(result, dict)


class TestAPIEndpointSchemas:
    def test_product_analysis_request_valid(self):
        from models.schemas import ProductBase, ProductCategory

        product = ProductBase(name="Тестовый продукт", category=ProductCategory.WINES)
        assert product.name == "Тестовый продукт"

    def test_producer_search_request_valid(self):
        from models.schemas import ProducerBase, ProducerType

        producer = ProducerBase(
            name="Тестовая винодельня",
            producer_type=ProducerType.WINERY,
            region="Краснодарский край",
        )
        assert producer.name == "Тестовая винодельня"

    def test_booking_request_valid(self):
        from models.schemas import BookingBase, TourType
        from datetime import date

        booking = BookingBase(
            tour_id="tour_001",
            date=date.today(),
            time="14:00",
            guests=4,
            contact_name="Иван Иванов",
            contact_phone="+7 999 123-45-67",
        )
        assert booking.tour_id == "tour_001"
        assert booking.guests == 4

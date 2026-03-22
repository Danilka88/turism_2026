import pytest
from unittest.mock import MagicMock, patch
from datetime import datetime

from app.parsers.base import BaseParser
from app.parsers.text_search import TextSearchParser
from app.parsers.image_search import ImageSearchParser
from app.parsers.rutube_search import RutubeSearchParser


class TestBaseParser:
    def test_base_parser_search_raises_not_implemented(self):
        parser = BaseParser()
        with pytest.raises(NotImplementedError):
            parser.search("test", 5)


class TestTextSearchParser:
    def setup_method(self):
        self.mock_driver = MagicMock()
        self.parser = TextSearchParser(driver=self.mock_driver)

    def test_init_without_driver(self):
        parser = TextSearchParser()
        assert parser.driver is None

    def test_init_with_driver(self):
        parser = TextSearchParser(driver=self.mock_driver)
        assert parser.driver == self.mock_driver

    def test_search_returns_error_when_no_driver(self):
        parser = TextSearchParser()
        result = parser.search("test query", 5)

        assert result["source"] == "yandex"
        assert result["error"] == "Driver not install"
        assert result["data"] == []

    @patch("app.parsers.text_search.WebDriverWait")
    @patch("app.parsers.text_search.time.sleep")
    def test_search_handles_captcha(self, mock_sleep, mock_wait):
        mock_driver = MagicMock()
        mock_driver.get.return_value = None

        mock_captcha_button = MagicMock()
        mock_wait.return_value.until.return_value = mock_captcha_button

        parser = TextSearchParser(driver=mock_driver)

        with patch("app.parsers.text_search.By") as mock_by:
            with patch("app.parsers.text_search.EC") as mock_ec:
                mock_ec.presence_of_element_located.return_value = True

                with patch("app.parsers.text_search.BeautifulSoup") as mock_soup:
                    mock_soup_instance = MagicMock()
                    mock_soup.return_value = mock_soup_instance
                    mock_soup_instance.find_all.return_value = []

                    result = parser.search("test query", 5)

                    assert result["source"] == "yandex"

    @patch("app.parsers.text_search.BeautifulSoup")
    @patch("app.parsers.text_search.WebDriverWait")
    def test_search_parses_results(self, mock_wait, mock_soup_class):
        mock_driver = MagicMock()
        mock_driver.page_source = "<html></html>"

        mock_wait_instance = MagicMock()
        mock_wait.return_value = mock_wait_instance
        mock_wait_instance.until.return_value = True

        mock_soup = MagicMock()
        mock_soup_class.return_value = mock_soup

        mock_item = MagicMock()
        mock_item.find.return_value = None
        mock_soup.find_all.return_value = [mock_item, mock_item, mock_item, mock_item]

        parser = TextSearchParser(driver=mock_driver)
        result = parser.search("test query", 5)

        assert result["source"] == "yandex"
        assert result["type"] == "text"

    def test_search_handles_exception(self):
        mock_driver = MagicMock()
        mock_driver.get.side_effect = Exception("Network error")

        parser = TextSearchParser(driver=mock_driver)
        result = parser.search("test query", 5)

        assert result["source"] == "yandex"
        assert "error" in result
        assert result["data"] == []


class TestImageSearchParser:
    def test_init_without_driver(self):
        parser = ImageSearchParser()
        assert parser.driver is None

    def test_init_with_driver(self):
        mock_driver = MagicMock()
        parser = ImageSearchParser(driver=mock_driver)
        assert parser.driver == mock_driver


class TestRutubeSearchParser:
    def test_init_without_driver(self):
        parser = RutubeSearchParser()
        assert parser.driver is None

    def test_init_with_driver(self):
        mock_driver = MagicMock()
        parser = RutubeSearchParser(driver=mock_driver)
        assert parser.driver == mock_driver


class TestSearchService:
    def test_service_file_exists(self):
        import os

        path = os.path.join(os.path.dirname(__file__), "app/services/search_service.py")
        assert os.path.exists(path)

    def test_service_class_defined_in_file(self):
        with open("app/services/search_service.py", "r") as f:
            content = f.read()
        assert "class SearchService" in content

    def test_service_has_search_method(self):
        with open("app/services/search_service.py", "r") as f:
            content = f.read()
        assert "def search(" in content

    def test_service_has_close_method(self):
        with open("app/services/search_service.py", "r") as f:
            content = f.read()
        assert "def close(" in content


class TestAPIRoutes:
    def test_routes_file_exists(self):
        import os

        path = os.path.join(os.path.dirname(__file__), "app/api/routes/search.py")
        assert os.path.exists(path)

    def test_routes_has_router(self):
        with open("app/api/routes/search.py", "r") as f:
            content = f.read()
        assert "router" in content


class TestMainApp:
    def test_main_file_exists(self):
        import os

        path = os.path.join(os.path.dirname(__file__), "app/main.py")
        assert os.path.exists(path)

    def test_main_has_app(self):
        with open("app/main.py", "r") as f:
            content = f.read()
        assert "app = FastAPI()" in content

import time
import random
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

from app.parsers.base import BaseParser


class RutubeSearchParser(BaseParser):
    def __init__(self, driver = None):
        self.driver = driver

    source = 'rutube'

    def search(self, query: str, count_result: int) -> dict:
        if not self.driver:
            return {
                "source": self.source,
                "error": "Driver not install",
                "data": []
            }

        search_url = f"https://rutube.ru/search/?query={query}"

        try:
            self.driver.get(search_url)

            # Небольшая задержка для загрузки страницы
            time.sleep(random.uniform(2, 4))

            # Обработка возможной капчи (кнопка "Я не робот")
            self._handle_captcha()

            wait = WebDriverWait(self.driver, 15)
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.wdp-card-description-module__titleWrapper")))

            # Прокручиваем страницу, чтобы подгрузить больше результатов (опционально)
            #self._scroll_page()

            # Получаем HTML и парсим
            html = self.driver.page_source
            soup = BeautifulSoup(html, 'lxml')

            results = self._extract_results(soup)

            return {
                "source": self.source,
                "type": "video",
                "data": results[:count_result]
            }

        except Exception as e:
            return {
                "source": self.source,
                "error": str(e),
                "data": []
            }

    def _handle_captcha(self):
        """Проверяет наличие простой капчи (кнопка 'Я не робот') и кликает."""
        try:
            # Ищем кнопку капчи (разные варианты селекторов)
            captcha_button = WebDriverWait(self.driver, random.randint(4, 7)).until(
                EC.element_to_be_clickable((By.XPATH, "//input[@class='CheckboxCaptcha-Button']"))
            )
            captcha_button.click()
            time.sleep(random.uniform(2, 4))
        except:
            # Капчи нет или она сложная — пропускаем
            pass

    def _scroll_page(self):
        """Прокручивает страницу для подгрузки дополнительных результатов."""
        # Прокручиваем несколько раз с паузами
        for _ in range(random.randint(2, 4)):
            self.driver.execute_script("window.scrollBy(0, window.innerHeight * 0.7);")
            time.sleep(random.uniform(1, 2))

    def _extract_results(self, soup):
        """Извлекает ссылки и картинки из HTML в зависимости от типа страницы."""
        results = []

        items = soup.find_all("div", class_="wdp-card-description-module__titleWrapper")

        for item in items:
            a_tag = item.find("a")
            a_url = 'https://rutube.ru' + a_tag.get("href") if a_tag else None
            a_title = a_tag.get("title") if a_tag else None

            results.append({
                "title": a_title,
                "link": a_url
            })

        return results

    def close(self):
        """Закрывает драйвер."""
        if self.driver:
            self.driver.quit()
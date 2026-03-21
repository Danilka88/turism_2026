import time
import random
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

from app.parsers.base import BaseParser


class TextSearchParser(BaseParser):
    def __init__(self, driver = None):
        self.driver = driver

    def search(self, query: str, count_result: int) -> dict:
        if not self.driver:
            return {
                "source": "yandex",
                "error": "Driver not install",
                "data": []
            }

        search_url = f"https://yandex.ru/search/?text={query}"

        try:
            self.driver.get(search_url)

            # Небольшая задержка для загрузки страницы
            time.sleep(random.uniform(2, 4))

            # Обработка возможной капчи (кнопка "Я не робот")
            self._handle_captcha()

            # Ждём, пока загрузятся результаты (по наличию элементов) "li.serp-item"
            wait = WebDriverWait(self.driver, 15)
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "li.serp-item")))

            # Прокручиваем страницу, чтобы подгрузить больше результатов (опционально)
            #self._scroll_page()

            # Получаем HTML и парсим
            html = self.driver.page_source
            soup = BeautifulSoup(html, 'lxml')

            results = self._extract_results(soup)

            return {
                "source": "yandex",
                "type": "text",
                "data": results[:count_result]
            }

        except Exception as e:
            return {
                "source": "yandex",
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

        items = soup.find_all("li", class_="serp-item")

        for item in items:
            # Для картинок: ссылка на полноразмерное изображение
            img_tag = item.find("img")
            img_url = img_tag.get("src") if img_tag else None

            # Ссылка на страницу источника (обычно в теге <a> с классом "serp-item__link")
            link_tag = item.find("a", class_="serp-item__link") or item.find("a")
            link = link_tag.get("href") if link_tag else None

            # Заголовок
            title_tag = item.find("h2") or item.find("div", class_="serp-item__title")
            title = title_tag.text.strip() if title_tag else None

            results.append({
                "title": title,
                "link": link
            })

        return results[3:]

    def close(self):
        """Закрывает драйвер."""
        if self.driver:
            self.driver.quit()
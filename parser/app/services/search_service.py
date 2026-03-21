import random
import undetected_chromedriver as uc
from selenium_stealth import stealth

from app.parsers.image_search import ImageSearchParser
from app.parsers.text_search import TextSearchParser
from app.parsers.rutube_search import RutubeSearchParser


class SearchService:
    def __init__(self, headless=False, user_data_dir=None):

        self.headless = headless
        self.user_data_dir = user_data_dir
        self.driver = self._init_driver()

        self.text_search_parser = TextSearchParser(driver=self.driver)
        self.text_image_parser = ImageSearchParser(driver=self.driver)
        self.rutube_search_parser = RutubeSearchParser(driver=self.driver)



    def _init_driver(self):
        options = uc.ChromeOptions()

        if self.user_data_dir:
            options.add_argument(f'--user-data-dir={self.user_data_dir}')

        options.add_argument('--lang=ru-RU')
        options.add_argument(
            'user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )

        width = random.randint(1200, 1600)
        height = random.randint(800, 1000)
        options.add_argument(f'--window-size={width},{height}')

        options.add_argument('--disable-blink-features=AutomationControlled')

        if self.headless:
            options.add_argument('--headless')
            options.add_argument('--disable-gpu')
            options.add_argument('--no-sandbox')
            options.add_argument('--disable-dev-shm-usage')

        driver = uc.Chrome(
            options=options,
            browser_executable_path="/usr/bin/chromium",
            driver_executable_path="./tmp/chromedriver"
        )
        stealth(driver,
                languages=["ru-RU", "ru"],
                vendor="Google Inc.",
                platform="Linux",
                webgl_vendor="Intel Inc.",
                renderer="Intel Iris OpenGL Engine",
                fix_hairline=True,
                )
        return driver

    def search(self, query: str, results_on_block: int) -> dict:
        results = []

        results.append(self.text_search_parser.search(query, results_on_block))
        results.append(self.text_image_parser.search(query + 'Туризм', results_on_block))
        results.append(self.rutube_search_parser.search(query, results_on_block))

        aggregated = {
            "query": query,
            "results": []
        }

        for result in results:
            if isinstance(result, Exception):
                continue
            aggregated["results"].append(result)


        return aggregated

    def close(self):
        if self.driver:
            self.driver.quit()
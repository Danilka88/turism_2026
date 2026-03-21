class BaseParser:
    def search(self, query: str, count_result: int) -> dict:
        raise NotImplementedError
from typing import Dict, Any


class FeedbackAnalyzerAgent:
    def __init__(self, ollama_service=None):
        self.ollama = ollama_service

    async def analyze(
        self, comment: str, rating: float, tags: list = None
    ) -> Dict[str, Any]:
        tags = tags or []

        sentiment = self._analyze_sentiment(comment)
        key_points = self._extract_key_points(comment)
        improvements = self._suggest_improvements(comment, rating)

        sentiment_score = (
            1.0 if sentiment == "positive" else 0.5 if sentiment == "neutral" else 0.0
        )
        predicted_rating = min(5, max(1, (rating * 0.7 + sentiment_score * 5 * 0.3)))

        return {
            "sentiment": sentiment,
            "sentiment_score": sentiment_score,
            "key_points": key_points,
            "improvements": improvements,
            "rating_prediction": round(predicted_rating, 1),
            "tags": tags,
            "requires_attention": rating < 3 or sentiment == "negative",
        }

    def _analyze_sentiment(self, text: str) -> str:
        text_lower = text.lower()

        positive_words = [
            "отлично",
            "прекрасно",
            "супер",
            "класс",
            "восхитительно",
            "прекрасно",
            "понравилось",
            "красиво",
            "хорошо",
        ]
        negative_words = [
            "ужасно",
            "плохо",
            "разочарован",
            "не понравилось",
            "грязно",
            "плохой",
            "ужас",
            "отстой",
            "разочарование",
        ]

        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)

        if positive_count > negative_count:
            return "positive"
        elif negative_count > positive_count:
            return "negative"
        return "neutral"

    def _extract_key_points(self, text: str) -> list:
        points = []

        if any(word in text.lower() for word in ["виды", "красиво", "природа", "горы"]):
            points.append("Привлекательность природы")
        if any(word in text.lower() for word in ["сервис", "обслуживание", "персонал"]):
            points.append("Качество сервиса")
        if any(word in text.lower() for word in ["чисто", "уборка", "комфорт"]):
            points.append("Комфорт и чистота")
        if any(
            word in text.lower() for word in ["цена", "дорого", "дешево", "стоимость"]
        ):
            points.append("Цена/качество")
        if any(
            word in text.lower()
            for word in ["дорога", "путь", "добраться", "транспорт"]
        ):
            points.append("Транспортная доступность")

        return points

    def _suggest_improvements(self, text: str, rating: float) -> list:
        suggestions = []
        text_lower = text.lower()

        if rating < 4:
            if "очередь" in text_lower or "ждать" in text_lower:
                suggestions.append("Сократить время ожидания")
            if "цена" in text_lower or "дорого" in text_lower:
                suggestions.append("Пересмотреть ценовую политику")
            if "чистота" in text_lower or "грязно" in text_lower:
                suggestions.append("Улучшить чистоту территории")
            if "сервис" in text_lower or "персонал" in text_lower:
                suggestions.append("Провести тренинг для персонала")

        if "скучно" in text_lower or "нечего делать" in text_lower:
            suggestions.append("Добавить развлекательные активности")
        if "далеко" in text_lower or "трудно добраться" in text_lower:
            suggestions.append("Улучшить транспортную доступность")

        return suggestions


feedback_analyzer_agent = FeedbackAnalyzerAgent()

from fastapi import FastAPI
from api.routes import router as route_router

app = FastAPI(
    title="Route Intelligence API",
    description="Интеллектуальная система анализа маршрутов и логистики",
    version="1.0.0",
)

app.include_router(route_router, prefix="/api/route", tags=["route"])


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "route-intelligence"}


@app.get("/")
async def root():
    return {
        "service": "Route Intelligence Agents",
        "version": "1.0.0",
        "endpoints": [
            "POST /api/route/nearby - Найти ближайшие объекты",
            "POST /api/route/distance - Рассчитать расстояние",
            "POST /api/route/analyze - Проанализировать маршрут",
            "POST /api/route/plan - Составить маршрут",
            "POST /api/route/feedback - Анализ обратной связи",
            "GET /api/route/transport-types - Типы транспорта",
        ],
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)

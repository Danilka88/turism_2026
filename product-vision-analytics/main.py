from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from api.routes import router
from agents.product_vision_agent import product_vision_agent
from agents.producer_finder_agent import producer_finder_agent
from agents.tour_route_agent import tour_route_agent
from agents.degustation_agent import degustation_agent
from agents.booking_agent import booking_agent


app = FastAPI(
    title="Product Vision Analytics",
    description="Интеллектуальная система визуального анализа продуктов Краснодарского края",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router)


@app.on_event("startup")
async def startup_event():
    print("=" * 50)
    print("Product Vision Analytics - Запуск")
    print("=" * 50)

    await product_vision_agent.initialize()
    print(
        f"✓ ProductVisionAgent инициализирован (режим: {'Ollama' if not product_vision_agent.demo_mode else 'Demo'})"
    )

    await producer_finder_agent.initialize()
    print(f"✓ ProducerFinderAgent инициализирован")

    await tour_route_agent.initialize()
    print(f"✓ TourRouteAgent инициализирован")

    await degustation_agent.initialize()
    print(f"✓ DegustationAgent инициализирован")

    await booking_agent.initialize()
    print(f"✓ BookingAgent инициализирован")

    print("=" * 50)
    print("Все агенты готовы к работе")
    print("=" * 50)


@app.get("/")
async def root():
    return {
        "module": "Product Vision Analytics",
        "version": "1.0.0",
        "description": "Визуальный анализ продуктов и производственный туризм",
        "endpoints": {
            "health": "/api/health",
            "analyze_product": "/api/analyze-product",
            "find_producer": "/api/find-producer",
            "tours": "/api/tours",
            "degustations": "/api/degustations",
            "booking": "/api/booking",
            "products": "/api/products",
        },
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8004, reload=True, log_level="info")

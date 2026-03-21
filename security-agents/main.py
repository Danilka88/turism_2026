from fastapi import FastAPI
from api.routes import router as security_router
from config.settings import Settings

settings = Settings()

app = FastAPI(
    title="AI Security Agents",
    description="Автономная система безопасности на основе ИИ-агентов",
    version="1.0.0",
)

app.include_router(security_router, prefix="/api/security", tags=["security"])


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "security-agents"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)

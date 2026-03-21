from fastapi import APIRouter
from app.services.search_service import SearchService

router = APIRouter()

@router.post("/search")
async def search_endpoint(query: str, results_on_block:int = 5):
    search_service = SearchService(
        headless=False,
        user_data_dir="./tmp/chrome_profile"
    )
    result = search_service.search(query, results_on_block)
    search_service.close()

    return result
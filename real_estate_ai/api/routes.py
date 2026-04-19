

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from agents.conversation_agent import ConversationAgent
from repositories.property_repository import find_properties

router = APIRouter()


conversation_agent = ConversationAgent()


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
def chat(request: ChatRequest):
    try:
        return conversation_agent.handle(request.message)

    except Exception as e:
        print("🔥 ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/properties/buy")
def get_buy_properties(
    city: str | None = None,
    locality: str | None = None,
    budget: int | None = Query(default=None, ge=0),
    bhk: int | None = Query(default=None, ge=1),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=12, ge=1, le=50),
):
    skip = (page - 1) * limit
    properties = find_properties(
        {
            "listing_type": "buy",
            "city": city,
            "locality": locality,
            "budget": budget,
            "bhk": bhk,
        },
        skip=skip,
        limit=limit,
    )
    return {"properties": properties, "page": page}


@router.get("/properties/rent")
def get_rent_properties(
    city: str | None = None,
    locality: str | None = None,
    budget: int | None = Query(default=None, ge=0),
    bhk: int | None = Query(default=None, ge=1),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=12, ge=1, le=50),
):
    skip = (page - 1) * limit
    properties = find_properties(
        {
            "listing_type": "rent",
            "city": city,
            "locality": locality,
            "budget": budget,
            "bhk": bhk,
        },
        skip=skip,
        limit=limit,
    )
    return {"properties": properties, "page": page}
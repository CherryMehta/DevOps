from pydantic import BaseModel
from typing import List, Dict

class ChatResponse(BaseModel):
    reply: str
    properties: List[Dict]
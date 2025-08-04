# relevance_api.py
from fastapi import FastAPI, Request
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util

app = FastAPI()
model = SentenceTransformer('all-MiniLM-L6-v2')  # Load once

class CommentInput(BaseModel):
    comment: str
    topic: str

@app.post("/check")
async def check_relevance(data: CommentInput):
    similarity = util.cos_sim(model.encode(data.comment), model.encode(data.topic))[0][0].item()
    return {"similarity": similarity}

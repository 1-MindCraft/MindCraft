from fastapi import FastAPI
from app.core.config import settings

app = FastAPI(
    title="MindCraft AI Server",
    description="마인드맵 기반 AI 자소서 생성 서비스",
    version="1.0.0"
)

@app.get("/status")
def status_check():
    return{
        "status": "ok",
        "model": settings.LLM_MODEL,    
    }
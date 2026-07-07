import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.routers.coverletter import router as coverletter_router

logger = logging.getLogger("mindcraft.ai")

app = FastAPI(
    title="MindCraft AI Server",
    description="Mind map based AI cover letter generation service.",
    version="1.0.0",
)

app.include_router(coverletter_router)


@app.middleware("http")
async def log_coverletter_requests(request: Request, call_next):
    if request.url.path.startswith("/coverletters"):
        body = await request.body()
        logger.info(
            "Incoming request method=%s path=%s content_type=%s body=%s",
            request.method,
            request.url.path,
            request.headers.get("content-type"),
            body.decode("utf-8", errors="replace"),
        )

    return await call_next(request)


@app.exception_handler(RequestValidationError)
async def handle_request_validation_error(request: Request, exc: RequestValidationError):
    body = await request.body()
    logger.error(
        "Request validation failed path=%s content_type=%s body=%s errors=%s",
        request.url.path,
        request.headers.get("content-type"),
        body.decode("utf-8", errors="replace"),
        exc.errors(),
    )
    return JSONResponse(status_code=422, content={"detail": exc.errors()})


@app.get("/status")
def status_check():
    return {
        "status": "ok",
        "model": settings.LLM_MODEL,
    }

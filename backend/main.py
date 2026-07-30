from pathlib import Path
from urllib.parse import quote

from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles


BACKEND_DIR = Path(__file__).resolve().parent
ROOT_DIR = BACKEND_DIR.parent
FRONTEND_DIR = ROOT_DIR / "frontend"
SLIDES_DIR = ROOT_DIR / "data" / "vlearn-pack" / "slides"
CHUNK_SIZE = 1024 * 1024

app = FastAPI(
    title="VinCourse API",
    description="API cung cấp tài liệu PDF cho chế độ Nhiệm vụ cốt truyện.",
    version="1.0.0",
)


def get_slide_path(filename: str) -> Path:
    if not filename or Path(filename).name != filename or Path(filename).suffix.lower() != ".pdf":
        raise HTTPException(status_code=404, detail="Không tìm thấy slide.")

    file_path = SLIDES_DIR / filename
    if not file_path.is_file():
        raise HTTPException(status_code=404, detail="Không tìm thấy slide.")
    return file_path


def iter_file_range(file_path: Path, start: int, end: int):
    with file_path.open("rb") as pdf:
        pdf.seek(start)
        remaining = end - start + 1
        while remaining > 0:
            chunk = pdf.read(min(CHUNK_SIZE, remaining))
            if not chunk:
                break
            remaining -= len(chunk)
            yield chunk


@app.get("/api/slides")
def list_slides():
    try:
        files = sorted(
            (file for file in SLIDES_DIR.iterdir() if file.is_file() and file.suffix.lower() == ".pdf"),
            key=lambda file: file.stem.casefold(),
        )
    except OSError as error:
        return JSONResponse(status_code=500, content={"error": "Không thể đọc danh sách slide."})

    return {
        "slides": [
            {
                "id": file.name,
                "title": file.stem,
                "filename": file.name,
                "size": file.stat().st_size,
                "contentUrl": f"/api/slides/{quote(file.name, safe='')}/content",
            }
            for file in files
        ]
    }


@app.get("/api/slides/{filename}/content")
def view_slide(filename: str, range_header: str | None = Header(default=None, alias="Range")):
    file_path = get_slide_path(filename)
    file_size = file_path.stat().st_size
    disposition = f"inline; filename*=UTF-8''{quote(file_path.name, safe='')}"
    common_headers = {
        "Accept-Ranges": "bytes",
        "Content-Disposition": disposition,
        "Cache-Control": "private, max-age=3600",
    }

    if not range_header:
        return FileResponse(
            file_path,
            media_type="application/pdf",
            filename=file_path.name,
            content_disposition_type="inline",
            headers={"Accept-Ranges": "bytes", "Cache-Control": "private, max-age=3600"},
        )

    try:
        unit, byte_range = range_header.strip().split("=", 1)
        start_text, end_text = byte_range.split("-", 1)
        if unit != "bytes" or "," in byte_range:
            raise ValueError

        if not start_text:
            suffix_length = int(end_text)
            if suffix_length <= 0:
                raise ValueError
            start = max(file_size - suffix_length, 0)
            end = file_size - 1
        else:
            start = int(start_text)
            end = min(int(end_text), file_size - 1) if end_text else file_size - 1

        if start < 0 or start > end or start >= file_size:
            raise ValueError
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=416,
            detail="Khoảng byte không hợp lệ.",
            headers={"Content-Range": f"bytes */{file_size}"},
        )

    headers = {
        **common_headers,
        "Content-Length": str(end - start + 1),
        "Content-Range": f"bytes {start}-{end}/{file_size}",
    }
    return StreamingResponse(
        iter_file_range(file_path, start, end),
        status_code=206,
        media_type="application/pdf",
        headers=headers,
    )


app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

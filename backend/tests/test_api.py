from urllib.parse import quote

from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_lists_all_pdf_slides_with_view_urls():
    response = client.get("/api/slides")
    body = response.json()

    assert response.status_code == 200
    assert len(body["slides"]) == 4
    assert all(slide["contentUrl"].endswith("/content") for slide in body["slides"])


def test_streams_pdf_and_supports_byte_ranges():
    slides = client.get("/api/slides").json()["slides"]
    response = client.get(slides[0]["contentUrl"], headers={"Range": "bytes=0-4"})

    assert response.status_code == 206
    assert response.headers["content-type"] == "application/pdf"
    assert response.content == b"%PDF-"


def test_rejects_slide_path_traversal():
    filename = quote("../README.pdf", safe="")
    response = client.get(f"/api/slides/{filename}/content")

    assert response.status_code == 404

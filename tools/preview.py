"""Local-only static preview for the GitHub Pages site."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class PreviewHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8765), PreviewHandler)
    print("Preview: http://127.0.0.1:8765", flush=True)
    server.serve_forever()

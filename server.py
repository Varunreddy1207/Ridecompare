import http.server
import os
import sys

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run_server(port=PORT):
    for p in [port, 3001, 8080, 8000, 8888]:
        try:
            server = http.server.ThreadingHTTPServer(("", p), CustomHTTPRequestHandler)
            print(f"============================================================")
            print(f"  VOZX RideCompare Get Started UI running at:")
            print(f"  http://localhost:{p}")
            print(f"============================================================")
            sys.stdout.flush()
            server.serve_forever()
        except OSError:
            continue

if __name__ == "__main__":
    run_server()

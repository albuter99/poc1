#!/usr/bin/env python3
"""Serve Poc1 on localhost only; can be stopped by DETENER_POC.bat."""
from __future__ import annotations

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import secrets
import threading
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
MARKER = ROOT / ".poc1-local-server.json"
HOST, PORT = "127.0.0.1", 8765


def stop():
    try:
        info = json.loads(MARKER.read_text(encoding="utf-8"))
        if info.get("host") != HOST or info.get("port") != PORT:
            raise ValueError("Invalid server marker")
        token = info["token"]
        request = Request(f"http://{HOST}:{PORT}/__poc1_stop",
                          data=token.encode("ascii"), method="POST")
        with urlopen(request, timeout=4) as response:
            if response.status != 200:
                raise RuntimeError("Unexpected response")
        print("Servidor Poc1 detenido.")
    except Exception as exc:
        print("No se encontro un servidor Poc1 activo:", exc)
    finally:
        MARKER.unlink(missing_ok=True)


def run():
    token = secrets.token_urlsafe(32)

    class Handler(SimpleHTTPRequestHandler):
        def do_POST(self):
            if self.path != "/__poc1_stop":
                self.send_error(404)
                return
            size = min(int(self.headers.get("Content-Length", 0)), 256)
            submitted = self.rfile.read(size).decode("ascii", errors="replace")
            if not secrets.compare_digest(submitted, token):
                self.send_error(403)
                return
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"OK")
            threading.Thread(target=self.server.shutdown, daemon=True).start()

    handler = partial(Handler, directory=str(ROOT))
    try:
        with ThreadingHTTPServer((HOST, PORT), handler) as server:
            MARKER.write_text(json.dumps({"host": HOST, "port": PORT, "token": token}), encoding="utf-8")
            print("POC1 disponible en http://127.0.0.1:8765/relations.html", flush=True)
            print("Para detenerlo, abre DETENER_POC.bat o cierra esta ventana.", flush=True)
            try:
                server.serve_forever(poll_interval=0.1)
            except KeyboardInterrupt:
                print("\nServidor detenido.")
    except OSError as exc:
        raise SystemExit(f"No se ha podido iniciar el servidor en el puerto {PORT}: {exc}")
    finally:
        if MARKER.exists():
            try:
                info = json.loads(MARKER.read_text(encoding="utf-8"))
                if info.get("token") == token:
                    MARKER.unlink()
            except (OSError, ValueError):
                pass


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--stop", action="store_true")
    args = parser.parse_args()
    stop() if args.stop else run()

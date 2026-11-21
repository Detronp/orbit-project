"""Orbit — a tiny, Docker-friendly space-themed website built with Flask."""

import os
import platform
import random
import socket
import time
from datetime import datetime, timezone

from flask import Flask, jsonify, render_template

STARTED_AT = time.time()

FACTS = [
    "A day on Venus is longer than its year.",
    "Neutron stars can spin 600 times per second.",
    "Jupiter's Great Red Spot is wider than Earth.",
    "Light from the Sun takes about 8 minutes 20 seconds to reach us.",
    "Saturn would float in a bathtub big enough to hold it.",
    "There are more stars in the universe than grains of sand on Earth.",
    "Olympus Mons on Mars is about 2.5 times the height of Everest.",
    "One million Earths could fit inside the Sun.",
    "Footprints on the Moon could last millions of years.",
    "The Voyager 1 probe is more than 24 billion km from Earth.",
]


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["SITE_NAME"] = os.getenv("SITE_NAME", "Orbit")
    app.config["ACCENT"] = os.getenv("ACCENT_COLOR", "#7cf3ff")

    @app.route("/")
    def index():
        return render_template(
            "index.html",
            site_name=app.config["SITE_NAME"],
            accent=app.config["ACCENT"],
        )

    @app.route("/api/info")
    def info():
        """Who served this request? Handy when you scale to several containers."""
        return jsonify(
            hostname=socket.gethostname(),
            python=platform.python_version(),
            platform=platform.platform(terse=True),
            pid=os.getpid(),
            uptime_seconds=round(time.time() - STARTED_AT, 1),
            server_time=datetime.now(timezone.utc).isoformat(timespec="seconds"),
            app_version=os.getenv("APP_VERSION", "1.0.0"),
        )

    @app.route("/api/fact")
    def fact():
        return jsonify(fact=random.choice(FACTS))

    @app.route("/healthz")
    def healthz():
        return jsonify(status="ok")

    return app


app = create_app()

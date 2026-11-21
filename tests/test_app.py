from app import create_app


def client():
    return create_app().test_client()


def test_home_page():
    r = client().get("/")
    assert r.status_code == 200
    assert b"Orbit" in r.data


def test_health():
    r = client().get("/healthz")
    assert r.get_json() == {"status": "ok"}


def test_info_has_hostname():
    data = client().get("/api/info").get_json()
    assert "hostname" in data and "uptime_seconds" in data


def test_fact():
    assert client().get("/api/fact").get_json()["fact"]

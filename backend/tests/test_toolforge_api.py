"""ToolForge backend API tests — public + admin endpoints."""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") if os.environ.get("REACT_APP_BACKEND_URL") else "https://forge-next-3.preview.emergentagent.com"
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@toolforge.io"
ADMIN_PASSWORD = "ToolForge@2026"


@pytest.fixture(scope="session")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(client):
    r = client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"login failed {r.status_code} {r.text}"
    body = r.json()
    assert "access_token" in body
    assert body["user"]["email"] == ADMIN_EMAIL
    return body["access_token"]


@pytest.fixture(scope="session")
def admin_client(client, admin_token):
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json", "Authorization": f"Bearer {admin_token}"})
    return s


# --- Health ---
def test_health(client):
    r = client.get(f"{API}/health")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"


# --- Tools ---
def test_list_tools(client):
    r = client.get(f"{API}/tools")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 20, f"expected >=20 tools, got {len(data)}"


def test_tool_categories(client):
    r = client.get(f"{API}/tools/categories")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 5
    slugs = {c["slug"] for c in data}
    assert {"developer", "text", "creative", "marketing", "business"}.issubset(slugs)


def test_tool_detail_views_increment(client):
    r1 = client.get(f"{API}/tools/json-formatter")
    assert r1.status_code == 200
    v1 = r1.json().get("views", 0)
    r2 = client.get(f"{API}/tools/json-formatter")
    assert r2.status_code == 200
    v2 = r2.json().get("views", 0)
    assert v2 > v1
    assert "_id" not in r2.json()


def test_tool_404(client):
    r = client.get(f"{API}/tools/no-such-tool-xyz")
    assert r.status_code == 404


# --- Blog ---
def test_blog_list(client):
    r = client.get(f"{API}/blog/posts")
    assert r.status_code == 200
    data = r.json()
    assert len(data) >= 3


def test_blog_detail(client):
    r = client.get(f"{API}/blog/posts/json-best-practices")
    assert r.status_code == 200
    data = r.json()
    assert data["slug"] == "json-best-practices"
    assert "content" in data and len(data["content"]) > 10


# --- Services ---
def test_list_services(client):
    r = client.get(f"{API}/services")
    assert r.status_code == 200
    assert len(r.json()) >= 5


def test_service_detail(client):
    r = client.get(f"{API}/services/website-development")
    assert r.status_code == 200
    assert r.json()["slug"] == "website-development"


# --- Pages ---
def test_page_privacy(client):
    r = client.get(f"{API}/pages/privacy")
    assert r.status_code == 200
    data = r.json()
    assert data["slug"] == "privacy"
    assert "content" in data


# --- Contact ---
def test_contact_create(client):
    r = client.post(f"{API}/contact", json={
        "name": "TEST_User",
        "email": "test@example.com",
        "message": "Hello from automated test",
        "subject": "general",
        "source": "contact",
    })
    assert r.status_code == 200
    body = r.json()
    assert body["ok"] is True
    assert "id" in body


# --- Auth ---
def test_auth_me(client, admin_token):
    r = client.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {admin_token}"})
    assert r.status_code == 200
    data = r.json()
    assert data["email"] == ADMIN_EMAIL
    assert data["role"] == "super_admin"
    assert "password_hash" not in data


def test_auth_login_bad_password(client):
    r = client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
    assert r.status_code in (401, 429)


# --- Admin protected ---
def test_admin_unauth():
    # Fresh session without cookies/auth
    s = requests.Session()
    for path in ["/admin/contacts", "/admin/blog/posts", "/admin/pages", "/admin/audit", "/admin/overview"]:
        r = s.get(f"{API}{path}")
        assert r.status_code in (401, 403), f"{path} returned {r.status_code}"


def test_admin_overview(admin_client):
    r = admin_client.get(f"{API}/admin/overview")
    assert r.status_code == 200
    data = r.json()
    assert "stats" in data and "top_tools" in data and "audit" in data
    assert data["stats"]["tools"] >= 20


def test_admin_lists(admin_client):
    for path in ["/admin/contacts", "/admin/blog/posts", "/admin/pages", "/admin/audit"]:
        r = admin_client.get(f"{API}{path}")
        assert r.status_code == 200, f"{path} -> {r.status_code}"
        assert isinstance(r.json(), list)


# --- Admin CRUD: blog ---
def test_admin_blog_crud(admin_client):
    slug = f"test-post-{uuid.uuid4().hex[:8]}"
    create = admin_client.post(f"{API}/admin/blog/posts", json={
        "title": "TEST_Post", "slug": slug, "excerpt": "x", "content": "hello",
        "status": "draft", "tags": ["test"], "category": "guides"
    })
    assert create.status_code == 200, create.text
    pid = create.json()["id"]

    upd = admin_client.put(f"{API}/admin/blog/posts/{pid}", json={
        "title": "TEST_Post Updated", "slug": slug, "excerpt": "x", "content": "hello2",
        "status": "published", "tags": ["test"], "category": "guides"
    })
    assert upd.status_code == 200
    assert upd.json()["status"] == "published"

    get_pub = admin_client.get(f"{API}/blog/posts/{slug}")
    assert get_pub.status_code == 200

    delete = admin_client.delete(f"{API}/admin/blog/posts/{pid}")
    assert delete.status_code == 200

    # verify deleted
    get_gone = admin_client.get(f"{API}/blog/posts/{slug}")
    assert get_gone.status_code == 404


# --- Admin CRUD: tools ---
def test_admin_tool_crud(admin_client):
    slug = f"test-tool-{uuid.uuid4().hex[:8]}"
    create = admin_client.post(f"{API}/admin/tools", json={
        "name": "TEST_Tool", "slug": slug, "category": "developer",
        "description": "test", "enabled": True
    })
    assert create.status_code == 200, create.text
    tid = create.json()["id"]

    upd = admin_client.put(f"{API}/admin/tools/{tid}", json={
        "name": "TEST_Tool Updated", "slug": slug, "category": "developer",
        "description": "updated", "enabled": True
    })
    assert upd.status_code == 200
    assert upd.json()["description"] == "updated"

    delete = admin_client.delete(f"{API}/admin/tools/{tid}")
    assert delete.status_code == 200


# --- Admin settings ---
def test_admin_settings_update(admin_client):
    r = admin_client.put(f"{API}/admin/settings", json={
        "site_name": "ToolForge",
        "tagline": "Test tagline " + uuid.uuid4().hex[:6],
    })
    assert r.status_code == 200
    # Verify via public settings
    g = requests.get(f"{API}/settings")
    assert g.status_code == 200
    assert "tagline" in g.json()

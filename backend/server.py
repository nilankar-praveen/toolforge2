"""ToolForge backend — FastAPI + MongoDB.

Provides:
  - JWT-based auth (httpOnly cookies, bearer fallback)
  - Tools catalog (categories + tools)
  - Blog (categories + posts)
  - Services
  - Contact / lead requests
  - Pages (CMS)
  - Advertisements
  - Site settings
  - FAQs
  - Audit logs
  - Health + analytics counters
"""
from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import logging
import secrets
from datetime import datetime, timezone, timedelta
from typing import Annotated, Any, List, Optional

import bcrypt
import jwt
from bson import ObjectId
from fastapi import (APIRouter, Depends, FastAPI, HTTPException, Query,
                     Request, Response, status)
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, BeforeValidator, ConfigDict, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

# ---------- Mongo ----------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

JWT_ALGORITHM = "HS256"
JWT_SECRET = os.environ["JWT_SECRET"]
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@toolforge.io")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "ToolForge@2026")

logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("toolforge")

# ---------- Helpers ----------
def _oid(value: Any) -> str:
    if isinstance(value, ObjectId):
        return str(value)
    return str(value)


PyObjectId = Annotated[str, BeforeValidator(_oid)]


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def iso(dt: datetime) -> str:
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat()


def serialize(doc: Optional[dict]) -> Optional[dict]:
    if doc is None:
        return None
    out = dict(doc)
    if "_id" in out:
        out["id"] = str(out.pop("_id"))
    for k, v in list(out.items()):
        if isinstance(v, datetime):
            out[k] = iso(v)
        if isinstance(v, ObjectId):
            out[k] = str(v)
    out.pop("password_hash", None)
    return out


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": now_utc() + timedelta(minutes=60 * 12),  # 12h for admin convenience
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": now_utc() + timedelta(days=7),
        "type": "refresh",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    response.set_cookie("access_token", access_token, httponly=True, secure=True,
                        samesite="none", max_age=60 * 60 * 12, path="/")
    response.set_cookie("refresh_token", refresh_token, httponly=True, secure=True,
                        samesite="none", max_age=60 * 60 * 24 * 7, path="/")


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") not in ("super_admin", "admin", "editor"):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


async def audit(user: dict, action: str, target: str, meta: Optional[dict] = None) -> None:
    await db.audit_logs.insert_one({
        "user_id": str(user["_id"]),
        "user_email": user.get("email"),
        "action": action,
        "target": target,
        "meta": meta or {},
        "created_at": now_utc(),
    })


# ---------- Schemas ----------
class LoginIn(BaseModel):
    email: EmailStr
    password: str


class ContactIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = None
    subject: Optional[str] = "general"
    service: Optional[str] = None
    message: str = Field(min_length=1, max_length=4000)
    source: Optional[str] = "contact"


class BlogPostIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    title: str
    slug: Optional[str] = None
    excerpt: Optional[str] = ""
    content: str = ""
    category: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    cover_image: Optional[str] = None
    status: str = "draft"
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None


class ToolIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    slug: str
    category: str
    description: str = ""
    icon: Optional[str] = None
    featured: bool = False
    trending: bool = False
    enabled: bool = True
    order: int = 0
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None


class ServiceIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    slug: str
    tagline: str = ""
    description: str = ""
    starting_price: Optional[str] = None
    benefits: List[str] = Field(default_factory=list)
    process: List[dict] = Field(default_factory=list)
    faqs: List[dict] = Field(default_factory=list)
    icon: Optional[str] = None
    featured: bool = False
    enabled: bool = True


class PageIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    title: str
    slug: str
    content: str = ""
    sections: List[dict] = Field(default_factory=list)
    status: str = "draft"
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None


class AdIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    placement: str  # header | sidebar | in-content | footer
    html: Optional[str] = ""
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    enabled: bool = True


class SettingsIn(BaseModel):
    site_name: Optional[str] = None
    tagline: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    seo_default_title: Optional[str] = None
    seo_default_description: Optional[str] = None
    social: Optional[dict] = None
    footer_text: Optional[str] = None


# ---------- App ----------
app = FastAPI(title="ToolForge API", version="1.0.0")
api = APIRouter(prefix="/api")


# ---------- Health ----------
@api.get("/")
async def root():
    return {"ok": True, "service": "ToolForge", "time": iso(now_utc())}


@api.get("/health")
async def health():
    try:
        await db.command("ping")
        return {"status": "ok", "db": "ok"}
    except Exception as e:
        return {"status": "degraded", "db": str(e)}


# ---------- Auth ----------
@api.post("/auth/login")
async def login(payload: LoginIn, request: Request, response: Response):
    email = payload.email.lower().strip()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{email}"

    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("locked_until") and attempt["locked_until"] > now_utc():
        raise HTTPException(status_code=429, detail="Too many attempts. Try again later.")

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        # increment attempts
        attempts = (attempt.get("attempts", 0) if attempt else 0) + 1
        update = {"attempts": attempts, "last_at": now_utc()}
        if attempts >= 5:
            update["locked_until"] = now_utc() + timedelta(minutes=15)
            update["attempts"] = 0
        await db.login_attempts.update_one(
            {"identifier": identifier}, {"$set": update}, upsert=True
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await db.login_attempts.delete_one({"identifier": identifier})
    access = create_access_token(str(user["_id"]), user["email"], user.get("role", "admin"))
    refresh = create_refresh_token(str(user["_id"]))
    set_auth_cookies(response, access, refresh)
    return {"user": serialize(user), "access_token": access}


@api.post("/auth/logout")
async def logout(response: Response, user: dict = Depends(get_current_user)):
    clear_auth_cookies(response)
    return {"ok": True}


@api.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return serialize(user)


@api.post("/auth/refresh")
async def refresh_token_endpoint(request: Request, response: Response):
    refresh = request.cookies.get("refresh_token")
    if not refresh:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(refresh, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        new_access = create_access_token(str(user["_id"]), user["email"], user.get("role", "admin"))
        response.set_cookie("access_token", new_access, httponly=True, secure=True,
                            samesite="none", max_age=60 * 60 * 12, path="/")
        return {"ok": True, "access_token": new_access}
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


# ---------- Tools (public + admin) ----------
@api.get("/tools")
async def list_tools(category: Optional[str] = None,
                     q: Optional[str] = None,
                     featured: Optional[bool] = None,
                     limit: int = 200):
    query: dict = {"enabled": True}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    if q:
        query["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"slug": {"$regex": q, "$options": "i"}},
        ]
    cursor = db.tools.find(query).sort([("order", 1), ("name", 1)]).limit(limit)
    return [serialize(d) async for d in cursor]


@api.get("/tools/categories")
async def list_tool_categories():
    cursor = db.tool_categories.find().sort("order", 1)
    return [serialize(d) async for d in cursor]


@api.get("/tools/{slug}")
async def get_tool(slug: str):
    doc = await db.tools.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Tool not found")
    # increment views
    await db.tools.update_one({"_id": doc["_id"]}, {"$inc": {"views": 1}})
    doc["views"] = doc.get("views", 0) + 1
    return serialize(doc)


@api.post("/admin/tools", dependencies=[Depends(require_admin)])
async def create_tool(payload: ToolIn, user: dict = Depends(require_admin)):
    existing = await db.tools.find_one({"slug": payload.slug})
    if existing:
        raise HTTPException(status_code=400, detail="slug already exists")
    doc = payload.model_dump()
    doc.update({"views": 0, "created_at": now_utc(), "updated_at": now_utc()})
    result = await db.tools.insert_one(doc)
    await audit(user, "tool.create", str(result.inserted_id))
    inserted = await db.tools.find_one({"_id": result.inserted_id})
    return serialize(inserted)


@api.put("/admin/tools/{tool_id}")
async def update_tool(tool_id: str, payload: ToolIn, user: dict = Depends(require_admin)):
    doc = payload.model_dump()
    doc["updated_at"] = now_utc()
    result = await db.tools.update_one({"_id": ObjectId(tool_id)}, {"$set": doc})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Tool not found")
    await audit(user, "tool.update", tool_id)
    updated = await db.tools.find_one({"_id": ObjectId(tool_id)})
    return serialize(updated)


@api.delete("/admin/tools/{tool_id}")
async def delete_tool(tool_id: str, user: dict = Depends(require_admin)):
    result = await db.tools.delete_one({"_id": ObjectId(tool_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tool not found")
    await audit(user, "tool.delete", tool_id)
    return {"ok": True}


# ---------- Blog ----------
@api.get("/blog/posts")
async def list_posts(category: Optional[str] = None,
                     tag: Optional[str] = None,
                     q: Optional[str] = None,
                     limit: int = 50):
    query: dict = {"status": "published"}
    if category:
        query["category"] = category
    if tag:
        query["tags"] = tag
    if q:
        query["$or"] = [
            {"title": {"$regex": q, "$options": "i"}},
            {"excerpt": {"$regex": q, "$options": "i"}},
        ]
    cursor = db.blog_posts.find(query).sort("published_at", -1).limit(limit)
    return [serialize(d) async for d in cursor]


@api.get("/blog/categories")
async def list_blog_cats():
    cursor = db.blog_categories.find().sort("name", 1)
    return [serialize(d) async for d in cursor]


@api.get("/blog/posts/{slug}")
async def get_post(slug: str):
    doc = await db.blog_posts.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")
    await db.blog_posts.update_one({"_id": doc["_id"]}, {"$inc": {"views": 1}})
    return serialize(doc)


@api.get("/admin/blog/posts", dependencies=[Depends(require_admin)])
async def admin_list_posts():
    cursor = db.blog_posts.find().sort("created_at", -1)
    return [serialize(d) async for d in cursor]


@api.post("/admin/blog/posts")
async def create_post(payload: BlogPostIn, user: dict = Depends(require_admin)):
    doc = payload.model_dump()
    if not doc.get("slug"):
        doc["slug"] = doc["title"].lower().replace(" ", "-")
    existing = await db.blog_posts.find_one({"slug": doc["slug"]})
    if existing:
        raise HTTPException(status_code=400, detail="slug already exists")
    doc["author"] = user.get("email")
    doc["created_at"] = now_utc()
    doc["updated_at"] = now_utc()
    doc["views"] = 0
    if doc.get("status") == "published":
        doc["published_at"] = now_utc()
    result = await db.blog_posts.insert_one(doc)
    await audit(user, "blog.create", str(result.inserted_id))
    return serialize(await db.blog_posts.find_one({"_id": result.inserted_id}))


@api.put("/admin/blog/posts/{post_id}")
async def update_post(post_id: str, payload: BlogPostIn, user: dict = Depends(require_admin)):
    doc = payload.model_dump()
    doc["updated_at"] = now_utc()
    if doc.get("status") == "published":
        existing = await db.blog_posts.find_one({"_id": ObjectId(post_id)})
        if existing and not existing.get("published_at"):
            doc["published_at"] = now_utc()
    result = await db.blog_posts.update_one({"_id": ObjectId(post_id)}, {"$set": doc})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    await audit(user, "blog.update", post_id)
    return serialize(await db.blog_posts.find_one({"_id": ObjectId(post_id)}))


@api.delete("/admin/blog/posts/{post_id}")
async def delete_post(post_id: str, user: dict = Depends(require_admin)):
    result = await db.blog_posts.delete_one({"_id": ObjectId(post_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    await audit(user, "blog.delete", post_id)
    return {"ok": True}


# ---------- Services ----------
@api.get("/services")
async def list_services():
    cursor = db.services.find({"enabled": True}).sort("order", 1)
    return [serialize(d) async for d in cursor]


@api.get("/services/{slug}")
async def get_service(slug: str):
    doc = await db.services.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Service not found")
    return serialize(doc)


@api.post("/admin/services")
async def create_service(payload: ServiceIn, user: dict = Depends(require_admin)):
    doc = payload.model_dump()
    doc["created_at"] = now_utc()
    doc["updated_at"] = now_utc()
    result = await db.services.insert_one(doc)
    await audit(user, "service.create", str(result.inserted_id))
    return serialize(await db.services.find_one({"_id": result.inserted_id}))


@api.put("/admin/services/{service_id}")
async def update_service(service_id: str, payload: ServiceIn, user: dict = Depends(require_admin)):
    doc = payload.model_dump()
    doc["updated_at"] = now_utc()
    result = await db.services.update_one({"_id": ObjectId(service_id)}, {"$set": doc})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    await audit(user, "service.update", service_id)
    return serialize(await db.services.find_one({"_id": ObjectId(service_id)}))


@api.delete("/admin/services/{service_id}")
async def delete_service(service_id: str, user: dict = Depends(require_admin)):
    result = await db.services.delete_one({"_id": ObjectId(service_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    await audit(user, "service.delete", service_id)
    return {"ok": True}


# ---------- Contact / Leads ----------
@api.post("/contact")
async def submit_contact(payload: ContactIn, request: Request):
    doc = payload.model_dump()
    doc["ip"] = request.client.host if request.client else None
    doc["user_agent"] = request.headers.get("user-agent")
    doc["created_at"] = now_utc()
    doc["status"] = "new"
    result = await db.contact_requests.insert_one(doc)
    return {"ok": True, "id": str(result.inserted_id)}


@api.get("/admin/contacts")
async def admin_list_contacts(_: dict = Depends(require_admin), status_q: Optional[str] = None):
    query: dict = {}
    if status_q:
        query["status"] = status_q
    cursor = db.contact_requests.find(query).sort("created_at", -1).limit(500)
    return [serialize(d) async for d in cursor]


@api.put("/admin/contacts/{contact_id}")
async def update_contact(contact_id: str, payload: dict, user: dict = Depends(require_admin)):
    allowed = {k: v for k, v in payload.items() if k in ("status", "notes")}
    if not allowed:
        raise HTTPException(status_code=400, detail="No valid fields")
    result = await db.contact_requests.update_one(
        {"_id": ObjectId(contact_id)}, {"$set": allowed}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    await audit(user, "contact.update", contact_id, allowed)
    return serialize(await db.contact_requests.find_one({"_id": ObjectId(contact_id)}))


# ---------- Pages ----------
@api.get("/pages/{slug}")
async def get_page(slug: str):
    doc = await db.pages.find_one({"slug": slug, "status": "published"})
    if not doc:
        raise HTTPException(status_code=404, detail="Page not found")
    return serialize(doc)


@api.get("/admin/pages")
async def admin_list_pages(_: dict = Depends(require_admin)):
    cursor = db.pages.find().sort("updated_at", -1)
    return [serialize(d) async for d in cursor]


@api.post("/admin/pages")
async def create_page(payload: PageIn, user: dict = Depends(require_admin)):
    doc = payload.model_dump()
    existing = await db.pages.find_one({"slug": doc["slug"]})
    if existing:
        raise HTTPException(status_code=400, detail="slug already exists")
    doc["created_at"] = now_utc()
    doc["updated_at"] = now_utc()
    if doc.get("status") == "published":
        doc["published_at"] = now_utc()
    result = await db.pages.insert_one(doc)
    await audit(user, "page.create", str(result.inserted_id))
    return serialize(await db.pages.find_one({"_id": result.inserted_id}))


@api.put("/admin/pages/{page_id}")
async def update_page(page_id: str, payload: PageIn, user: dict = Depends(require_admin)):
    doc = payload.model_dump()
    doc["updated_at"] = now_utc()
    if doc.get("status") == "published":
        existing = await db.pages.find_one({"_id": ObjectId(page_id)})
        if existing and not existing.get("published_at"):
            doc["published_at"] = now_utc()
    result = await db.pages.update_one({"_id": ObjectId(page_id)}, {"$set": doc})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Page not found")
    await audit(user, "page.update", page_id)
    return serialize(await db.pages.find_one({"_id": ObjectId(page_id)}))


@api.delete("/admin/pages/{page_id}")
async def delete_page(page_id: str, user: dict = Depends(require_admin)):
    result = await db.pages.delete_one({"_id": ObjectId(page_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Page not found")
    await audit(user, "page.delete", page_id)
    return {"ok": True}


# ---------- Ads ----------
@api.get("/ads")
async def list_ads(placement: Optional[str] = None):
    query: dict = {"enabled": True}
    if placement:
        query["placement"] = placement
    cursor = db.ads.find(query)
    return [serialize(d) async for d in cursor]


@api.get("/admin/ads")
async def admin_list_ads(_: dict = Depends(require_admin)):
    return [serialize(d) async for d in db.ads.find()]


@api.post("/admin/ads")
async def create_ad(payload: AdIn, user: dict = Depends(require_admin)):
    doc = payload.model_dump()
    doc["created_at"] = now_utc()
    result = await db.ads.insert_one(doc)
    await audit(user, "ad.create", str(result.inserted_id))
    return serialize(await db.ads.find_one({"_id": result.inserted_id}))


@api.put("/admin/ads/{ad_id}")
async def update_ad(ad_id: str, payload: AdIn, user: dict = Depends(require_admin)):
    doc = payload.model_dump()
    result = await db.ads.update_one({"_id": ObjectId(ad_id)}, {"$set": doc})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Ad not found")
    await audit(user, "ad.update", ad_id)
    return serialize(await db.ads.find_one({"_id": ObjectId(ad_id)}))


@api.delete("/admin/ads/{ad_id}")
async def delete_ad(ad_id: str, user: dict = Depends(require_admin)):
    result = await db.ads.delete_one({"_id": ObjectId(ad_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Ad not found")
    await audit(user, "ad.delete", ad_id)
    return {"ok": True}


# ---------- Settings ----------
@api.get("/settings")
async def get_settings():
    doc = await db.settings.find_one({"_id": "site"})
    if not doc:
        return {}
    doc.pop("_id", None)
    return doc


@api.put("/admin/settings")
async def update_settings(payload: SettingsIn, user: dict = Depends(require_admin)):
    doc = {k: v for k, v in payload.model_dump().items() if v is not None}
    doc["updated_at"] = iso(now_utc())
    await db.settings.update_one({"_id": "site"}, {"$set": doc}, upsert=True)
    await audit(user, "settings.update", "site")
    return doc


# ---------- Admin overview ----------
@api.get("/admin/overview")
async def admin_overview(_: dict = Depends(require_admin)):
    tools_count = await db.tools.count_documents({})
    posts_count = await db.blog_posts.count_documents({})
    services_count = await db.services.count_documents({})
    contacts_count = await db.contact_requests.count_documents({})
    new_contacts = await db.contact_requests.count_documents({"status": "new"})
    pages_count = await db.pages.count_documents({})
    ads_count = await db.ads.count_documents({"enabled": True})

    top_tools_cursor = db.tools.find({}, {"name": 1, "slug": 1, "views": 1}).sort("views", -1).limit(5)
    top_tools = [serialize(d) async for d in top_tools_cursor]

    recent_contacts_cursor = db.contact_requests.find().sort("created_at", -1).limit(5)
    recent_contacts = [serialize(d) async for d in recent_contacts_cursor]

    recent_audit_cursor = db.audit_logs.find().sort("created_at", -1).limit(10)
    recent_audit = [serialize(d) async for d in recent_audit_cursor]

    return {
        "stats": {
            "tools": tools_count,
            "posts": posts_count,
            "services": services_count,
            "contacts": contacts_count,
            "new_contacts": new_contacts,
            "pages": pages_count,
            "ads": ads_count,
        },
        "top_tools": top_tools,
        "recent_contacts": recent_contacts,
        "audit": recent_audit,
    }


@api.get("/admin/audit")
async def list_audit(_: dict = Depends(require_admin)):
    cursor = db.audit_logs.find().sort("created_at", -1).limit(200)
    return [serialize(d) async for d in cursor]


# Mount router
app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # using bearer token auth + cookies (cross-origin)
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Seed ----------
async def seed():
    # Users
    existing = await db.users.find_one({"email": ADMIN_EMAIL})
    if existing is None:
        await db.users.insert_one({
            "email": ADMIN_EMAIL,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "name": "ToolForge Admin",
            "role": "super_admin",
            "created_at": now_utc(),
        })
        logger.info("Seeded admin user %s", ADMIN_EMAIL)
    else:
        if not verify_password(ADMIN_PASSWORD, existing["password_hash"]):
            await db.users.update_one(
                {"email": ADMIN_EMAIL},
                {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}},
            )
            logger.info("Updated admin password")

    # Categories
    categories = [
        {"slug": "developer", "name": "Developer", "icon": "Code2", "order": 1,
         "description": "Format, decode and inspect data fast."},
        {"slug": "text", "name": "Text", "icon": "Type", "order": 2,
         "description": "Manipulate, count, compare and generate text."},
        {"slug": "creative", "name": "Creative", "icon": "Sparkles", "order": 3,
         "description": "Visual and creative utilities."},
        {"slug": "marketing", "name": "Marketing", "icon": "Megaphone", "order": 4,
         "description": "Tags, UTMs, SEO essentials."},
        {"slug": "business", "name": "Business", "icon": "Briefcase", "order": 5,
         "description": "Calculators and finance helpers."},
    ]
    for c in categories:
        await db.tool_categories.update_one(
            {"slug": c["slug"]}, {"$set": c}, upsert=True
        )

    # Tools
    tools = [
        # developer
        {"slug": "json-formatter", "name": "JSON Formatter & Validator", "category": "developer",
         "description": "Beautify, minify and validate JSON instantly in your browser.",
         "icon": "Braces", "featured": True, "trending": True, "order": 1,
         "seo_title": "JSON Formatter & Validator — ToolForge",
         "seo_description": "Format, validate, and minify JSON instantly. Fast, free, secure — processed in your browser."},
        {"slug": "html-beautifier", "name": "HTML Beautifier", "category": "developer",
         "description": "Beautify and tidy your HTML markup with one click.",
         "icon": "FileCode2", "trending": True, "order": 2},
        {"slug": "css-beautifier", "name": "CSS Beautifier", "category": "developer",
         "description": "Format, indent and clean up CSS.", "icon": "Palette", "order": 3},
        {"slug": "js-beautifier", "name": "JavaScript Beautifier", "category": "developer",
         "description": "Format JavaScript code with consistent indentation.",
         "icon": "Code", "featured": True, "order": 4},
        {"slug": "sql-formatter", "name": "SQL Formatter", "category": "developer",
         "description": "Pretty-print SQL queries across PostgreSQL, MySQL and more.",
         "icon": "Database", "order": 5},
        {"slug": "base64", "name": "Base64 Encode / Decode", "category": "developer",
         "description": "Convert text to Base64 and back, instantly.",
         "icon": "Binary", "featured": True, "trending": True, "order": 6},
        {"slug": "url-encode", "name": "URL Encode / Decode", "category": "developer",
         "description": "Percent-encode and decode URLs safely.",
         "icon": "Link2", "order": 7},
        {"slug": "jwt-decoder", "name": "JWT Decoder", "category": "developer",
         "description": "Inspect JWT header and payload without sharing your token.",
         "icon": "KeyRound", "featured": True, "order": 8},
        {"slug": "regex-tester", "name": "Regex Tester", "category": "developer",
         "description": "Test regular expressions live with highlighted matches.",
         "icon": "Search", "order": 9},
        {"slug": "json-to-typescript", "name": "JSON to TypeScript", "category": "developer",
         "description": "Generate TypeScript interfaces from any JSON payload.",
         "icon": "Brackets", "order": 10},

        # text
        {"slug": "case-converter", "name": "Case Converter", "category": "text",
         "description": "UPPER, lower, Title, camelCase, snake_case and more.",
         "icon": "CaseSensitive", "featured": True, "order": 1},
        {"slug": "text-counter", "name": "Word & Character Counter", "category": "text",
         "description": "Count words, characters, sentences and reading time.",
         "icon": "Hash", "trending": True, "order": 2},
        {"slug": "duplicate-line-remover", "name": "Duplicate Line Remover", "category": "text",
         "description": "Strip duplicate lines, sort and deduplicate.",
         "icon": "Filter", "order": 3},
        {"slug": "text-compare", "name": "Text Compare (Diff)", "category": "text",
         "description": "Compare two blocks of text and see the diff.",
         "icon": "GitCompare", "order": 4},
        {"slug": "slug-generator", "name": "Slug Generator", "category": "text",
         "description": "Generate SEO-friendly slugs from any title.",
         "icon": "Link", "order": 5},
        {"slug": "password-generator", "name": "Password Generator", "category": "text",
         "description": "Generate strong, customizable passwords offline.",
         "icon": "Lock", "featured": True, "trending": True, "order": 6},
        {"slug": "uuid-generator", "name": "UUID Generator", "category": "text",
         "description": "Generate RFC4122 UUID v4 identifiers in bulk.",
         "icon": "Fingerprint", "order": 7},

        # creative
        {"slug": "qr-code-generator", "name": "QR Code Generator", "category": "creative",
         "description": "Generate beautiful QR codes for links, text and more.",
         "icon": "QrCode", "featured": True, "trending": True, "order": 1},

        # marketing
        {"slug": "meta-tag-generator", "name": "Meta Tag Generator", "category": "marketing",
         "description": "Compose SEO and Open Graph meta tags in seconds.",
         "icon": "Tags", "featured": True, "order": 1},
        {"slug": "utm-builder", "name": "UTM Builder", "category": "marketing",
         "description": "Build trackable campaign URLs with UTM parameters.",
         "icon": "BarChart3", "order": 2},
        {"slug": "robots-txt-generator", "name": "Robots.txt Generator", "category": "marketing",
         "description": "Create a robots.txt file with sensible defaults.",
         "icon": "Bot", "order": 3},

        # business
        {"slug": "gst-calculator", "name": "GST Calculator", "category": "business",
         "description": "Calculate GST inclusive and exclusive amounts.",
         "icon": "Percent", "featured": True, "order": 1},
        {"slug": "emi-calculator", "name": "EMI Calculator", "category": "business",
         "description": "Plan your loan EMIs with principal, rate and tenure.",
         "icon": "Calculator", "trending": True, "order": 2},
        {"slug": "percentage-calculator", "name": "Percentage Calculator", "category": "business",
         "description": "Run percentage, increase and decrease calculations.",
         "icon": "Divide", "order": 3},
        {"slug": "profit-calculator", "name": "Profit Margin Calculator", "category": "business",
         "description": "Compute profit, margin and markup easily.",
         "icon": "TrendingUp", "order": 4},
    ]

    for idx, t in enumerate(tools):
        defaults = {"enabled": True, "views": 0, "created_at": now_utc(), "updated_at": now_utc(),
                    "featured": False, "trending": False}
        merged = {**defaults, **t}
        await db.tools.update_one(
            {"slug": t["slug"]}, {"$setOnInsert": merged}, upsert=True
        )

    # Blog categories
    cats = [
        {"slug": "guides", "name": "Guides", "description": "Step-by-step walkthroughs."},
        {"slug": "engineering", "name": "Engineering", "description": "Behind the build."},
        {"slug": "product", "name": "Product", "description": "Updates from the team."},
    ]
    for c in cats:
        await db.blog_categories.update_one({"slug": c["slug"]}, {"$set": c}, upsert=True)

    # Blog posts
    posts = [
        {
            "slug": "json-best-practices",
            "title": "10 JSON Best Practices Every Developer Should Know",
            "excerpt": "From key naming to large payload handling — practical JSON rules that scale.",
            "content": "## Keep keys consistent\nUse a single convention (camelCase or snake_case) across your codebase.\n\n## Validate early\nValidate JSON at the boundary of your system using JSON Schema or zod.\n\n## Avoid deep nesting\nFlatten where it makes sense for performance and readability.\n\n## Use IDs, not embedded duplicates\nIn larger payloads, reference IDs and let consumers fetch details.\n\n## Stream large payloads\nFor anything > 5MB consider NDJSON / streaming parsing.\n\n## Watch out for floats\nUse strings for monetary values to avoid precision loss.\n\n## Compress at the edge\nGzip or Brotli + ETag headers dramatically reduce wire size.\n\n## Version your contracts\nAdd a `version` field, or version your URL path.\n\n## Never embed secrets\nNo tokens in JSON cached at CDNs.\n\n## Format & validate continuously\nUse the ToolForge JSON Formatter to spot issues fast.",
            "category": "guides",
            "tags": ["json", "developer", "best-practices"],
            "cover_image": "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80",
            "status": "published",
        },
        {
            "slug": "what-makes-a-great-utility-tool",
            "title": "What Makes a Great Online Utility Tool?",
            "excerpt": "Speed, privacy, trust and clarity. A short philosophy behind ToolForge.",
            "content": "Online utility tools used to be cluttered, slow and full of intrusive elements.\n\nWe built ToolForge to fix that with three principles:\n\n**Privacy-first** — everything that can run in your browser, runs in your browser.\n\n**Speed** — fast first paint, no heavy frameworks per tool, lazy loaded experiences.\n\n**Trust** — clear examples, FAQs, and never misleading output.",
            "category": "product",
            "tags": ["product", "trust"],
            "cover_image": "https://images.pexels.com/photos/7130473/pexels-photo-7130473.jpeg?w=1200",
            "status": "published",
        },
        {
            "slug": "regex-101-cheatsheet",
            "title": "Regex 101: A Practical Cheatsheet",
            "excerpt": "The 80% of regular expressions you actually use — with copy-pasteable examples.",
            "content": "Regex looks scary, but 80% of real-world cases use a small set of patterns.\n\n- `\\d` — any digit\n- `\\w` — word character\n- `\\s` — whitespace\n- `^` / `$` — string anchors\n- `+` / `*` / `?` — repetition\n- `()` — capture group\n\nTry it live in our Regex Tester.",
            "category": "engineering",
            "tags": ["regex", "developer"],
            "cover_image": "https://images.pexels.com/photos/1128207/pexels-photo-1128207.jpeg?w=1200",
            "status": "published",
        },
    ]
    for p in posts:
        existing = await db.blog_posts.find_one({"slug": p["slug"]})
        if existing is None:
            doc = {**p, "author": ADMIN_EMAIL, "created_at": now_utc(),
                   "updated_at": now_utc(), "published_at": now_utc(), "views": 0}
            await db.blog_posts.insert_one(doc)

    # Services
    services = [
        {
            "slug": "website-development",
            "name": "Website Development",
            "tagline": "Production-grade websites engineered for performance and conversion.",
            "description": "We design and ship modern marketing sites, web apps and dashboards. Pixel-perfect, fast, and built to grow with you.",
            "starting_price": "$1,499",
            "icon": "Globe",
            "benefits": [
                "Modern, mobile-first design",
                "Built-in SEO and analytics",
                "Performance budget under 200KB JS",
                "CMS for editing without code",
            ],
            "process": [
                {"step": "01", "title": "Discovery", "description": "We map your goals, audience and conversion paths."},
                {"step": "02", "title": "Design", "description": "Premium, brand-aligned interface in light & dark."},
                {"step": "03", "title": "Build", "description": "Clean, typed, tested code with CI/CD."},
                {"step": "04", "title": "Launch", "description": "Deploy with monitoring, analytics & docs."},
            ],
            "faqs": [
                {"q": "How long does a typical project take?", "a": "Most marketing sites ship in 3–5 weeks."},
                {"q": "Do you handle hosting?", "a": "Yes — we provide deployment and ongoing support plans."},
            ],
            "featured": True,
            "order": 1,
            "enabled": True,
        },
        {
            "slug": "landing-page-development",
            "name": "Landing Page Development",
            "tagline": "High-converting landing pages tuned for paid traffic.",
            "description": "Need a launch or campaign page that converts? We craft fast, accessible landers with built-in A/B test scaffolding.",
            "starting_price": "$599",
            "icon": "LayoutTemplate",
            "benefits": ["Conversion-focused copy framework", "Above-the-fold under 1s LCP", "Form & lead capture integration"],
            "process": [
                {"step": "01", "title": "Goal & offer", "description": "Define the conversion goal and the offer."},
                {"step": "02", "title": "Hero & CTA", "description": "Sharpen the headline, hero and CTA."},
                {"step": "03", "title": "Ship", "description": "Launch with tracking and A/B variants."},
            ],
            "faqs": [
                {"q": "Will you write the copy?", "a": "Yes, included in the package or we can refine yours."},
            ],
            "featured": True,
            "order": 2,
            "enabled": True,
        },
        {
            "slug": "email-template-development",
            "name": "Email Template Development",
            "tagline": "Responsive, deliverable HTML email templates.",
            "description": "Email tested across major clients with proper fallback, accessibility and dark-mode support.",
            "starting_price": "$249",
            "icon": "Mail",
            "benefits": ["Tested on Gmail, Outlook, Apple Mail", "Dark-mode variants", "Editable in your ESP"],
            "process": [
                {"step": "01", "title": "Design", "description": "Mockup in your brand."},
                {"step": "02", "title": "Build", "description": "Hand-coded MJML / HTML."},
                {"step": "03", "title": "Test", "description": "Render across 30+ clients."},
            ],
            "faqs": [{"q": "Which ESPs do you support?", "a": "Mailchimp, Brevo, HubSpot, Klaviyo, Customer.io, Mailgun and more."}],
            "order": 3,
            "enabled": True,
        },
        {
            "slug": "logo-creation",
            "name": "Logo Creation",
            "tagline": "Distinctive marks crafted for modern brands.",
            "description": "Original, hand-crafted logos delivered in every format you need.",
            "starting_price": "$349",
            "icon": "PenTool",
            "benefits": ["3 concepts", "Unlimited tweaks", "Full file pack (SVG, PNG, PDF)"],
            "process": [
                {"step": "01", "title": "Brief", "description": "Understand brand and audience."},
                {"step": "02", "title": "Concepts", "description": "Explore 3 directions."},
                {"step": "03", "title": "Refine", "description": "Iterate to a final mark."},
            ],
            "faqs": [{"q": "Do you provide brand guidelines?", "a": "Yes, a short PDF guide is included."}],
            "order": 4,
            "enabled": True,
        },
        {
            "slug": "sticker-creation",
            "name": "Sticker Creation",
            "tagline": "Eye-catching stickers and pack design.",
            "description": "Vector stickers for Telegram, WhatsApp, merchandise and product packs.",
            "starting_price": "$149",
            "icon": "Sticker",
            "benefits": ["Vector + raster delivery", "Telegram / WhatsApp ready", "Print-ready CMYK files"],
            "process": [
                {"step": "01", "title": "Theme", "description": "Define style and theme."},
                {"step": "02", "title": "Sketch", "description": "Initial drafts."},
                {"step": "03", "title": "Final", "description": "Polish and export."},
            ],
            "faqs": [{"q": "Can I get rush delivery?", "a": "Yes — 48-hour rush is available for a 30% surcharge."}],
            "order": 5,
            "enabled": True,
        },
        {
            "slug": "photo-restoration",
            "name": "Photo Restoration",
            "tagline": "Bring damaged or faded photos back to life.",
            "description": "Hand-restored memories — tears, scratches and color shifts repaired carefully.",
            "starting_price": "$59 per photo",
            "icon": "ImageIcon",
            "benefits": ["High-resolution scan input", "Hand-corrected color", "Print-ready output"],
            "process": [
                {"step": "01", "title": "Upload", "description": "Send us a scan."},
                {"step": "02", "title": "Restore", "description": "Repair scratches, fading and color."},
                {"step": "03", "title": "Deliver", "description": "Final hi-res image."},
            ],
            "faqs": [{"q": "Is there a quality limit?", "a": "We work with anything from low-res scans to studio film negatives."}],
            "order": 6,
            "enabled": True,
        },
        {
            "slug": "email-signature-design",
            "name": "Email Signature Design",
            "tagline": "Polished signatures for your whole team.",
            "description": "Beautiful, brand-aligned HTML email signatures that render perfectly everywhere.",
            "starting_price": "$99",
            "icon": "Signature",
            "benefits": ["Mobile + dark mode tested", "Team rollout files", "Editable per user"],
            "process": [
                {"step": "01", "title": "Design", "description": "Brand-aligned signature."},
                {"step": "02", "title": "Build", "description": "Hand-coded HTML."},
                {"step": "03", "title": "Roll out", "description": "Per-user files & docs."},
            ],
            "faqs": [{"q": "Do you support Outlook?", "a": "Yes — Outlook 2016+ on Windows and Mac."}],
            "order": 7,
            "enabled": True,
        },
    ]
    for s in services:
        existing = await db.services.find_one({"slug": s["slug"]})
        if existing is None:
            s.setdefault("created_at", now_utc())
            s.setdefault("updated_at", now_utc())
            await db.services.insert_one(s)

    # Pages (legal + about)
    pages = [
        {"slug": "privacy", "title": "Privacy Policy",
         "content": "ToolForge respects your privacy. Most of our tools process data **directly in your browser** and never reach our servers.\n\n## What we collect\nWe collect minimal analytics on page views and feature usage. We do not sell personal data.\n\n## Cookies\nWe use cookies only for essential session management and analytics.\n\n## Contact\nQuestions? Use the Contact page.",
         "status": "published"},
        {"slug": "terms", "title": "Terms of Service",
         "content": "By using ToolForge you agree to the following Terms.\n\n## Use of service\nYou agree to use the platform lawfully.\n\n## No warranty\nTools are provided as-is. Always verify critical outputs.\n\n## Service availability\nWe aim for high availability but do not guarantee uninterrupted access.",
         "status": "published"},
        {"slug": "disclaimer", "title": "Disclaimer",
         "content": "Information and tools on ToolForge are provided for general purposes.\n\nWhile we strive for accuracy, you remain responsible for verifying any output you rely on for production or financial decisions.",
         "status": "published"},
        {"slug": "cookies", "title": "Cookie Policy",
         "content": "ToolForge uses cookies for essential session management, preferences and analytics.\n\nYou can disable non-essential cookies in your browser without losing core functionality.",
         "status": "published"},
        {"slug": "about", "title": "About ToolForge",
         "content": "ToolForge is a modern platform for everyday work: developer utilities, text helpers, creative tools, marketing essentials, and business calculators — all in one place.\n\nWe build with three principles: **privacy-first**, **fast by default**, and **honest output**. No tracking-heavy popups, no misleading results, and no junk.",
         "status": "published"},
    ]
    for p in pages:
        existing = await db.pages.find_one({"slug": p["slug"]})
        if existing is None:
            doc = {**p, "sections": [], "created_at": now_utc(),
                   "updated_at": now_utc(), "published_at": now_utc()}
            await db.pages.insert_one(doc)

    # Site settings defaults
    existing_settings = await db.settings.find_one({"_id": "site"})
    if existing_settings is None:
        await db.settings.insert_one({
            "_id": "site",
            "site_name": "ToolForge",
            "tagline": "Modern tools for builders, teams and creators.",
            "contact_email": "hello@toolforge.io",
            "contact_phone": "+1 (555) 010-0420",
            "seo_default_title": "ToolForge — Modern Tools for Builders",
            "seo_default_description": "Fast, private, premium utility, developer, text, marketing and business tools — and bespoke services to ship faster.",
            "footer_text": "© ToolForge. Crafted for builders.",
            "social": {"twitter": "https://twitter.com", "github": "https://github.com", "linkedin": "https://linkedin.com"},
        })

    # Indexes
    await db.users.create_index("email", unique=True)
    await db.tools.create_index("slug", unique=True)
    await db.blog_posts.create_index("slug", unique=True)
    await db.services.create_index("slug", unique=True)
    await db.pages.create_index("slug", unique=True)
    await db.contact_requests.create_index("created_at")
    await db.audit_logs.create_index("created_at")


@app.on_event("startup")
async def on_startup():
    try:
        await seed()
        logger.info("Seed completed")
    except Exception as e:
        logger.exception("Seed error: %s", e)


@app.on_event("shutdown")
async def on_shutdown():
    client.close()

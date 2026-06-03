# Deploying ToolForge for free

This guide deploys ToolForge to **GitHub + Vercel (frontend) + Render (backend) + MongoDB Atlas (database)**. Total cost: **$0/month**. Setup time: ~15 min.

You'll need three free accounts (no credit card required):

1. [github.com](https://github.com) — code hosting
2. [vercel.com](https://vercel.com) — React frontend host
3. [render.com](https://render.com) — FastAPI backend host
4. [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register) — MongoDB database

---

## 1. Create the database (MongoDB Atlas) — 5 min

1. Sign up at https://www.mongodb.com/cloud/atlas/register
2. Create a **Free M0 cluster** in the region closest to you (e.g. Mumbai or Singapore)
3. **Database Access** → Add a new database user `toolforge` with a strong password — save it
4. **Network Access** → Add IP → `0.0.0.0/0` (required so Render can connect)
5. **Connect → Drivers** → copy the connection string. It looks like:

   ```
   mongodb+srv://toolforge:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

   Replace `<password>` with the password you just created. This whole string is your `MONGO_URL`.

## 2. Push the code to GitHub — 1 min

From inside the Emergent editor, click **"Save to GitHub"** and create a new repo (e.g. `toolforge`).

## 3. Deploy the backend (Render) — 5 min

1. Go to https://render.com → **Sign in with GitHub**
2. **New +** → **Blueprint** → pick the `toolforge` repo
3. Render reads `render.yaml` and proposes a service named **`toolforge-api`**. Confirm.
4. Render asks you for the values of the variables marked `sync: false`. Fill them in:

   | Key | Example value |
   |---|---|
   | `MONGO_URL` | *(your Atlas string from Step 1)* |
   | `JWT_SECRET` | *(generate a new random 64-char hex string)* |
   | `ADMIN_EMAIL` | `admin@toolforge.io` (or your email) |
   | `ADMIN_PASSWORD` | a strong password — this is your admin login |
   | `SMTP_USER` | `nilankar.praveen@gmail.com` |
   | `SMTP_PASS` | your 16-char Gmail App Password (no spaces) |
   | `NOTIFY_EMAIL` | `nilankar.praveen@gmail.com` |
   | `FRONTEND_URL` | leave blank for now — you'll add it after Step 4 |

   To generate a JWT secret, run this anywhere:

   ```bash
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

5. Click **Apply** / **Create**. Render builds and deploys (~3–5 min).
6. When done, you'll see your backend URL — something like:

   ```
   https://toolforge-api.onrender.com
   ```

7. Verify it works by opening:

   ```
   https://toolforge-api.onrender.com/api/health
   ```

   You should see `{"status":"ok","db":"ok"}`.

## 4. Deploy the frontend (Vercel) — 3 min

1. Go to https://vercel.com → **Add New Project** → pick the `toolforge` repo
2. Settings:

   | Field | Value |
   |---|---|
   | Framework Preset | Create React App |
   | Root Directory | `frontend` |
   | Build Command | `yarn build` |
   | Output Directory | `build` |

3. **Environment Variables** → add:

   | Key | Value |
   |---|---|
   | `REACT_APP_BACKEND_URL` | your Render URL from Step 3 (e.g. `https://toolforge-api.onrender.com`) |

4. Click **Deploy** → you get something like `https://toolforge.vercel.app`

## 5. Wire frontend → backend — 1 min

Open Render → your service → **Environment** → set:

| Key | Value |
|---|---|
| `FRONTEND_URL` | your Vercel URL (e.g. `https://toolforge.vercel.app`) |

Render auto-redeploys.

## 6. Verify everything works

1. Open `https://toolforge.vercel.app`
2. Try a tool (e.g. JSON Formatter) — should work instantly
3. Submit the Contact form with valid name/email/phone/message → you should receive an email at `nilankar.praveen@gmail.com`
4. Go to `/login` → log in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in Step 3
5. `/admin/contacts` shows the test lead

---

## Free-plan caveats

| Issue | What it means | Fix (optional) |
|---|---|---|
| **Render free sleeps after 15 min idle** | First request takes ~30 s to wake | Set up a free https://uptimerobot.com monitor to ping `/api/health` every 5 min |
| **Custom domain** | Both Vercel and Render free tiers support custom domains via CNAME | Buy a domain at [Porkbun](https://porkbun.com) (~$8/yr) and follow Vercel's *Domains* tab |
| **Gmail SMTP cap** | ~500 emails/day from a free Gmail | Move to https://resend.com (3 000/mo free) later if you exceed |
| **MongoDB Atlas M0** | 512 MB shared storage | Plenty for ~100k leads. Upgrade if you ever need more |

---

## Rotating the Gmail App Password

The current app password may be visible in chat history. To rotate it:

1. Go to https://myaccount.google.com/apppasswords
2. **Delete** the current ToolForge app password
3. **Create a new one** labelled "ToolForge"
4. Update `SMTP_PASS` in Render → service auto-redeploys

---

## Files that make this work

- **`/render.yaml`** — Render Blueprint, pre-fills the form
- **`/backend/runtime.txt`** — pins Python 3.11.9
- **`/frontend/vercel.json`** — SPA rewrites so React Router routes survive page reloads
- **`/backend/.env`** and **`/frontend/.env`** are gitignored — secrets stay out of the repo

---

Need help? Open an issue or message me in the Emergent chat.

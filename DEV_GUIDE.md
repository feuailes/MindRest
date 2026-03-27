# MindRest 2.0 — Developer Guide

> **This is a living document.** It is updated whenever the project structure, APIs, or setup steps change.
> **Last updated:** 2026-03-08

---

## 📁 Project Structure

```
mindrest2.0/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── pages/          # All page components
│   │   ├── components/     # Shared components (Header, Footer, etc.)
│   │   ├── services/       # API service functions
│   │   ├── App.jsx         # Router + Layout
│   │   └── index.css       # Global styles + Tailwind
│   ├── .env                # VITE_API_BASE_URL
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                # Laravel 11 backend (API only)
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── AssessmentController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── JournalController.php
│   │   │   └── ExerciseController.php
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Assessment.php
│   │       ├── JournalEntry.php
│   │       └── MoodLog.php
│   ├── database/
│   │   ├── migrations/     # All DB schema migrations
│   │   └── database.sqlite # SQLite file (created by SETUP.bat)
│   ├── routes/
│   │   └── api.php         # All API endpoints
│   ├── config/cors.php     # CORS for React dev server
│   └── .env                # Laravel environment config
│
├── raw/                    # Original HTML design files (reference only)
│   ├── 1.html — Home page
│   ├── 2.html — Journal page
│   ├── 3.html — Dashboard page
│   ├── 4.html — Games page
│   └── 5.html — Exercises page
│
├── SETUP.bat               # ⚡ First-time setup (run ONCE)
└── START_DEV.bat           # 🚀 Start both dev servers
```

---

## 🚀 Quick Start

### Prerequisites
| Tool | Version | Download |
|------|---------|----------|
| PHP  | 8.2+    | [windows.php.net](https://windows.php.net/download/) |
| Composer | Latest | [getcomposer.org](https://getcomposer.org/) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |

### First-Time Setup (Run ONCE)
```bat
SETUP.bat
```
This will:
1. Install Laravel Composer dependencies
2. Generate app key (`php artisan key:generate`)
3. Create the SQLite database file
4. Run all migrations
5. Install React npm packages

### Daily Development
```bat
START_DEV.bat
```
Opens two terminal windows:
- **Laravel backend** → `http://localhost:8000`
- **React frontend** → `http://localhost:5173`

---

## 🔌 API Reference

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/register` | ❌ | Register new user |
| POST | `/api/login` | ❌ | Login, returns token |
| POST | `/api/logout` | ✅ | Invalidate token |
| GET  | `/api/user` | ✅ | Get current user |

**Register / Login response:**
```json
{
  "user": { "id": 1, "name": "Alex", "email": "alex@test.com" },
  "token": "1|abc123..."
}
```

Token is stored in `localStorage` as `mindrest_token` and sent as `Authorization: Bearer <token>`.

---

### Assessment
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/assessment` | ✅ | Submit assessment |
| GET  | `/api/assessment` | ✅ | Get history (last 10) |

**POST body:**
```json
{
  "sleep_hours": 7,
  "stress_level": 5,
  "screen_time": 4,
  "mood": "calm"
}
```
**Response includes** `risk_level` (1=Low, 2=Moderate, 3=High) and `risk_label`.

---

### Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard` | ✅ | All dashboard data |

**Response:**
```json
{
  "user": {...},
  "streak": 5,
  "mood_score": 7.4,
  "journal_count": 12,
  "mood_trend": [{ "date": "2026-03-07", "score": 8 }, ...],
  "recent_journals": [...],
  "latest_assessment": {...}
}
```

---

### Journal
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/journal` | ✅ | List entries (paginated) |
| POST | `/api/journal` | ✅ | Create entry |
| DELETE | `/api/journal/{id}` | ✅ | Delete entry |

**POST body:**
```json
{
  "title": "Evening Reflection",
  "content": "Had a great day...",
  "mood_emoji": "😊"
}
```

---

### Exercises
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/exercises` | ❌ | Get all exercises (static) |

---

## 🗄️ Database Schema (SQLite)

```
users               assessments         journal_entries
─────────────       ───────────────     ───────────────
id                  id                  id
name                user_id (FK)        user_id (FK)
email               sleep_hours         title
password            stress_level        content
timestamps          screen_time         mood_emoji
                    mood                timestamps
                    risk_level
                    timestamps

mood_logs           personal_access_tokens
─────────           ──────────────────────
id                  (Sanctum — auto)
user_id (FK)
mood_score
date
timestamps
```

---

## 📂 Pages & Routes

| URL | Component | Description |
|-----|-----------|-------------|
| `/` | `Home.jsx` | Landing page (from raw/1.html) |
| `/login` | `Loginpage.jsx` | Login / Register |
| `/assessment` | `Form.jsx` | Mental health assessment form |
| `/result` | `Predictionpage.jsx` | Assessment result |
| `/dashboard` | `Dashboard.jsx` | User dashboard (from raw/3.html) |
| `/journal` | `Journal.jsx` | Journal (from raw/2.html) |
| `/exercises` | `MindfulExercises.jsx` | Exercises (from raw/5.html) |
| `/games` | `Games.jsx` | Games (from raw/4.html) |
| `/reset` | `DailyReset.jsx` | Daily reset / breathing |
| `/about` | `About.jsx` | About page |

---

## 🎨 Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#1D4D4F` | Dark teal — main brand color |
| Accent Orange | `#E76F51` | CTA buttons, highlights |
| Soft Mint | `#B2E2D2` | Badges, backgrounds |
| Background Light | `#F8FBFB` | Page background |

Font: **Inter / Plus Jakarta Sans** (Google Fonts)

---

## 🛠️ Useful Laravel Commands

```bash
# Run from backend/ directory
php artisan serve              # Start API server
php artisan migrate            # Run migrations
php artisan migrate:fresh      # Reset and re-migrate (⚠️ deletes all data)
php artisan migrate:status     # Check migration status
php artisan route:list         # List all routes
php artisan tinker             # Interactive REPL
```

---

## 🔧 Adding New Features

### Adding a new API endpoint:
1. Create controller in `backend/app/Http/Controllers/`
2. Add route in `backend/routes/api.php`
3. Create migration if DB table needed: `php artisan make:migration`
4. Create service in `frontend/src/services/`
5. **Update this guide** with new endpoint docs

### Adding a new frontend page:
1. Create `frontend/src/pages/PageName.jsx`
2. Add route in `frontend/src/App.jsx`
3. **Update this guide** with new route entry

---

## ⚠️ Troubleshooting

| Issue | Fix |
|-------|-----|
| `CORS error` in browser | Check `backend/config/cors.php` has `localhost:5173` |
| `401 Unauthorized` | Token expired — log in again |
| `sqlite` not found | Enable `extension=pdo_sqlite` in `php.ini` |
| Blank page on frontend | Check browser console for errors; run `npm run dev` |
| Port 8000 already in use | `php artisan serve --port=8001` and update frontend `.env` |

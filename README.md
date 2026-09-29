# SmartPerfume

**The Art of Fine Fragrance**

SmartPerfume is a personalized fragrance recommendation and e-commerce web application. It combines perfumery expertise with a user's personal preferences to recommend a bespoke fragrance. Users can take a scent discovery quiz, receive a personalized recommendation, browse a curated collection of fragrances, and purchase them through a shopping cart system. The platform also features an admin panel for catalog management and a journal section exploring the world of fragrance.

---

## Simplified Explanation

SmartPerfume is a website where users answer a short quiz about their scent preferences (favorite scent family, mood, occasion, and intensity) and receive a perfume tailored to them. After receiving their recommendation, users can browse other fragrances in the collection, add them to a shopping cart, and manage their orders. There is also an admin panel for managing the fragrance catalog and a journal with articles about the science and art of perfumery.

Think of it as a **personalized perfume shop** — you tell us what you like, we suggest what to wear, and you can buy it right there.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Pages and Routes](#pages-and-routes)
- [Database Schema](#database-schema)
- [Environment Notes](#environment-notes)

---

## Features

### For Users
- **Scent Discovery Quiz** — A 4-question interactive questionnaire covering scent family, mood, setting, and sillage intensity.
- **Fragrance Recommendation** — Personalized perfume suggestion based on quiz answers.
- **Fragrance Collection** — Browse 5 curated fragrances with details on ingredients, notes, ratings, and prices.
- **Shopping Cart** — Add/remove fragrances, adjust quantities, view totals, and clear the cart.
- **User Authentication** — Register and log in with email and password (JWT-based).
- **Guest Mode** — Continue without signing in to explore the platform.
- **Account Dashboard** — View profile status, scent profile milestones, and quick navigation.
- **Scent Journal** — Read articles about fragrance science, perfumery, sustainability, and more.
- **About Page** — Learn about the company mission, vision, and team.

### For Admins
- **Admin Catalog Panel** — Manage fragrances with search, edit, and delete functionality.
- **Dashboard Metrics** — View total fragrances, blends, active regions, and system status.

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI library |
| React Router | 7.18 | Client-side routing |
| Vite | 5.4 | Build tool and dev server |
| Tailwind CSS | 3.4 | Utility-first CSS framework |
| ESLint | 9.8 | Code linting |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.x | Runtime |
| Flask | 3.0.2 | Web framework |
| Flask-CORS | 5.0.0 | Cross-origin resource sharing |
| PyJWT | 2.9.0 | JSON Web Token authentication |
| Werkzeug | (bundled) | Password hashing |
| SQLite | (stdlib `sqlite3`) | Persistent database storage |

### Styling
- Custom Material Design 3-inspired dark theme
- Glassmorphism effects (`glass-card`, `glass-panel` CSS classes)
- Google Material Symbols for icons
- Bodoni Moda + DM Sans typography

---

## Project Structure

```
smartperfumeai/
├── backend/
│   ├── app.py                  # Flask REST API server
│   ├── db.py                   # SQLite schema, seed data, and queries
│   ├── migrate.py              # v1 -> v2 schema migration (idempotent)
│   ├── requirements.txt        # Python dependencies
│   └── smartperfume.db         # SQLite database (created on first run)
│
└── frontend/
    ├── index.html
    ├── package.json            # Node.js dependencies
    ├── vite.config.js          # Vite config with API proxy
    ├── tailwind.config.js      # Tailwind custom theme
    ├── postcss.config.js
    └── src/
        ├── main.jsx            # Entry point
        ├── App.jsx             # Route definitions
        ├── index.css           # Global styles + glass effects
        ├── context/
        │   ├── AuthContext.jsx     # Authentication state
        │   ├── CartContext.jsx     # Shopping cart state
        │   └── SurveyContext.jsx   # Quiz completion state
        ├── data/
        │   ├── fragrances.js       # Local catalog + storage helpers
        │   └── quizRules.js        # Client-side recommendation engine
        └── components/
            ├── Layout.jsx          # Shared nav + footer
            ├── Login.jsx           # Login/Register page
            ├── HomePage.jsx        # Landing page
            ├── Quiz.jsx            # Scent discovery quiz
            ├── Recommendation.jsx  # Recommendation display
            ├── Collection.jsx      # Fragrance catalog
            ├── Cart.jsx            # Shopping cart
            ├── Account.jsx         # User dashboard
            ├── Journal.jsx         # Blog articles
            ├── About.jsx           # Company info
            └── AdminCatalog.jsx    # Admin panel
```

---

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Python** (v3.8 or higher) — [Download](https://www.python.org/)
- **pip** (comes with Python)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ahmad8878kirata-hue/smartperfumeai.git
cd smartperfumeai
```

### 2. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This installs:
- `flask` — The web framework
- `flask-cors` — Enables CORS for frontend-backend communication
- `pyjwt` — Handles JWT token generation and verification

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

This installs:
- `react` and `react-dom` — UI library
- `react-router-dom` — Client-side routing
- `vite` and `@vitejs/plugin-react` — Build tooling
- `tailwindcss`, `autoprefixer`, `postcss` — CSS framework
- `eslint` and plugins — Code linting

---

## Running the Project

The application requires **two terminals** — one for the backend and one for the frontend.

### Terminal 1: Start the Backend (Flask API)

```bash
cd backend

# If you have a database created before schema v2, migrate it first:
python migrate.py

python app.py
```

The Flask server starts on **http://localhost:5000**.

You should see output like:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### Configuring the admin account

Admin is a real row in the `users` table with `role = 'admin'`. It is provisioned
from environment variables on every startup — there is no hardcoded default.

```bash
# PowerShell
$env:SMARTPERFUME_ADMIN_EMAIL    = "boss@example.com"
$env:SMARTPERFUME_ADMIN_PASSWORD = "choose-a-strong-password"

# macOS / Linux
export SMARTPERFUME_ADMIN_EMAIL="boss@example.com"
export SMARTPERFUME_ADMIN_PASSWORD="choose-a-strong-password"
```

If either variable is unset the server still starts, but admin login is disabled
and a warning is printed. Setting the variables again re-provisions (rotates) the
admin password.

| Variable | Purpose | Default |
|---|---|---|
| `SMARTPERFUME_SECRET_KEY` | JWT signing key | insecure dev fallback |
| `SMARTPERFUME_ADMIN_EMAIL` | Email of the provisioned admin | none |
| `SMARTPERFUME_ADMIN_PASSWORD` | Password for that admin | none |
| `SMARTPERFUME_DB` | Path to the SQLite file | `smartperfume.db` |

### Terminal 2: Start the Frontend (React + Vite)

```bash
cd frontend
npm run dev
```

The Vite dev server starts on **http://localhost:5173**.

You should see output like:
```
  VITE v5.4.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

The Vite dev server automatically proxies all `/api` requests to the Flask backend at `http://localhost:5000`, so everything works seamlessly.

---

## API Endpoints

### Public Endpoints (No Authentication Required)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check — returns `{"status": "ok", "schema_version": 2}` |
| `POST` | `/api/register` | Register a new user (email + password) |
| `POST` | `/api/login` | Log in and receive a JWT token |
| `GET` | `/api/fragrances` | List all fragrances (supports `?search=`) |
| `POST` | `/api/quiz/submit` | Submit quiz answers, returns recommendation |
| `POST` | `/api/admin/login` | Admin login (requires an account with `role = admin`) |

### Admin Endpoints (JWT with `role: "admin"` required)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/carts` | Every user's cart, ordered by email |
| `POST` | `/api/fragrances` | Add a new fragrance to the catalog |
| `PATCH` | `/api/fragrances/<id>` | Update name, brand, price, notes, rating, image, ingredients |
| `DELETE` | `/api/fragrances/<id>` | Delete a fragrance (cascades to notes and carts) |

### Protected Endpoints (JWT Bearer Token Required)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/cart` | Get the authenticated user's cart |
| `POST` | `/api/cart` | Add an item to the cart |
| `DELETE` | `/api/cart` | Clear the entire cart |
| `DELETE` | `/api/cart/<product_id>` | Remove a specific item from the cart |
| `PATCH` | `/api/cart/<product_id>` | Update item quantity in the cart |

### Example: Register

```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "mypassword"}'
```

### Example: Login

```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "mypassword"}'
```

### Example: Get Fragrances

```bash
curl http://localhost:5000/api/fragrances
curl http://localhost:5000/api/fragrances?search=oud
```

---

## Pages and Routes

| Route | Component | Description |
|---|---|---|
| `/` | Login | Landing page — login or register |
| `/login` | Login | Explicit login route |
| `/home` | HomePage | Marketing landing page with features and "How It Works" |
| `/quiz` | Quiz | 4-question scent discovery quiz |
| `/recommendation` | Recommendation | Personalized perfume recommendation (requires quiz completion) |
| `/collection` | Collection | Browse all fragrances and add to cart |
| `/cart` | Cart | View and manage shopping cart items |
| `/account` | Account | User dashboard with profile and settings |
| `/journal` | Journal | Blog articles about the art and science of perfumery |
| `/about` | About | Company mission, vision, and team |
| `/admin` | AdminCatalog | Admin panel for fragrance catalog management |

---

## Database Schema

Schema **v2**. Tables are created with `STRICT` typing, foreign keys are enforced
(`PRAGMA foreign_keys = ON` on every connection), and money is stored as integer
cents to avoid floating-point drift.

```mermaid
erDiagram
  USERS ||--o{ CART_ITEMS : "ON DELETE CASCADE"
  FRAGRANCES ||--o{ CART_ITEMS : "ON DELETE CASCADE"
  FRAGRANCES ||--o{ FRAGRANCE_NOTES : "ON DELETE CASCADE"

  USERS {
    TEXT email PK
    TEXT password
    TEXT role "customer | admin"
    TEXT created_at
  }
  FRAGRANCES {
    TEXT id PK "PF-001"
    TEXT name
    TEXT brand
    INTEGER price_cents
    TEXT notes
    REAL rating
    TEXT image
    TEXT created_at
    TEXT updated_at
  }
  FRAGRANCE_NOTES {
    TEXT fragrance_id PK_FK
    TEXT note PK
    INTEGER position
  }
  CART_ITEMS {
    TEXT email PK_FK
    TEXT fragrance_id PK_FK
    INTEGER qty "CHECK qty > 0"
    TEXT added_at
  }
```

Design points:

- **No orphans.** `ON DELETE CASCADE` means removing a fragrance clears its notes
  and every cart reference in one statement.
- **No stale prices.** `cart_items` stores only `fragrance_id` and `qty`; name,
  brand, and price are read through a `JOIN`, so an admin price change is
  reflected in every cart immediately.
- **Queryable ingredients.** `fragrance_notes` is a real child table, so
  "which fragrances contain oud" is a join rather than Python-side JSON parsing.
- **Searchable.** An FTS5 index (`fragrances_fts`) is kept in sync by triggers over
  name, brand, notes, and ingredient text, with a `LIKE` fallback if the SQLite
  build lacks FTS5.
- **Never-reused IDs.** A `counters` row is incremented with
  `UPDATE ... RETURNING` inside the same transaction as the `INSERT`, so IDs are
  monotonic and gap-free under concurrent admins.
- **Auditable.** `created_at`, `updated_at`, and `added_at` on every table.

### Migrating an older database

```bash
cd backend
python migrate.py
```

The script is idempotent (re-running is a no-op), runs in a single transaction so
a failure rolls back cleanly, and writes a `smartperfume.db.pre-migrate` backup
first. It copies all fragrances, splits the old JSON `ingredients` column into
`fragrance_notes`, converts `price` to `price_cents`, carries users and carts
across (dropping and reporting any cart row whose fragrance no longer exists), and
backfills `notes`/`rating`/`image` from the seed catalogue.

---

## Environment Notes

- **SQLite database** — All data (fragrances, users, carts) is stored in `backend/smartperfume.db`, created and seeded automatically on first run. The catalog is seeded with the 9 default fragrances if the database is empty.
- **Schema versioning** — The schema version lives in `PRAGMA user_version`. If you start the server against a v1 database without migrating, the server logs a warning telling you to run `python migrate.py`.
- **JWT tokens** — Expire after 1 day. Stored in browser `localStorage` via `AuthContext`.
- **Quiz state** — Tracked via `SurveyContext` and persisted in `localStorage` per user. The quiz must be completed before accessing the Recommendation, Cart, and Collection features.
- **API proxy** — In development, Vite proxies `/api` requests to `http://localhost:5000`. This is configured in `frontend/vite.config.js`.
- **CORS** — Flask-CORS is enabled to allow cross-origin requests during development.
- **Debug mode** — Flask runs with `debug=True` by default. Disable this for production.
- **Secret key** — Set `SMARTPERFUME_SECRET_KEY` before deploying; `app.py` falls back to an insecure development key if it is unset.
- **Admin access** — Admin is a `users` row with `role = 'admin'`, provisioned from `SMARTPERFUME_ADMIN_EMAIL` / `SMARTPERFUME_ADMIN_PASSWORD`. There is no hardcoded admin credential.
- **Catalog writes require admin** — `POST /api/fragrances`, `PATCH /api/fragrances/<id>`, and `DELETE /api/fragrances/<id>` all reject non-admin tokens with 403.

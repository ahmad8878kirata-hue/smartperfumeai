# SmartPerfume AI

**The Art of Computational Olfaction**

SmartPerfume AI is an AI-powered personalized fragrance recommendation and e-commerce web application. It combines machine learning concepts with perfumery to analyze a user's sensory preferences and recommend a bespoke fragrance. Users can take a scent discovery quiz, receive a personalized recommendation, browse a curated collection of fragrances, and purchase them through a shopping cart system. The platform also features an admin panel for catalog management and a journal section exploring computational perfumery.

---

## Simplified Explanation

SmartPerfume AI is a website where users answer a short quiz about their scent preferences (favorite scent family, mood, occasion, and intensity), and an AI "advisor" recommends a perfume tailored to them. After receiving their recommendation, users can browse other fragrances in the collection, add them to a shopping cart, and manage their orders. There is also an admin panel for managing the fragrance catalog and a journal with articles about the science behind AI-powered perfumery.

Think of it as a **personalized perfume shop guided by AI** — you tell it what you like, it tells you what to wear, and you can buy it right there.

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
- [Environment Notes](#environment-notes)

---

## Features

### For Users
- **Scent Discovery Quiz** — A 4-question interactive questionnaire covering scent family, mood, setting, and sillage intensity.
- **AI Fragrance Recommendation** — Personalized perfume suggestion based on quiz answers.
- **Fragrance Collection** — Browse 5 curated fragrances with details on ingredients, notes, ratings, and prices.
- **Shopping Cart** — Add/remove fragrances, adjust quantities, view totals, and clear the cart.
- **User Authentication** — Register and log in with email and password (JWT-based).
- **Guest Mode** — Continue without signing in to explore the platform.
- **Account Dashboard** — View profile status, scent profile milestones, and quick navigation.
- **Scent Journal** — Read articles about computational olfaction, AI in perfumery, sustainability, and more.
- **About Page** — Learn about the company mission, vision, and team.

### For Admins
- **Admin Catalog Panel** — Manage fragrances with search, edit, and delete functionality.
- **Dashboard Metrics** — View total fragrances, computational blends, active regions, and system status.

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
│   ├── requirements.txt        # Python dependencies
│   └── models/                 # Empty (no database yet)
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
        └── components/
            ├── Layout.jsx          # Shared nav + footer
            ├── Login.jsx           # Login/Register page
            ├── HomePage.jsx        # Landing page
            ├── Quiz.jsx            # Scent discovery quiz
            ├── Recommendation.jsx  # AI recommendation display
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
git clone https://github.com/your-username/smartperfumeai.git
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
python app.py
```

The Flask server starts on **http://localhost:5000**.

You should see output like:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

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
| `GET` | `/api/health` | Health check — returns `{"status": "ok"}` |
| `POST` | `/api/register` | Register a new user (email + password) |
| `POST` | `/api/login` | Log in and receive a JWT token |
| `GET` | `/api/fragrances` | List all fragrances (supports `?search=` query) |
| `POST` | `/api/fragrances` | Add a new fragrance to the catalog |
| `DELETE` | `/api/fragrances/<id>` | Delete a fragrance by ID |
| `POST` | `/api/quiz/submit` | Submit quiz answers, returns recommendation |

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
| `/recommendation` | Recommendation | AI-generated perfume recommendation (requires quiz completion) |
| `/collection` | Collection | Browse all fragrances and add to cart |
| `/cart` | Cart | View and manage shopping cart items |
| `/account` | Account | User dashboard with profile and settings |
| `/journal` | Journal | Blog articles about computational perfumery |
| `/about` | About | Company mission, vision, and team |
| `/admin` | AdminCatalog | Admin panel for fragrance catalog management |

---

## Environment Notes

- **No database** — All data (fragrances, users, carts) is stored in memory on the Flask server. Data is lost when the server restarts.
- **JWT tokens** — Expire after 1 day. Stored in browser `localStorage` via `AuthContext`.
- **Quiz state** — Tracked via `SurveyContext` and persisted in `localStorage` per user. The quiz must be completed before accessing the Recommendation, Cart, and Collection features.
- **API proxy** — In development, Vite proxies `/api` requests to `http://localhost:5000`. This is configured in `frontend/vite.config.js`.
- **CORS** — Flask-CORS is enabled to allow cross-origin requests during development.
- **Debug mode** — Flask runs with `debug=True` by default. Disable this for production.
- **Secret key** — The JWT secret key is hardcoded in `app.py`. Change `app.config["SECRET_KEY"]` before deploying to production.

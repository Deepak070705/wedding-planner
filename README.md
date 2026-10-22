# Shaadi Sathi - Wedding and Event Planner (MERN)

Do alag folder hain:
- `backend/`  - Node.js + Express + MongoDB
- `frontend/` - React (Vite)

## Website kaise kaam karti hai
1. Pehle page par name, email aur password likho aur **Enter** dabao.
2. Naya email ho to account ban jata hai. Purana email ho to password match hona chahiye.
3. Phir event banao aur vendors, budget, tasks aur guests manage karo.

## Backend files (backend/)
- `server.js`   - MongoDB se connect karta hai aur server start karta hai
- `app.js`      - Express app aur routes jodta hai
- `auth.js`     - Enter route (name, email, password)
- `routes.js`   - vendors, events, expenses, tasks, guests, quotes ke routes
- `validate.js` - galat ya random data rokne ke checks
- `models.js`   - MongoDB tables

## Frontend files (frontend/src/)
- `App.jsx`          - main page, tabs
- `components/Enter.jsx` - pehla page
- `pages/`           - Dashboard, Vendors, Budget, Tasks, Guests
- `api.js`           - backend ko request bhejta hai
- `validate.js`      - form ke checks
- `styles.css`       - design

## Chalane ke steps
Pehle Node.js aur MongoDB install karo.

Terminal 1 (backend):
```
cd backend
copy .env.example .env
npm install
npm run dev
```
`.env` me `JWT_SECRET` me koi bhi lamba random text likho.
Ye dikhna chahiye: `Backend running on http://localhost:5000`

Terminal 2 (frontend):
```
cd frontend
npm install
npm run dev
```
Browser me kholo: http://localhost:5173

Pehle backend chalu karo, phir frontend. `.env` file GitHub par upload mat karna.

# RCE Website (Frontend & Backend Setup)

Macha, intha project-la frontend and backend rendume cleanly separate panni setup panniyachu!

---

## 📁 Folder Structure & .env Files

```
Rce-website/
├── .env                      <-- 🌐 FRONTEND ENV (VITE_API_BASE_URL, VITE_PORT)
├── .env.example
├── package.json              <-- Root package.json (with scripts to control both)
├── vite.config.ts            <-- Vite configuration (Port: 5173, proxy to 5000)
├── src/                      <-- 🌐 FRONTEND (React + TypeScript + Vite)
│   ├── .env                  <-- (Copy inside src for easy reference)
│   ├── assets/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
└── server/                   <-- 🚀 BACKEND (Node.js + Express + MongoDB ready)
    ├── .env                  <-- 🚀 BACKEND ENV (PORT=5000, MONGO_URI, CLIENT_URL)
    ├── .env.example
    ├── package.json          <-- Backend dependencies
    └── src/
        ├── config/           <-- db.js (MongoDB config)
        ├── controllers/      <-- statusController.js
        ├── middleware/       <-- errorHandler.js
        ├── routes/           <-- api.js
        ├── app.js            <-- Express app & CORS
        └── server.js         <-- Server entry point
```

---

## ⚙️ Environment Variables (.env)

### 1️⃣ Frontend `.env` (`Rce-website/.env` & `src/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_PORT=5173
VITE_APP_NAME="RCE Website"
```

### 2️⃣ Backend `.env` (`server/.env`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/rce_website
```


---

## 🚀 How to Run Separately (Thaniya Thaniya Ports-la)

### 1️⃣ Terminal 1: Run Frontend (Port: `5173`)
Root directory-la irundhu:
```bash
npm run dev
```
👉 Frontend open aagum: **`http://localhost:5173`**

---

### 2️⃣ Terminal 2: Run Backend (Port: `5000`)
Root directory-la irundhu directly run panradhuku:
```bash
npm run server
```
*(or)* server folder kulla poi run panradhuku:
```bash
cd server
npm run dev
```
👉 Backend API run aagum: **`http://localhost:5000`**
- Health Check: `http://localhost:5000/api/health`
- Sample API: `http://localhost:5000/api/message`

---

## ⚡ Optional: Run Both in a Single Terminal

Orey terminal-la frontend and backend rendayum execute panna:
```bash
npm run dev:all
```
Both servers will start together with colored log prefixes (`FRONTEND` in cyan, `BACKEND` in green).

# Developer Portfolio Evaluator

A full-stack MERN application that analyses any public GitHub profile and generates a detailed scorecard covering activity, code quality, project diversity, community impact, and hiring readiness.

## 🚀 Live Demo

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-api.onrender.com

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite, React Router v6, Chart.js, Axios
- **Backend**: Node.js, Express, Octokit (GitHub SDK), node-cron
- **Database**: MongoDB Atlas (Mongoose)
- **Auth**: JWT + bcrypt (optional)
- **Deploy**: Vercel (FE) + Render (BE)

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- Git
- MongoDB Atlas account (free)
- GitHub Personal Access Token

### 1. Clone the repo

```bash
git clone https://github.com/your-username/portfolio-evaluator.git
cd portfolio-evaluator
```

### 2. Install dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 3. Set up environment variables

```bash
# In server/
cp .env.example .env
# Fill in MONGODB_URI and GITHUB_TOKEN

# In client/
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
```

### 4. Run locally

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🚢 Deployment

### Frontend (Vercel)
1. Push `client/` to GitHub
2. Import project in Vercel
3. Set env var: `VITE_API_URL=https://your-api.onrender.com/api`
4. Deploy

### Backend (Render)
1. Push `server/` to GitHub
2. Create Web Service on Render
3. Set all `.env` variables
4. Deploy

## 📁 Project Structure

```
portfolio-evaluator/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── components/      # ScoreCard, RadarChart, HeatMap, RepoList, SearchBar
│       ├── pages/           # Home, Report
│       └── utils/api.js     # Axios calls
├── server/                  # Node.js + Express backend
│   ├── controllers/
│   ├── routes/
│   ├── services/            # githubService, scoringService
│   ├── models/
│   └── middleware/
└── README.md
```

## 📊 Scoring Algorithm

| Category | Weight | Key Signals |
|----------|--------|-------------|
| Activity | 25% | Commits last 90 days, push frequency, streak |
| Code Quality | 20% | README, license, topics, tests folder |
| Diversity | 20% | Languages used, repo topic variety |
| Community | 20% | Stars, forks, followers |
| Hiring Ready | 15% | Bio, website, email, pinned repos |

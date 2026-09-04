# ScoutVision - Fullstack Platform (Frontend + Backend + MongoDB)

This repository contains the complete Dockerized architecture for ScoutVision:
* **Frontend**: Next.js 16 Client App (Port 3000)
* **Backend**: Node.js + Express + TypeScript API (Port 5000)
* **Database**: MongoDB 7.0 (Port 27017)
* **Database GUI**: Mongo Express Web Viewer (Port 8081)

---

## 📁 Architecture

```text
D:\ScoutVision/
├── frontend/                     # Next.js 16 Web Application (Port 3000)
├── backend/                      # Express TypeScript API Service (Port 5000)
│   ├── src/
│   │   ├── config/db.ts         # MongoDB connection manager
│   │   ├── models/              # Mongoose schemas (Match, Tag, User)
│   │   └── index.ts             # REST API endpoints
│   ├── dist/                    # Compiled production JS
│   └── Dockerfile               # Node.js 20 Alpine container
│
├── docker-compose.yml           # 4 services orchestration
├── .env.example                 # Configured with MONGODB_URI
└── README.md
```

---

## 🚀 Running with Docker

### 1. Launch All Services (Frontend, Backend, MongoDB, Mongo-Express)
```powershell
cd D:\ScoutVision
docker compose up --build -d
```

### 2. Service Access Links
* 🌐 **Frontend Web App**: [http://localhost:3000](http://localhost:3000)
* ⚡ **Backend API**: [http://localhost:5000](http://localhost:5000)
* 🩺 **Backend Health Status**: [http://localhost:5000/health](http://localhost:5000/health)
* 📊 **Mongo Express (Web Database GUI)**: [http://localhost:8081](http://localhost:8081)
* 🍃 **Direct MongoDB Connection**: `mongodb://localhost:27017/scoutvision`

### 3. Stop All Services
```powershell
docker compose down
```

---

## 🛠️ Running Locally (Without Docker)

### Run MongoDB locally or via Docker:
```powershell
docker run -d -p 27017:27017 --name scoutvision-mongo mongo:7.0
```

### Run Backend:
```powershell
cd D:\ScoutVision\backend
npm run dev
```

### Run Frontend:
```powershell
cd D:\ScoutVision\frontend
npm run dev
```

# CoopTracker - Quick Start Guide

## 🚀 Starting the Application

### Option 1: Easy One-Command Start (Recommended)

Simply run this from the project root:

```bash
./start-dev.sh
```

This will automatically:
- ✓ Start MongoDB
- ✓ Start the Backend (port 8000)
- ✓ Start the Frontend (port 3000)

**To stop everything:** Press `Ctrl+C` in the terminal

### Option 2: Manual Start (Step by Step)

If you prefer to start each service separately:

**1. Start MongoDB (as a service - recommended):**
```bash
brew services start mongodb-community
```
This runs in the background, no need to keep terminal open.

**Alternative - Manual MongoDB start:**
```bash
mongod --dbpath /opt/homebrew/var/mongodb
```
Leave this terminal open if using this method.

**2. Start Backend (new terminal):**
```bash
cd backend
npm start
```

**3. Start Frontend (new terminal):**
```bash
cd frontend
npm run dev
```

## 📱 Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api
- **MongoDB:** mongodb://localhost:27017/coop-tracker

## 🔧 Useful Commands

### MongoDB Service Management:

**Start MongoDB service:**
```bash
brew services start mongodb-community
```

**Stop MongoDB service:**
```bash
brew services stop mongodb-community
```

**Restart MongoDB service:**
```bash
brew services restart mongodb-community
```

**Check MongoDB status:**
```bash
brew services list | grep mongodb
```

### Alternative - Check if MongoDB is running manually:
```bash
pgrep mongod
```

### Connect to MongoDB shell:
```bash
mongosh mongodb://localhost:27017/coop-tracker
```

### View your data in MongoDB:
```javascript
// Inside mongosh:
db.applications.find().pretty()
db.resumeversions.find().pretty()
```

### Re-seed the database:
```bash
cd backend
node scripts/seed.js
```

### Stop MongoDB manually (if running in background):
```bash
pkill mongod
```

## 📋 First Time Setup

Already done! But if you need to reset:

1. **Install dependencies:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Seed the database:**
   ```bash
   cd backend
   node scripts/seed.js
   ```

## ⚙️ Configuration

All configuration is in `backend/.env`:
- `MONGODB_URI=mongodb://localhost:27017/coop-tracker` (local MongoDB)
- `PORT=8000` (backend port)
- `SINGLE_USER_MODE=true` (no authentication required)

## 🐛 Troubleshooting

**MongoDB won't start:**
- Make sure no other instance is running: `pkill mongod`
- Check the logs: `cat backend/data/mongodb.log`

**Backend connection error:**
- Verify MongoDB is running: `pgrep mongod`
- Check backend logs in the terminal

**Frontend can't connect:**
- Make sure backend is running on port 8000
- Check browser console for errors

## 💾 Data Storage

Your data is stored in:
- **MongoDB files:** `backend/data/db/`
- **MongoDB logs:** `backend/data/mongodb.log`

Data persists between restarts!

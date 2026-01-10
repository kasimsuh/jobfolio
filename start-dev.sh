#!/bin/bash

# CoopTracker Development Startup Script
# This script starts MongoDB, Backend, and Frontend

echo "🚀 Starting CoopTracker Development Environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if MongoDB is already running
if brew services list | grep mongodb-community | grep started > /dev/null; then
    echo -e "${GREEN}✓${NC} MongoDB service is already running"
else
    echo -e "${BLUE}►${NC} Starting MongoDB service..."
    brew services start mongodb-community > /dev/null 2>&1
    sleep 2

    if brew services list | grep mongodb-community | grep started > /dev/null; then
        echo -e "${GREEN}✓${NC} MongoDB service started successfully"
    else
        echo -e "${RED}✗${NC} Failed to start MongoDB service"
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}►${NC} Starting Backend (port 8000)..."
cd "$SCRIPT_DIR/backend"
npm start > /dev/null 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓${NC} Backend started (PID: $BACKEND_PID)"

echo ""
echo -e "${BLUE}►${NC} Starting Frontend (port 3000)..."
cd "$SCRIPT_DIR/frontend"
npm run dev > /dev/null 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓${NC} Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ CoopTracker is running!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  📱 Frontend:  http://localhost:3000"
echo "  🔧 Backend:   http://localhost:8000"
echo "  🗄️  MongoDB:   mongodb://localhost:27017/coop-tracker"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping Backend and Frontend..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✓ Backend and Frontend stopped"
    echo ""
    echo "Note: MongoDB service is still running in the background."
    echo "To stop it, run: brew services stop mongodb-community"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup SIGINT SIGTERM

# Wait indefinitely
while true; do
    sleep 1
done

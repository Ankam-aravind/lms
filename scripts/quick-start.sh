#!/bin/bash

echo "🚀 Video Learning Platform - Quick Start"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from nodejs.org"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local with your database credentials"
fi

# Try to build the project
echo "🏗️ Testing build..."
npm run build:azure

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Setup complete! Next steps:"
    echo "1. Edit .env.local with your database credentials"
    echo "2. Run 'npm run dev' to start development server"
    echo "3. Open http://localhost:3000 in your browser"
else
    echo "❌ Build failed. Please check the errors above."
fi

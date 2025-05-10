#!/bin/bash

echo "🚀 Setting up BookingLink development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Initialize Husky
echo "🪝 Setting up Git hooks..."
npm run prepare

# Check environment variables
echo "🔍 Checking environment variables..."
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Copying from example..."
    cp .env.local.example .env.local
    echo "📝 Please edit .env.local with your actual values"
fi

# Test environment
echo "🧪 Testing environment..."
npm run test-env

# Run type checking
echo "🔍 Running type check..."
npm run type-check

# Run linting
echo "🔍 Running linter..."
npm run lint

echo ""
echo "🎉 Development environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Edit .env.local with your Firebase and other service credentials"
echo "   2. Run 'npm run init-database' to set up your database"
echo "   3. Run 'npm run dev' to start the development server"
echo ""
echo "🔗 Useful commands:"
echo "   npm run dev          - Start development server"
echo "   npm run build        - Build for production"
echo "   npm run lint         - Check code quality"
echo "   npm run format       - Format code"
echo "   npm run type-check   - Check TypeScript"
echo ""

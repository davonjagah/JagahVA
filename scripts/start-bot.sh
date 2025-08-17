#!/bin/bash

echo "🚀 Starting JagahVA Bot..."

# Kill any existing processes
echo "🛑 Stopping any existing bot processes..."
pkill -f "node.*app.js" 2>/dev/null || true

# Clear cache
echo "🧹 Clearing cache..."
rm -rf .wwebjs_auth/ .wwebjs_cache/ 2>/dev/null || true

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "📝 Please create .env file from env.example"
    echo "   cp env.example .env"
    echo "   Then edit .env with your WhatsApp number"
fi

# Test core functionality
echo "🧪 Testing core functionality..."
node tests/test.js

# Start the bot
echo "🤖 Starting WhatsApp bot..."
echo "📱 Scan the QR code with your WhatsApp"
echo "💡 Once connected, send '!help' to test"
echo "🌐 Web interface: http://localhost:3000"

npm start 
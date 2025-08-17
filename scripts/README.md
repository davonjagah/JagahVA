# Scripts Directory

This directory contains utility scripts for managing the JagahVA bot.

## 📁 Files

### `start-bot.sh`
Main startup script that:
- Kills existing bot processes
- Clears WhatsApp cache
- Checks for environment configuration
- Runs tests
- Starts the bot

**Usage:**
```bash
./scripts/start-bot.sh
```

## 🔧 Setup

Make the script executable:
```bash
chmod +x scripts/start-bot.sh
```

## 🚀 Quick Start

```bash
# Start the bot with full setup
./scripts/start-bot.sh

# Or start manually
npm start
``` 
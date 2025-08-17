# Telegram Bot Troubleshooting Guide 🔧

## 🚨 Common Issues & Solutions

### 1. **"Conflict: terminated by other getUpdates request"**

**Error Message:**
```
❌ Telegram polling error: TelegramError: ETELEGRAM: 409 Conflict: terminated by other getUpdates request; make sure that only one bot instance is running
```

**Cause:** Multiple instances of your bot are running simultaneously.

**Solutions:**

#### Option A: Stop Local Instance (if running locally)
```bash
# Find and kill local bot processes
pkill -f "node.*app.js"
pkill -f "npm start"

# Or kill all Node.js processes (be careful!)
pkill -f node
```

#### Option B: Wait for Render to Release (if deployed)
- **Wait 5-10 minutes** for the deployed instance to release the connection
- **Check Render dashboard** to ensure only one instance is running
- **Restart the deployment** if needed

#### Option C: Use Different Bot Token (for testing)
1. Create a new bot with @BotFather
2. Use the new token for local testing
3. Keep the original token for production

### 2. **"Bot token is invalid"**

**Error Message:**
```
❌ Telegram bot initialization failed: TelegramError: ETELEGRAM: 401 Unauthorized
```

**Solutions:**
- ✅ **Check your bot token** in `.env` file
- ✅ **Regenerate token** with @BotFather if needed
- ✅ **Ensure no extra spaces** in the token

### 3. **"User ID not found"**

**Error Message:**
```
🚫 Unauthorized message from: [user-id]
```

**Solutions:**
- ✅ **Get correct user ID** from @userinfobot
- ✅ **Update ALLOWED_USER_ID** in `.env`
- ✅ **Restart the bot** after changing environment variables

### 4. **"Bot not responding"**

**Symptoms:**
- Bot starts successfully but doesn't respond to messages
- No error messages in logs

**Solutions:**
- ✅ **Check if bot is running** (look for "Bot is ready to receive messages!")
- ✅ **Verify bot username** in logs matches your bot
- ✅ **Send /start** to your bot first
- ✅ **Check message format** (commands must start with `!`)

## 🔧 Debug Commands

### Check Bot Status
```bash
# Check if bot is running
ps aux | grep "node.*app.js"

# Check bot logs
npm start
```

### Test Bot Connection
```bash
# Test with curl (replace with your bot token)
curl "https://api.telegram.org/bot/YOUR_BOT_TOKEN/getMe"
```

### Environment Variables
```bash
# Check if .env file exists
ls -la .env

# Verify environment variables
echo $TELEGRAM_BOT_TOKEN
echo $ALLOWED_USER_ID
```

## 🚀 Quick Fixes

### 1. **Complete Reset (Local)**
```bash
# Stop all processes
pkill -f node

# Clear any cached data
rm -rf node_modules
npm install

# Start fresh
npm start
```

### 2. **Render Deployment Reset**
1. **Go to Render Dashboard**
2. **Find your service**
3. **Click "Manual Deploy"**
4. **Select "Clear build cache & deploy"**

### 3. **New Bot Setup**
```bash
# 1. Create new bot with @BotFather
# 2. Get new token
# 3. Update .env file
# 4. Restart bot
npm start
```

## 📱 Bot Commands Reference

### Basic Commands
- `/start` - Initialize bot
- `!help` - Show all commands
- `!setgoals` - Set your goals
- `!today` - Get today's tasks

### Testing Commands
- `!listgoals` - List all goals
- `!progress 1, 2` - Mark goals as completed
- `!addtask Buy groceries` - Add a task

## 🌐 Useful Links

- **@BotFather** - Create and manage bots
- **@userinfobot** - Get your user ID
- **Telegram Bot API** - Official documentation
- **Render Dashboard** - Deployment management

## 🆘 Still Having Issues?

1. **Check the logs** for specific error messages
2. **Verify environment variables** are correct
3. **Test with a new bot token**
4. **Wait 5-10 minutes** if it's a conflict issue
5. **Contact support** with error logs

---

**💡 Pro Tip:** Always keep only one instance of your bot running at a time! 
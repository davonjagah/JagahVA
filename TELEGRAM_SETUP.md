# Telegram Bot Setup Guide 🚀

This guide will help you set up your JagahVA Telegram bot in just a few minutes!

## 📱 Step 1: Create Your Telegram Bot

1. **Open Telegram** and search for `@BotFather`
2. **Send `/newbot`** to BotFather
3. **Choose a name** for your bot (e.g., "JagahVA Productivity Bot")
4. **Choose a username** (must end with 'bot', e.g., "jagahva_bot")
5. **Copy the bot token** - you'll need this for your `.env` file

Example response from BotFather:
```
Use this token to access the HTTP API:
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

Keep your token secure and store it safely, it can be used by anyone to control your bot.
```

## 👤 Step 2: Get Your User ID

1. **Search for `@userinfobot`** on Telegram
2. **Send `/start`** to @userinfobot
3. **Copy your User ID** from the response

Example response from @userinfobot:
```
@yourusername
First Name: Your Name
Last Name: Your Last Name
User ID: 123456789
```

## ⚙️ Step 3: Configure Environment Variables

1. **Copy the example file:**
   ```bash
   cp env.example .env
   ```

2. **Edit `.env` with your credentials:**
   ```env
   # Required: Your Telegram Bot Token (from @BotFather)
   TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

   # Required: Your Telegram User ID (from @userinfobot)
   ALLOWED_USER_ID=123456789

   # Optional: Web server port (default: 3000)
   PORT=3000

   # Optional: Environment (development/production)
   NODE_ENV=production
   ```

## 🚀 Step 4: Start Your Bot

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the bot:**
   ```bash
   npm start
   ```

3. **You should see:**
   ```
   🤖 Telegram bot created successfully
   ✅ Telegram event handlers set up successfully
   🔄 Initializing Telegram bot...
   ✅ Telegram bot initialized successfully
   🤖 Bot name: JagahVA Productivity Bot
   🆔 Bot username: @jagahva_bot
   📱 Bot is ready to receive messages!
   ```

## 📱 Step 5: Test Your Bot

1. **Find your bot** on Telegram (using the username you created)
2. **Send `/start`** to get the welcome message
3. **Send `!help`** to see all available commands
4. **Try setting goals:**
   ```
   !setgoals workout 3 times a week, read daily, pray everyday
   ```

## 🔧 Troubleshooting

### Bot Not Responding
- ✅ Check if bot token is correct
- ✅ Verify user ID is properly set
- ✅ Ensure bot is running (check console logs)
- ✅ Make sure you're messaging the correct bot

### Permission Denied
- ✅ Only the user with `ALLOWED_USER_ID` can use the bot
- ✅ Check if your user ID is correct
- ✅ Restart the bot after changing environment variables

### Connection Issues
- ✅ Check internet connection
- ✅ Verify bot token is valid
- ✅ Ensure bot hasn't been deleted or blocked

## 🎯 Next Steps

Once your bot is working:

1. **Set your goals:**
   ```
   !setgoals workout 4 times a week, read 30 minutes daily, meditate twice a week
   ```

2. **Check your tasks:**
   ```
   !today
   ```

3. **Mark progress:**
   ```
   !progress 1, 2
   ```

4. **View statistics:**
   ```
   !stats
   ```

## 🌟 Benefits of Telegram

- **✅ Stable**: No QR codes or connection issues
- **✅ Reliable**: Official Bot API with 99.9% uptime
- **✅ Fast**: Instant message delivery
- **✅ Secure**: End-to-end encryption
- **✅ Cross-platform**: Works on all devices
- **✅ No limits**: No message volume restrictions

---

**🎉 Congratulations! You now have a stable, reliable productivity bot!** 
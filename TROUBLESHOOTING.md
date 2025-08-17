# JagahVA Troubleshooting Guide 🔧

## Common Issues and Solutions

### 1. Puppeteer Timeout Error
**Error**: `TimeoutError: Timed out after 30000 ms while trying to connect to the browser`

**Solutions**:
1. **Clear browser cache**:
   ```bash
   rm -rf .wwebjs_auth/
   rm -rf .wwebjs_cache/
   ```

2. **Install Chrome/Chromium**:
   ```bash
   # On macOS
   brew install chromium
   
   # On Ubuntu/Debian
   sudo apt-get install chromium-browser
   ```

3. **Use system Chrome**:
   ```bash
   # Find Chrome path
   which google-chrome
   # or
   which chromium
   ```

### 2. Bot Not Responding to Commands

**Check these**:
1. **Bot is running**: Look for "🚀 JagahVA is live and ready!" message
2. **QR code scanned**: Look for "✅ WhatsApp authenticated successfully!"
3. **Message format**: Commands must start with "!" (e.g., `!help`)
4. **Rate limiting**: Bot has 1-2 second delay between responses

### 3. QR Code Issues

**Solutions**:
1. **Update WhatsApp** to latest version
2. **Log out and back in** to WhatsApp
3. **Check internet connection**
4. **Try different browser** for QR scanning

### 4. API Key Issues

**Check**:
1. **API key is set** in `.env` file
2. **API key is valid** and has credits
3. **API service is working** (xAI/OpenAI)

### 5. Database Issues

**Solutions**:
1. **Check permissions**: `ls -la db.json`
2. **Reset database**: `rm db.json` (will lose data)
3. **Check disk space**: `df -h`

## Quick Fix Commands

### Reset Everything
```bash
# Stop bot
pkill -f "node.*bot.js"

# Clear cache
rm -rf .wwebjs_auth/
rm -rf .wwebjs_cache/
rm -f db.json

# Restart
npm start
```

### Test Core Functionality
```bash
# Test without WhatsApp
npm test

# Test help command
node -e "
const helpText = \`🤖 JagahVA Commands:...\`;
console.log('Help command works:', helpText.length > 1000);
"
```

### Check Dependencies
```bash
# Reinstall dependencies
rm -rf node_modules/
npm install

# Check versions
npm list whatsapp-web.js
npm list puppeteer
```

## Debug Mode

Enable debug logging:
```bash
DEBUG=true npm start
```

Or edit `.env`:
```env
DEBUG=true
```

## Alternative Solutions

### 1. Use Different Puppeteer Config
Edit `bot.js`:
```javascript
const client = new Client({
  puppeteer: {
    headless: false, // Show browser window
    args: ['--no-sandbox'],
    executablePath: '/usr/bin/chromium' // Use system Chrome
  }
});
```

### 2. Use Docker (if available)
```bash
docker run -it --rm \
  -v $(pwd):/app \
  -w /app \
  node:18 npm start
```

### 3. Use Different Port
If port conflicts occur:
```bash
# Check what's using the port
lsof -i :3000
# Kill process or use different port
```

## Getting Help

1. **Check logs**: Look for error messages in console
2. **Test core functions**: Run `npm test`
3. **Check system**: Ensure Chrome/Chromium is installed
4. **Restart everything**: Clear cache and restart

## Success Indicators

✅ **Bot is working when you see**:
- "🚀 JagahVA is live and ready!"
- "✅ WhatsApp authenticated successfully!"
- QR code appears and gets scanned
- Bot responds to `!help` command

❌ **Bot is not working when you see**:
- Puppeteer timeout errors
- Authentication failures
- No response to commands
- Browser launch errors 
# 🚀 JagahVA Render Deployment Guide

## 📋 Prerequisites

- Render account (free tier works)
- GitHub repository with JagahVA code
- WhatsApp account for bot authentication

## 🔧 Render Setup

### 1. Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the JagahVA repository

### 2. Configure Environment Variables

Add these environment variables in Render:

```env
NODE_ENV=production
ALLOWED_NUMBER=your-whatsapp-number@c.us
PORT=10000
```

**Optional**: If you encounter Chrome path issues, you can set a custom Chrome path:
```env
CHROME_BIN=/usr/bin/chromium-browser
```

### 3. Build & Deploy Settings

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (or paid for better performance)

### 4. Advanced Settings

- **Auto-Deploy**: Yes
- **Branch**: main
- **Health Check Path**: `/health`

## 🐳 Docker Alternative (Recommended)

If you encounter issues with the standard deployment, use Docker:

### Create Dockerfile

```dockerfile
FROM node:18-alpine

# Install Chrome dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set Chrome path
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Create .dockerignore

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.wwebjs_auth
.wwebjs_cache
```

## 🔍 Troubleshooting

### Common Issues

1. **Chrome/Chromium Not Found**
   - Error: `spawn /usr/bin/google-chrome-stable ENOENT`
   - **Solution**: The bot now automatically tries multiple Chrome paths
   - **Alternative**: Set `CHROME_BIN` environment variable to correct path
   - **Fallback**: Uses Puppeteer's bundled Chromium if no system Chrome found

2. **Timeout Error**
   - Increase timeout in code (already done)
   - Check memory allocation
   - Verify Chrome installation

3. **Memory Issues**
   - Upgrade to paid plan for more RAM
   - Optimize browser settings (already done)

4. **Network Issues**
   - Check firewall settings
   - Verify WhatsApp Web accessibility

### Debug Commands

```bash
# Check Chrome installation
which google-chrome-stable

# Check memory usage
free -h

# Check network connectivity
curl -I https://web.whatsapp.com
```

## 📊 Monitoring

### Health Check Endpoint

The bot provides a health check at `/health`:

```bash
curl https://your-app.onrender.com/health
```

### Logs

Monitor logs in Render dashboard for:
- WhatsApp connection status
- QR code generation
- Error messages

## 🔄 Deployment Process

1. **Push to GitHub** → Auto-deploys to Render
2. **Monitor logs** → Check for initialization success
3. **Scan QR code** → When bot shows QR code
4. **Test commands** → Send `!help` to verify

## 💡 Tips for Success

1. **Use Free Tier First**: Test with free tier before upgrading
2. **Monitor Logs**: Watch deployment logs for issues
3. **QR Code Timing**: Be ready to scan QR code quickly
4. **Environment Variables**: Double-check all variables are set
5. **Memory**: Free tier has 512MB RAM, may need more for stability

## 🆘 Support

If you encounter issues:

1. Check Render logs for error messages
2. Verify environment variables
3. Test locally first
4. Consider upgrading to paid plan for better performance

---

**Happy Deploying! 🎉** 
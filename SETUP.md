# JagahVA Setup Guide 🚀

## Quick Start (5 minutes)

### 1. Prerequisites
- ✅ Node.js 18+ installed
- ✅ WhatsApp account
- ✅ xAI API key (or OpenAI API key)

### 2. Setup Steps

1. **Install dependencies** (already done)
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your API keys
   ```

3. **Test the bot** (already done)
   ```bash
   npm test
   ```

4. **Start the bot**
   ```bash
   npm start
   ```

5. **Authenticate with WhatsApp**
   - Scan the QR code with your WhatsApp
   - Send `!help` to test the bot

## API Key Setup

### Option 1: xAI Grok API (Recommended)
1. Visit [x.ai/api](https://x.ai/api)
2. Sign up and get your API key
3. Add to `.env`:
   ```env
   XAI_API_KEY=your-xai-api-key-here
   ```

### Option 2: OpenAI API
1. Visit [platform.openai.com](https://platform.openai.com)
2. Create an account and get your API key
3. Add to `.env`:
   ```env
   OPENAI_API_KEY=your-openai-api-key-here
   ```

## Testing Your Setup

### 1. Run Core Tests
```bash
npm test
```
Should show: "🎉 All tests passed!"

### 2. Test WhatsApp Bot
1. Start the bot: `npm start`
2. Scan QR code with WhatsApp
3. Send these test messages:
   ```
   !help
   !setgoals Workout 4 times a week. Pray every day.
   !today
   !progress I hit the gym
   !stats
   ```

## Troubleshooting

### QR Code Issues
- Update WhatsApp to latest version
- Try logging out and back in
- Check internet connection

### API Issues
- Verify API key is correct
- Check API quota/limits
- Bot will use fallback parsing if AI fails

### Database Issues
- Check file permissions
- Delete `db.json` to reset data
- Ensure `.env` file exists

## Development

### Run in Development Mode
```bash
npm run dev
```

### Project Structure
```
jagahva/
├── bot.js              # Main bot file (501 lines)
├── test.js             # Test suite (211 lines)
├── package.json        # Dependencies and scripts
├── .env               # Environment variables (create from env.example)
├── db.json            # Local database (auto-generated)
├── .gitignore         # Git ignore rules
├── README.md          # Project documentation
├── Guide.markdown     # Detailed guide
├── SETUP.md           # This file
└── LICENSE            # MIT License
```

## Features Implemented

✅ **Core Functionality**
- WhatsApp integration with QR authentication
- AI-powered goal parsing (xAI Grok / OpenAI)
- Fallback regex parsing
- Local JSON database
- Daily task generation
- Progress tracking
- Statistics and analytics

✅ **Commands**
- `!setgoals` - Set goals with natural language
- `!today` - Get daily task list
- `!progress` - Log progress
- `!edittodo` - Edit tasks
- `!stats` - View statistics
- `!help` - Show help

✅ **Safety Features**
- Rate limiting (1-2 second delays)
- Error handling and recovery
- Graceful disconnection handling
- Debug logging

✅ **Testing**
- Comprehensive test suite
- Core functionality validation
- Database operations testing

## Next Steps

1. **Customize**: Modify `bot.js` for your specific needs
2. **Deploy**: Run on a VPS for 24/7 availability
3. **Enhance**: Add more features like:
   - Weekly/monthly reports
   - Goal sharing
   - Integration with other apps
   - Mobile app companion

## Support

- Check the `README.md` for detailed documentation
- Review `Guide.markdown` for implementation details
- Run `npm test` to verify functionality
- Check console logs for debugging information

---

**🎉 Congratulations! You now have a fully functional WhatsApp productivity bot!** 
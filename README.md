# JagahVA 🤖

**Transform your Telegram into a personal productivity assistant!**

JagahVA is an open-source Telegram bot that helps you set goals, track daily tasks, mark progress with simple numbers, and get intelligent reminders—all through simple Telegram commands. Perfect for personal productivity and habit tracking.

## ✨ Features

- 🎯 **Smart Goal Setting**: Set goals with natural language parsing
- 📅 **Daily Task Management**: Get curated daily task lists
- 📝 **Progress Tracking**: Mark goals as completed with simple numbers
- 📊 **Analytics**: View your productivity statistics and streaks
- 📅 **Date & Day Tasks**: Set tasks for specific dates and days of the week
- 🔄 **Weekly Tracking**: Track weekly goals with Sunday as week start
- 🗄️ **Cloud Database**: MongoDB Atlas integration for persistent data
- 🌐 **Web Interface**: Beautiful landing page with status monitoring
- 🔒 **Privacy-First**: Secure data storage with optional local fallback
- ⚡ **High Availability**: Keep-alive system for 24/7 uptime

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Telegram account
- Telegram Bot Token (from @BotFather)
- MongoDB Atlas account (optional, for cloud storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/jagahva.git
   cd jagahva
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your Telegram bot token and user ID
   ```

4. **Set up MongoDB Atlas (Optional)**
   - Follow the guide in `MONGODB_SETUP.md`
   - Add `MONGODB_URI` to your `.env` file
   - Or use local storage (default)

5. **Run the bot**
   ```bash
   npm start
   ```

6. **Start using the bot**
   - Send `/start` to your bot on Telegram
   - Send `!help` to see all commands

## 📁 Project Structure

```
JagahVA/
├── src/                    # Source code
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── commands/          # Command implementations
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   └── app.js            # Main application
├── public/                # Static files
│   └── index.html        # Web interface
├── scripts/               # Utility scripts
│   └── migrate-to-mongodb.js  # Data migration script
├── db.json               # Local database file (fallback)
└── package.json          # Dependencies
```

See `src/README.md` for detailed architecture documentation.

## 📝 Usage

### Setting Goals
```
!setgoals Workout 4 times a week. Pray every day. Read 30 minutes daily.
!setday Monday Workout, Read 10 pages, Call mom
!setdate 21 October 2025 Wish Eniola Happy Birthday
```

### Checking Tasks
```
!today          # Today's tasks
!tomorrow       # Tomorrow's tasks
!listgoals      # List all goals
```

### Managing Tasks
```
!addtask Buy groceries          # Add one-time task
!complete 1                     # Mark task as done/undone
!progress 1, 2, 5              # Mark goals as completed (by number)
```

### Tracking Progress
```
!weekprogress                   # Weekly progress for all goals
!stats                         # View statistics
!help                          # Show all commands
```

### Progress Tracking Examples
```
!setgoals workout 3 times a week, read daily, pray everyday
!progress 1, 2                 # Mark goals 1 and 2 as completed today
!progress 1 2 3                # Mark goals 1, 2, and 3 as completed today
!progress 5                    # Mark only goal 5 as completed today
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Required: Your Telegram Bot Token (from @BotFather)
TELEGRAM_BOT_TOKEN=your-bot-token-here

# Required: Your Telegram User ID (from @userinfobot)
ALLOWED_USER_ID=your-user-id-here

# Optional: MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jagahva?retryWrites=true&w=majority

# Optional: Web server port (default: 3000)
PORT=3000

# Optional: Environment (development/production)
NODE_ENV=production

# Optional: Render external URL (for webhook support)
RENDER_EXTERNAL_URL=https://your-app-name.onrender.com
```

### Database Options

**Option 1: MongoDB Atlas (Recommended)**
- Persistent cloud storage
- Automatic backups
- Scales with your needs
- Free tier available (512MB)

**Option 2: Local Storage**
- Data stored in `db.json`
- No external dependencies
- Perfect for development

The bot automatically detects and uses MongoDB Atlas if `MONGODB_URI` is set, otherwise falls back to local storage.

### Data Migration

If you have existing data in `db.json` and want to migrate to MongoDB Atlas:

```bash
npm run migrate
```

## 🚀 Deployment

### Render (Recommended)

1. **Fork/Clone** this repository
2. **Connect** to Render dashboard
3. **Set environment variables**:
   - `TELEGRAM_BOT_TOKEN`
   - `ALLOWED_USER_ID`
   - `MONGODB_URI` (for persistent data)
   - `NODE_ENV=production`
4. **Deploy** - Render will auto-deploy on push

See `RENDER_DEPLOYMENT.md` for detailed deployment guide.

### Other Platforms

The bot works on any Node.js hosting platform:
- **Railway**
- **Heroku**
- **DigitalOcean App Platform**
- **VPS/Dedicated Server**

## 🛠️ Development

### Running in Development Mode
```bash
npm run dev
```

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with auto-restart
npm run test       # Run tests
npm run migrate    # Migrate data to MongoDB Atlas
```

### Key Features Implementation

- **Telegram Integration**: Uses `node-telegram-bot-api` for Telegram Bot API
- **Smart Goal Parsing**: Regex-based goal parsing with numeric progress tracking
- **Database Layer**: MongoDB Atlas with local fallback using `lowdb`
- **Modular Architecture**: Clean separation of concerns
- **Date Handling**: Uses `date-fns` for date manipulation
- **Web Interface**: Express.js server with status monitoring
- **Keep-Alive System**: Prevents deployment platform timeouts
- **Webhook Support**: Alternative to polling for better reliability

## 🛡️ Safety & Best Practices

### Telegram Guidelines
- No message volume limits
- Instant message delivery
- Stable 24/7 connection
- Official Bot API support

### Data Privacy & Security
- **MongoDB Atlas**: Enterprise-grade security with encryption
- **Local Storage**: Data stored locally in `db.json`
- **No Cloud Sync**: Unless explicitly configured
- **Backup Support**: Automatic backups with MongoDB Atlas
- **Access Control**: User ID-based authorization

### High Availability Features
- **Keep-Alive Ping**: Prevents platform timeouts
- **Webhook Support**: More reliable than polling
- **Graceful Shutdown**: Proper connection cleanup
- **Error Recovery**: Automatic fallback mechanisms

## 🐛 Troubleshooting

### Common Issues

**Bot Not Responding**
- Ensure bot token is correct
- Check if user ID is properly set
- Verify bot is running and connected

**Database Connection Issues**
- Check MongoDB Atlas connection string
- Verify network access settings
- Ensure database user has proper permissions

**Date Parsing Issues**
- Check date format (DD Month YYYY)
- Ensure month names are spelled correctly
- Verify date is valid

**Deployment Issues**
- Check environment variables in Render dashboard
- Verify MongoDB Atlas is accessible
- Check deployment logs for errors

### Debug Mode
```bash
DEBUG=true npm start
```

### Migration Issues
```bash
# Check if migration script works
npm run migrate

# Verify MongoDB connection
node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI ? 'MongoDB URI set' : 'No MongoDB URI')"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup
```bash
npm install
npm run dev  # Development mode with auto-restart
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) for Telegram integration
- [MongoDB Atlas](https://www.mongodb.com/atlas) for cloud database
- [lowdb](https://github.com/typicode/lowdb) for local database fallback
- [date-fns](https://date-fns.org/) for date manipulation
- [Express.js](https://expressjs.com/) for web server
- [Cursor AI](https://cursor.sh) for development assistance

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/jagahva/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/jagahva/discussions)
- **Documentation**: 
  - [MongoDB Setup Guide](MONGODB_SETUP.md)
  - [Render Deployment Guide](RENDER_DEPLOYMENT.md)
  - [Troubleshooting Guide](TROUBLESHOOTING.md)

---

**Built with ❤️ for productivity enthusiasts everywhere**

*Transform your Telegram into a personal productivity assistant with JagahVA!*

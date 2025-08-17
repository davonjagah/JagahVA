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
- 🔒 **Privacy-First**: All data stored locally in JSON format
- 🌐 **Web Interface**: Beautiful landing page with status monitoring

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Telegram account
- Telegram Bot Token (from @BotFather)

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

4. **Run the bot**
   ```bash
   npm start
   ```

5. **Start using the bot**
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
├── db.json               # Database file
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

# Optional: Web server port (default: 3000)
PORT=3000
```

### Database

All data is stored locally in `db.json`. The database structure is:
```json
{
  "users": {
    "your-number@c.us": {
      "goals": [],
      "todos": {},
      "stats": {},
      "dayTasks": {},
      "dateTasks": {}
    }
  }
}
```



## 🛠️ Development

### Running in Development Mode
```bash
npm run dev
```

### Project Structure
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
├── scripts/               # Utility scripts
├── tests/                 # Test files
├── backups/               # Backup files
├── db.json               # Database file
└── package.json          # Dependencies
```

### Key Features Implementation

- **Telegram Integration**: Uses `node-telegram-bot-api` for Telegram Bot API
- **Smart Goal Parsing**: Regex-based goal parsing with numeric progress tracking
- **Local Database**: Uses `lowdb` for JSON-based local storage
- **Modular Architecture**: Clean separation of concerns
- **Date Handling**: Uses `date-fns` for date manipulation
- **Web Interface**: Express.js server with status monitoring

## 🛡️ Safety & Best Practices

### Telegram Guidelines
- No message volume limits
- Instant message delivery
- Stable 24/7 connection
- Official Bot API support

### Data Privacy
- All data stored locally in `db.json`
- No cloud synchronization
- Consider regular backups of your data
- Optional: Encrypt sensitive data

## 🐛 Troubleshooting

### Common Issues

**Bot Not Responding**
- Ensure bot token is correct
- Check if user ID is properly set
- Verify bot is running and connected

**Date Parsing Issues**
- Check date format (DD Month YYYY)
- Ensure month names are spelled correctly
- Verify date is valid

**Database Issues**
- Check file permissions for `db.json`
- Verify JSON syntax
- Backup and recreate if corrupted

### Debug Mode
```bash
DEBUG=true npm start
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
- [lowdb](https://github.com/typicode/lowdb) for local database
- [date-fns](https://date-fns.org/) for date manipulation
- [Express.js](https://expressjs.com/) for web server
- [Cursor AI](https://cursor.sh) for development assistance

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/jagahva/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/jagahva/discussions)

---

**Built with ❤️ for productivity enthusiasts everywhere**

*Transform your Telegram into a personal productivity assistant with JagahVA!* # JagahVA

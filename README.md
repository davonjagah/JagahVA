# JagahVA 🤖

**Transform your WhatsApp into a personal productivity assistant!**

JagahVA is an open-source WhatsApp bot that helps you set goals, track daily tasks, log progress, and get intelligent reminders—all through simple WhatsApp commands. Perfect for personal productivity and habit tracking.

## ✨ Features

- 🎯 **Smart Goal Setting**: Set goals with natural language parsing
- 📅 **Daily Task Management**: Get curated daily task lists
- 📝 **Progress Tracking**: Log your progress with simple commands
- 📊 **Analytics**: View your productivity statistics and streaks
- 📅 **Date & Day Tasks**: Set tasks for specific dates and days of the week
- 🔄 **Weekly Tracking**: Track weekly goals with Sunday as week start
- 🔒 **Privacy-First**: All data stored locally in JSON format
- 🌐 **Web Interface**: Beautiful landing page with status monitoring

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- WhatsApp account

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
   # Edit .env with your allowed WhatsApp number
   ```

4. **Run the bot**
   ```bash
   npm start
   ```

5. **Authenticate with WhatsApp**
   - Scan the QR code with your WhatsApp
   - Send `!help` to test the bot

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
!progress I hit the gym         # Log progress
```

### Tracking Progress
```
!weekprogress                   # Weekly progress for all goals
!stats                         # View statistics
!help                          # Show all commands
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Required: Your WhatsApp number (with country code)
ALLOWED_NUMBER=233578588981@c.us

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

- **WhatsApp Integration**: Uses `whatsapp-web.js` for WhatsApp Web API
- **Natural Language Parsing**: Regex-based goal and progress parsing
- **Local Database**: Uses `lowdb` for JSON-based local storage
- **Modular Architecture**: Clean separation of concerns
- **Date Handling**: Uses `date-fns` for date manipulation
- **Web Interface**: Express.js server with status monitoring

## 🛡️ Safety & Best Practices

### WhatsApp Guidelines
- Keep message volume under 20 messages/day
- Bot includes 1-2 second delays between messages
- Graceful handling of disconnections
- Rate limiting implemented

### Data Privacy
- All data stored locally in `db.json`
- No cloud synchronization
- Consider regular backups of your data
- Optional: Encrypt sensitive data

## 🐛 Troubleshooting

### Common Issues

**QR Code Not Working**
- Ensure WhatsApp is up to date
- Try logging out and back in
- Check internet connection

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

- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) for WhatsApp integration
- [lowdb](https://github.com/typicode/lowdb) for local database
- [date-fns](https://date-fns.org/) for date manipulation
- [Express.js](https://expressjs.com/) for web server
- [Cursor AI](https://cursor.sh) for development assistance

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/jagahva/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/jagahva/discussions)

---

**Built with ❤️ for productivity enthusiasts everywhere**

*Transform your WhatsApp into a personal productivity assistant with JagahVA!* # JagahVA

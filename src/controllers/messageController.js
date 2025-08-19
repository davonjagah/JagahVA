const HelpCommand = require("../commands/helpCommand");
const TodayCommand = require("../commands/todayCommand");
const TomorrowCommand = require("../commands/tomorrowCommand");
const GoalsCommand = require("../commands/goalsCommand");
const TaskCommand = require("../commands/taskCommand");
const PrayerCommand = require("../commands/prayerCommand");
const AffirmationsCommand = require("../commands/affirmationsCommand");
const telegramClient = require("../config/telegram");

class MessageController {
  constructor() {
    this.allowedUserId = process.env.ALLOWED_USER_ID;
  }

  async sendReadyMessage(userId) {
    try {
      const readyMessage = `🚀 **JagahVA Bot is Ready!**

✅ MongoDB Atlas connected
✅ Database initialized
✅ Bot is listening for messages

📱 **Quick Start:**
• Send \`/start\` to begin
• Send \`!help\` to see all commands
• Send \`!setgoals workout 3 times a week, read daily\` to set your first goals

🗄️ **Database Status:** MongoDB Atlas (persistent storage)
🌐 **Web Interface:** http://localhost:3000

*Your productivity assistant is ready to help! 🎯*`;

      await telegramClient.sendMessage(userId, readyMessage);
    } catch (error) {
      console.error("❌ Error sending ready message:", error);
    }
  }

  async handleMessage(msg) {
    const userId = msg.from;

    // Check if message is from allowed user
    if (this.allowedUserId && msg.from !== this.allowedUserId) {
      console.log("🚫 Unauthorized message from:", msg.from);
      return;
    }

    console.log("📨 Received message:", msg.body, "from:", msg.from);

    try {
      let response = null;

      if (msg.body === "!help") {
        response = await HelpCommand.execute(msg);
      } else if (msg.body === "!today") {
        response = await TodayCommand.execute(msg, userId);
      } else if (msg.body === "!tomorrow") {
        response = await TomorrowCommand.execute(msg, userId);
      } else if (msg.body.startsWith("!setgoals")) {
        response = await GoalsCommand.setGoals(msg, userId);
      } else if (msg.body === "!listgoals") {
        response = await GoalsCommand.listGoals(msg, userId);
      } else if (msg.body.startsWith("!progress")) {
        response = await GoalsCommand.updateProgress(msg, userId);
      } else if (msg.body === "!weekprogress") {
        response = await GoalsCommand.getWeeklyProgress(msg, userId);
      } else if (msg.body.startsWith("!addtask")) {
        response = await TaskCommand.addTask(msg, userId);
      } else if (msg.body.startsWith("!complete")) {
        response = await TaskCommand.completeTask(msg, userId);
      } else if (msg.body.startsWith("!setday")) {
        response = await TaskCommand.setDayTasks(msg, userId);
      } else if (msg.body.startsWith("!setdate")) {
        response = await TaskCommand.setDateTasks(msg, userId);
      } else if (msg.body === "!stats") {
        response = "📊 Statistics feature coming soon!";
      } else if (msg.body === "!prayer") {
        response = await PrayerCommand.execute(msg);
      } else if (msg.body === "!affirmations") {
        response = await AffirmationsCommand.execute(msg);
      }

      if (response) {
        await this.sendReply(msg, response);
      }
    } catch (error) {
      console.error("❌ Error handling message:", error);
      await this.sendReply(msg, "❌ An error occurred. Please try again.");
    }
  }

  async sendReply(msg, text) {
    try {
      await msg.reply(text);
      console.log("✅ Reply sent successfully");
    } catch (error) {
      console.error("❌ Error sending reply:", error);
    }
  }
}

module.exports = MessageController;

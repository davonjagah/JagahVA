require("dotenv").config();
const database = require("./config/database");
const telegramClient = require("./config/telegram");
const expressServer = require("./config/express");
const MessageController = require("./controllers/messageController");

class JagahVABot {
  constructor() {
    this.messageController = new MessageController();
    this.isInitialized = false;
  }

  async initialize() {
    try {
      console.log("🚀 Initializing JagahVA Bot...");

      // Initialize database
      await database.initialize();

      // Set up MongoDB connection notification
      database.onConnect(async () => {
        try {
          const allowedUserId = process.env.ALLOWED_USER_ID;
          if (allowedUserId) {
            await this.messageController.sendReadyMessage(allowedUserId);
            console.log("✅ Ready message sent to user");
          }
        } catch (error) {
          console.log("⚠️ Could not send ready message:", error.message);
        }
      });

      // Setup Express server
      expressServer.setup();
      expressServer.messageController = this.messageController; // Pass message controller
      expressServer.start();

      // Initialize Telegram bot and setup handlers
      await telegramClient.initialize();
      telegramClient.setupEventHandlers(this.messageController);

      this.isInitialized = true;
      console.log("✅ JagahVA Bot initialized successfully!");
    } catch (error) {
      console.error("❌ Failed to initialize JagahVA Bot:", error);
      process.exit(1);
    }
  }

  async start() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    console.log("🤖 JagahVA Bot is running!");
    console.log("📱 Send /start or !help to see available commands");
    console.log("🌐 Web interface: http://localhost:3000");

    // Fallback ready message for local development
    if (process.env.NODE_ENV !== "production") {
      setTimeout(async () => {
        try {
          const allowedUserId = process.env.ALLOWED_USER_ID;
          if (allowedUserId) {
            await this.messageController.sendReadyMessage(allowedUserId);
            console.log("✅ Fallback ready message sent to user");
          }
        } catch (error) {
          console.log(
            "⚠️ Could not send fallback ready message:",
            error.message
          );
        }
      }, 3000); // Wait 3 seconds to ensure everything is initialized
    }
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down JagahVA Bot...");
  try {
    await telegramClient.stop();
    await database.close();
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
  }
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down JagahVA Bot...");
  try {
    await telegramClient.stop();
    await database.close();
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
  }
  process.exit(0);
});

// Start the bot
const bot = new JagahVABot();
bot.start().catch(console.error);

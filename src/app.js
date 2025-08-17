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

      // Initialize Telegram bot
      const bot = telegramClient.createBot();

      // Setup Express server
      expressServer.setup();
      expressServer.start();

      // Setup Telegram event handlers
      telegramClient.setupEventHandlers(this.messageController);

      // Initialize Telegram connection
      await telegramClient.initialize();

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
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down JagahVA Bot...");
  try {
    await telegramClient.stop();
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
  }
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down JagahVA Bot...");
  try {
    await telegramClient.stop();
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
  }
  process.exit(0);
});

// Start the bot
const bot = new JagahVABot();
bot.start().catch(console.error);

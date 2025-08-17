require("dotenv").config();
const database = require("./config/database");
const whatsappClient = require("./config/whatsapp");
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

      // Initialize WhatsApp client
      const client = whatsappClient.createClient();

      // Setup Express server
      expressServer.setup();
      expressServer.start();

      // Setup message handler
      client.on("message", async (msg) => {
        await this.messageController.handleMessage(msg);
      });

      // Initialize WhatsApp connection
      await whatsappClient.initialize();

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
    console.log("📱 Send !help to see available commands");
    console.log("🌐 Web interface: http://localhost:3000");
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down JagahVA Bot...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down JagahVA Bot...");
  process.exit(0);
});

// Start the bot
const bot = new JagahVABot();
bot.start().catch(console.error);

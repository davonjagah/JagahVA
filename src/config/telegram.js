const TelegramBot = require("node-telegram-bot-api");

class TelegramClient {
  constructor() {
    this.bot = null;
    this.allowedUserId = null;
    this.isInitialized = false;
  }

  createBot() {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      throw new Error("TELEGRAM_BOT_TOKEN environment variable is required");
    }

    this.bot = new TelegramBot(token, { polling: true });
    this.allowedUserId = process.env.ALLOWED_USER_ID;

    console.log("🤖 Telegram bot created successfully");
    return this.bot;
  }

  setupEventHandlers(messageController) {
    if (!this.bot) {
      throw new Error("Bot not initialized. Call createBot() first.");
    }

    // Handle incoming messages
    this.bot.on("message", async (msg) => {
      const userId = msg.from.id.toString();

      // Check if message is from allowed user
      if (this.allowedUserId && userId !== this.allowedUserId) {
        console.log("🚫 Unauthorized message from:", userId);
        return;
      }

      console.log("📨 Received message:", msg.text, "from:", userId);

      try {
        // Convert Telegram message to our expected format
        const convertedMsg = {
          from: userId,
          body: msg.text || "",
          reply: async (text) => {
            await this.bot.sendMessage(msg.chat.id, text);
          },
        };

        await messageController.handleMessage(convertedMsg);
      } catch (error) {
        console.error("❌ Error handling message:", error);
        await this.bot.sendMessage(
          msg.chat.id,
          "❌ An error occurred. Please try again."
        );
      }
    });

    // Handle bot start command
    this.bot.onText(/\/start/, async (msg) => {
      const userId = msg.from.id.toString();

      if (this.allowedUserId && userId !== this.allowedUserId) {
        await this.bot.sendMessage(msg.chat.id, "🚫 Unauthorized access");
        return;
      }

      const welcomeMessage = `🚀 Welcome to JagahVA Bot!

I'm your personal productivity assistant. Here are some commands to get started:

🎯 !setgoals - Set your goals
📅 !today - Get today's tasks
📝 !progress - Mark goals as completed
❓ !help - Show all commands

Start by setting your goals with: !setgoals workout 3 times a week, read daily`;

      await this.bot.sendMessage(msg.chat.id, welcomeMessage);
    });

    // Handle errors
    this.bot.on("error", (error) => {
      console.error("❌ Telegram bot error:", error);
    });

    // Handle polling errors
    this.bot.on("polling_error", (error) => {
      console.error("❌ Telegram polling error:", error);

      // Handle specific conflict error (multiple bot instances)
      if (error.code === "ETELEGRAM" && error.response && error.response.body) {
        const errorBody = error.response.body;
        if (
          errorBody.error_code === 409 &&
          errorBody.description.includes("Conflict")
        ) {
          console.error("🚨 CONFLICT: Multiple bot instances detected!");
          console.error(
            "💡 Solution: Stop other bot instances or wait 5 minutes"
          );
          console.error(
            "🔧 If deploying to Render, ensure only one instance is running"
          );

          // Wait 30 seconds before retrying
          setTimeout(() => {
            console.log("🔄 Retrying bot connection...");
            this.bot.stopPolling();
            setTimeout(() => {
              this.bot.startPolling();
            }, 5000);
          }, 30000);
        }
      }
    });

    console.log("✅ Telegram event handlers set up successfully");
  }

  async initialize() {
    try {
      // Prevent multiple initializations
      if (this.isInitialized) {
        console.log("⚠️ Bot already initialized, skipping...");
        return this.bot;
      }

      // Create bot only if it doesn't exist
      if (!this.bot) {
        this.createBot();
      }

      console.log("🔄 Initializing Telegram bot...");

      // Test the bot connection
      const me = await this.bot.getMe();
      console.log("✅ Telegram bot initialized successfully");
      console.log(`🤖 Bot name: ${me.first_name}`);
      console.log(`🆔 Bot username: @${me.username}`);
      console.log("📱 Bot is ready to receive messages!");

      this.isInitialized = true;
      return this.bot;
    } catch (error) {
      console.error("❌ Telegram bot initialization failed:", error);
      throw error;
    }
  }

  async sendMessage(chatId, text) {
    if (!this.bot) {
      throw new Error("Bot not initialized");
    }

    try {
      await this.bot.sendMessage(chatId, text);
      console.log("✅ Message sent successfully");
    } catch (error) {
      console.error("❌ Error sending message:", error);
      throw error;
    }
  }

  async stop() {
    if (this.bot) {
      try {
        this.bot.stopPolling();
        console.log("🛑 Bot polling stopped");
        this.isInitialized = false;
      } catch (error) {
        console.error("❌ Error stopping bot:", error);
      }
    }
  }
}

module.exports = new TelegramClient();

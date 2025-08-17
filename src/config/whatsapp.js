const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

class WhatsAppClient {
  constructor() {
    this.client = null;
  }

  createClient() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--single-process",
          "--disable-gpu",
          "--disable-extensions",
          "--disable-plugins",
          "--disable-images",
          "--disable-javascript",
          "--disable-background-timer-throttling",
          "--disable-backgrounding-occluded-windows",
          "--disable-renderer-backgrounding",
          "--disable-features=TranslateUI",
          "--disable-ipc-flooding-protection",
        ],
      },
    });

    this.setupEventHandlers();
    return this.client;
  }

  setupEventHandlers() {
    let qrDisplayed = false;

    this.client.on("qr", (qr) => {
      if (!qrDisplayed) {
        // Clear console for better QR code visibility
        console.clear();
        console.log("🚀 JagahVA Bot - WhatsApp Connection");
        console.log("=====================================");
        console.log("\n🔐 QR Code received, scan it with your WhatsApp:");
        console.log(
          "📱 Open WhatsApp → Settings → Linked Devices → Link a Device"
        );
        console.log("📱 Then scan this QR code:\n");

        try {
          qrcode.generate(qr, { small: true });
          console.log("\n⏳ Waiting for you to scan the QR code...");
          console.log(
            "💡 Make sure your phone and computer are on the same network"
          );
          qrDisplayed = true;
        } catch (error) {
          console.error("❌ Error generating QR code:", error);
          console.log("🔗 Manual connection required");
        }
      }
    });

    this.client.on("ready", () => {
      console.log("✅ WhatsApp client is ready!");
      console.log("🤖 Bot is now connected and ready to receive messages!");
      qrDisplayed = false; // Reset for future reconnections
    });

    this.client.on("authenticated", () => {
      console.log("🔐 WhatsApp client authenticated!");
    });

    this.client.on("auth_failure", (msg) => {
      console.error("❌ WhatsApp authentication failed:", msg);
      qrDisplayed = false;
    });

    this.client.on("disconnected", (reason) => {
      console.log("🔌 WhatsApp client disconnected:", reason);
      qrDisplayed = false;

      if (reason === "LOGOUT") {
        console.log("🔄 Reconnecting...");
        setTimeout(() => {
          this.reconnect();
        }, 5000);
      }
    });
  }

  async reconnect() {
    try {
      console.log("🔄 Attempting to reconnect...");
      await this.initialize();
    } catch (error) {
      console.error("❌ Reconnection failed:", error);
    }
  }

  async initialize() {
    try {
      if (!this.client) {
        this.createClient();
      }
      
      // Add timeout for initialization
      const timeout = setTimeout(() => {
        console.error("❌ WhatsApp initialization timeout. Please restart the bot.");
        process.exit(1);
      }, 60000); // 60 seconds timeout
      
      await this.client.initialize();
      clearTimeout(timeout);
      console.log("✅ WhatsApp client initialized successfully");
    } catch (error) {
      console.error("❌ WhatsApp client initialization failed:", error);
      throw error;
    }
  }
}

module.exports = new WhatsAppClient();

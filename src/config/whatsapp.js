const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const qrcodeData = require("qrcode");

class WhatsAppClient {
  constructor() {
    this.client = null;
  }

  createClient() {
    // For production, use Puppeteer's bundled Chromium by default
    let executablePath = undefined;

    if (process.env.NODE_ENV === "production") {
      console.log(
        "🔧 Production environment: Using Puppeteer's bundled Chromium"
      );

      // Only use system Chrome if explicitly set via environment variable
      if (process.env.CHROME_BIN) {
        executablePath = process.env.CHROME_BIN;
        console.log(`🔧 Using custom Chrome path: ${executablePath}`);
      }
    }

    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        executablePath,
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
          "--memory-pressure-off",
          "--max_old_space_size=4096",
        ],
      },
    });

    this.setupEventHandlers();
    return this.client;
  }

  setupEventHandlers() {
    let qrDisplayed = false;
    let qrTimeout = null;

    this.client.on("qr", (qr) => {
      console.log("📱 New QR code received from WhatsApp...");

      if (qrDisplayed) {
        console.log("🔄 QR code already displayed, skipping...");
        console.log(
          "💡 If you need a new QR code, wait 2 minutes or restart the bot"
        );
        return;
      }

      console.log("🔐 QR Code received:", typeof qr, qr.length);
      console.log("🔐 Scan this QR code with WhatsApp:");

      try {
        qrcode.generate(qr, { small: true });
        console.log("✅ QR code generated successfully");
      } catch (error) {
        console.error("❌ Error generating QR code:", error);
      }

      // Also generate data URL for web display
      try {
        qrcodeData.toDataURL(qr, { width: 256, margin: 1 }, (err, dataUrl) => {
          if (err) {
            console.error("❌ Error generating data URL:", err);
          } else {
            console.log("\n🌐 Copy this URL for web display:");
            console.log(dataUrl);
          }
        });
      } catch (error) {
        console.error("❌ Error with data URL generation:", error);
      }

      qrDisplayed = true;

      // Set a timeout to reset the flag if QR expires (2 minutes)
      if (qrTimeout) {
        clearTimeout(qrTimeout);
      }
      // Use shorter timeout in development for testing
      const timeoutDuration =
        process.env.NODE_ENV === "production" ? 120000 : 30000; // 2 min prod, 30 sec dev

      qrTimeout = setTimeout(() => {
        console.log(
          `⏰ QR code expired after ${
            timeoutDuration / 1000
          }s, allowing new QR generation...`
        );
        qrDisplayed = false;
        console.log("🔄 Ready for new QR code when available...");
      }, timeoutDuration);
    });

    this.client.on("ready", () => {
      console.log("✅ WhatsApp client is ready!");
      console.log("🤖 Bot is now connected and ready to receive messages!");

      // Clear QR display state
      qrDisplayed = false;
      if (qrTimeout) {
        clearTimeout(qrTimeout);
        qrTimeout = null;
      }

      // Clear QR code data when connected
      this.qrCode = null;
    });

    this.client.on("authenticated", () => {
      console.log("🔐 WhatsApp client authenticated!");
    });

    this.client.on("auth_failure", (msg) => {
      console.error("❌ WhatsApp authentication failed:", msg);
      qrDisplayed = false;
      if (qrTimeout) {
        clearTimeout(qrTimeout);
        qrTimeout = null;
      }
    });

    this.client.on("disconnected", (reason) => {
      console.log("🔌 WhatsApp client disconnected:", reason);
      qrDisplayed = false;
      if (qrTimeout) {
        clearTimeout(qrTimeout);
        qrTimeout = null;
      }

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

      // Add timeout for initialization (longer for production)
      const timeoutDuration =
        process.env.NODE_ENV === "production" ? 180000 : 60000; // 3 minutes for production, 1 minute for dev
      const timeout = setTimeout(() => {
        console.error(
          `❌ WhatsApp initialization timeout after ${
            timeoutDuration / 1000
          } seconds. Please restart the bot.`
        );
        process.exit(1);
      }, timeoutDuration);

      console.log(
        `🔄 Initializing WhatsApp client (timeout: ${
          timeoutDuration / 1000
        }s)...`
      );
      await this.client.initialize();
      clearTimeout(timeout);
      console.log("✅ WhatsApp client initialized successfully");
    } catch (error) {
      console.error("❌ WhatsApp client initialization failed:", error);

      // Production-specific error handling
      if (process.env.NODE_ENV === "production") {
        console.error("🔧 Production environment detected. Common issues:");
        console.error(
          "   - Using Puppeteer's bundled Chromium (no system Chrome needed)"
        );
        console.error("   - Verify sufficient memory (at least 512MB)");
        console.error("   - Check network connectivity to WhatsApp servers");
        console.error(
          "   - If you want to use system Chrome, set CHROME_BIN environment variable"
        );
      }

      throw error;
    }
  }
}

module.exports = new WhatsAppClient();

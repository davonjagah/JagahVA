const express = require("express");
const path = require("path");

class ExpressServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.messageController = null; // Will be set later
  }

  setup() {
    // Parse JSON bodies for webhook
    this.app.use(express.json());

    // Serve static files from public directory
    this.app.use(express.static(path.join(__dirname, "../../public")));

    // Telegram webhook endpoint
    this.app.post("/webhook", async (req, res) => {
      try {
        if (this.messageController && req.body.message) {
          const msg = req.body.message;
          const userId = msg.from.id.toString();

          // Check if message is from allowed user
          const allowedUserId = process.env.ALLOWED_USER_ID;
          if (allowedUserId && userId !== allowedUserId) {
            console.log("🚫 Unauthorized message from:", userId);
            return res.sendStatus(200);
          }

          console.log(
            "📨 Received webhook message:",
            msg.text,
            "from:",
            userId
          );

          // Convert Telegram message to our expected format
          const convertedMsg = {
            from: userId,
            body: msg.text || "",
            reply: async (text) => {
              try {
                // Import telegram client here to avoid circular dependency
                const telegramClient = require("./telegram");
                await telegramClient.sendMessage(msg.chat.id, text);
                console.log(
                  "✅ Reply sent via webhook:",
                  text.substring(0, 50) + "..."
                );
              } catch (error) {
                console.error("❌ Error sending reply:", error);
                // Fallback: try to send directly
                try {
                  const TelegramBot = require("node-telegram-bot-api");
                  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
                  await bot.sendMessage(msg.chat.id, text);
                  console.log("✅ Fallback reply sent");
                  await bot.close();
                } catch (fallbackError) {
                  console.error("❌ Fallback also failed:", fallbackError);
                }
              }
            },
          };

          await this.messageController.handleMessage(convertedMsg);
        }
        res.sendStatus(200);
      } catch (error) {
        console.error("❌ Error handling webhook:", error);
        res.sendStatus(500);
      }
    });

    // QR code display endpoint
    this.app.get("/qr", (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>JagahVA QR Code</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 20px;
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              max-width: 500px;
              margin: 0 auto;
            }
            .qr-code {
              margin: 20px 0;
              padding: 20px;
              background: #f8f9fa;
              border-radius: 8px;
            }
            .instructions {
              text-align: left;
              background: #e3f2fd;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .status {
              color: #666;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🚀 JagahVA</h1>
                            <h2>Telegram Bot Status</h2>
            
            <div class="qr-code">
              <div id="qrcode"></div>
              <p class="status">QR code will appear here when bot generates it</p>
            </div>
            
            <div class="instructions">
              <h3>📱 How to connect:</h3>
              <ol>
                                          <li>Find your bot on Telegram</li>
                          <li>Send /start to begin</li>
                          <li>Send !help to see commands</li>
                          <li>Start setting your goals!</li>
                          <li>Bot is ready to use</li>
              </ol>
            </div>
            
            <p><strong>Note:</strong> This page will automatically refresh every 5 seconds to check for new QR codes.</p>
          </div>
          
          <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
          <script>
            function checkQRCode() {
              fetch('/api/qr')
                .then(response => response.json())
                .then(data => {
                  const qrDiv = document.getElementById('qrcode');
                  const statusP = document.querySelector('.status');
                  
                  if (data.qr) {
                    qrDiv.innerHTML = '';
                    QRCode.toCanvas(qrDiv, data.qr, {
                      width: 256,
                      margin: 2
                    });
                                            statusP.textContent = '✅ Bot is ready! Send /start on Telegram';
                    statusP.style.color = '#28a745';
                  } else {
                    qrDiv.innerHTML = '<p style="color: #666;">⏳ Waiting for QR code...</p>';
                    statusP.textContent = 'Waiting for bot to generate QR code...';
                    statusP.style.color = '#666';
                  }
                })
                .catch(error => {
                  console.error('Error:', error);
                });
            }
            
            // Check immediately and then every 5 seconds
            checkQRCode();
            setInterval(checkQRCode, 5000);
          </script>
        </body>
        </html>
      `);
    });

    // QR code API endpoint
    this.app.get("/api/qr", (req, res) => {
      // Get bot status
      res.json({
        status: "Bot is running",
        message: "Send /start to your bot on Telegram",
        ready: true,
      });
    });

    // Status endpoint
    this.app.get("/status", (req, res) => {
      res.json({
        status: "Bot is running",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });

    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res.json({ status: "healthy" });
    });

    // Keep-alive endpoint to prevent Render from shutting down
    this.app.get("/ping", (req, res) => {
      res.json({
        status: "pong",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });

    // Root endpoint
    this.app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "../../public/index.html"));
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🌐 Web server running on http://localhost:${this.port}`);

      // Start keep-alive ping for Render free tier
      if (process.env.NODE_ENV === "production") {
        this.startKeepAlive();
      }
    });
  }

  startKeepAlive() {
    const pingInterval = 14 * 60 * 1000; // Ping every 14 minutes (before 15-min timeout)

    setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:${this.port}/ping`);
        if (response.ok) {
          console.log("💓 Keep-alive ping sent successfully");
        }
      } catch (error) {
        console.log("⚠️ Keep-alive ping failed:", error.message);
      }
    }, pingInterval);

    console.log("💓 Keep-alive ping started (every 14 minutes)");
  }
}

module.exports = new ExpressServer();

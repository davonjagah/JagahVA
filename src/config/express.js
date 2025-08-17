const express = require("express");
const path = require("path");

class ExpressServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
  }

  setup() {
    // Serve static files from public directory
    this.app.use(express.static(path.join(__dirname, "../../public")));

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
            <h2>WhatsApp QR Code</h2>
            
            <div class="qr-code">
              <div id="qrcode"></div>
              <p class="status">QR code will appear here when bot generates it</p>
            </div>
            
            <div class="instructions">
              <h3>📱 How to connect:</h3>
              <ol>
                <li>Open WhatsApp on your phone</li>
                <li>Go to Settings → Linked Devices</li>
                <li>Tap "Link a Device"</li>
                <li>Point your camera at the QR code above</li>
                <li>Wait for connection to complete</li>
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
                    statusP.textContent = '✅ QR code ready! Scan with WhatsApp';
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
      // Get QR code from WhatsApp client if available
      const whatsappClient = require("./whatsapp");
      if (whatsappClient.qrCode) {
        res.json({
          qr: whatsappClient.qrCode,
          generated: true,
        });
      } else {
        res.json({
          qr: null,
          generated: false,
          message: "QR code not yet generated",
        });
      }
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

    // Root endpoint
    this.app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "../../public/index.html"));
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🌐 Web server running on http://localhost:${this.port}`);
    });
  }
}

module.exports = new ExpressServer();

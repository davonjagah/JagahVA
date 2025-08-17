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

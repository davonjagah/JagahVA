require("dotenv").config();
const MessageController = require("./src/controllers/messageController");
const database = require("./src/config/database");

async function testCommand() {
  console.log("🧪 Testing command handling...");

  try {
    // Initialize database
    await database.initialize();

    // Create message controller
    const controller = new MessageController();

    // Simulate a message
    const testMsg = {
      from: process.env.ALLOWED_USER_ID,
      body: "!help",
      reply: async (text) => {
        console.log("📤 Bot would reply:", text);
      },
    };

    console.log("🔄 Processing test message:", testMsg.body);
    await controller.handleMessage(testMsg);

    // Test setting goals
    const goalsMsg = {
      from: process.env.ALLOWED_USER_ID,
      body: "!setgoals workout 3 times a week, read daily",
      reply: async (text) => {
        console.log("📤 Bot would reply:", text);
      },
    };

    console.log("🔄 Processing goals message:", goalsMsg.body);
    await controller.handleMessage(goalsMsg);

    // Test getting today's tasks
    const todayMsg = {
      from: process.env.ALLOWED_USER_ID,
      body: "!today",
      reply: async (text) => {
        console.log("📤 Bot would reply:", text);
      },
    };

    console.log("🔄 Processing today message:", todayMsg.body);
    await controller.handleMessage(todayMsg);

    console.log("✅ Command testing completed");
  } catch (error) {
    console.error("❌ Command test failed:", error);
  }
}

testCommand().catch(console.error);

require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

async function testBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const allowedUserId = process.env.ALLOWED_USER_ID;

  if (!token) {
    console.error("❌ TELEGRAM_BOT_TOKEN not found");
    return;
  }

  if (!allowedUserId) {
    console.error("❌ ALLOWED_USER_ID not found");
    return;
  }

  console.log("🔄 Testing bot connection...");
  console.log("Token:", token.substring(0, 10) + "...");
  console.log("Allowed User ID:", allowedUserId);

  try {
    const bot = new TelegramBot(token, { polling: false });

    // Test bot info
    const me = await bot.getMe();
    console.log("✅ Bot connection successful");
    console.log("🤖 Bot name:", me.first_name);
    console.log("🆔 Bot username:", me.username);

    // Test sending a message
    console.log("🔄 Testing message sending...");
    await bot.sendMessage(
      allowedUserId,
      "🧪 Test message from JagahVA bot - MongoDB integration test"
    );
    console.log("✅ Test message sent successfully");

    await bot.close();
    console.log("✅ Bot test completed successfully");
  } catch (error) {
    console.error("❌ Bot test failed:", error.message);
  }
}

testBot().catch(console.error);

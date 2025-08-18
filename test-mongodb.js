require("dotenv").config();
const { MongoClient } = require("mongodb");

async function testMongoDB() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.error("❌ MONGODB_URI not found in environment variables");
    return;
  }

  console.log("🔄 Testing MongoDB connection...");
  console.log("URI:", mongoUri.replace(/\/\/.*@/, "//***:***@")); // Hide credentials

  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    
    const db = client.db("jagahva");
    const collection = db.collection("users");
    
    console.log("✅ Connected to MongoDB successfully");
    
    // Test write operation
    const testUserId = "test-user-123";
    const testData = {
      goals: [{ task: "Test goal", frequency: "daily", count: 1 }],
      todos: {},
      stats: {}
    };
    
    console.log("🔄 Testing write operation...");
    await collection.updateOne(
      { userId: testUserId },
      { $set: { userId: testUserId, data: testData } },
      { upsert: true }
    );
    console.log("✅ Write operation successful");
    
    // Test read operation
    console.log("🔄 Testing read operation...");
    const result = await collection.findOne({ userId: testUserId });
    console.log("✅ Read operation successful");
    console.log("📊 Retrieved data:", JSON.stringify(result, null, 2));
    
    // Clean up test data
    console.log("🔄 Cleaning up test data...");
    await collection.deleteOne({ userId: testUserId });
    console.log("✅ Test data cleaned up");
    
    await client.close();
    console.log("✅ MongoDB test completed successfully");
    
  } catch (error) {
    console.error("❌ MongoDB test failed:", error);
  }
}

testMongoDB().catch(console.error); 
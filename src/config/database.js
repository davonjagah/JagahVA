const { MongoClient } = require("mongodb");

class Database {
  constructor() {
    this.client = null;
    this.db = null;
    this.collection = null;
    this.isConnected = false;
    this.onConnectCallback = null;
  }

  onConnect(callback) {
    this.onConnectCallback = callback;
  }

  async initialize() {
    try {
      const mongoUri = process.env.MONGODB_URI;

      if (!mongoUri) {
        console.log(
          "⚠️ MONGODB_URI not found, falling back to local file storage"
        );
        return this.initializeLocal();
      }

      console.log("🔄 Connecting to MongoDB Atlas...");

      this.client = new MongoClient(mongoUri);

      await this.client.connect();
      this.db = this.client.db("jagahva");
      this.collection = this.db.collection("users");
      this.isConnected = true;

      console.log("✅ Connected to MongoDB Atlas successfully");

      // Create indexes for better performance
      await this.collection.createIndex({ userId: 1 }, { unique: true });

      // Notify connection success
      if (this.onConnectCallback) {
        this.onConnectCallback();
      }
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error);
      console.log("🔄 Falling back to local file storage...");
      return this.initializeLocal();
    }
  }

  async initializeLocal() {
    // Fallback to original LowDB implementation
    const { Low } = require("lowdb");
    const { JSONFile } = require("lowdb/node");

    this.adapter = new JSONFile("db.json");
    this.db = new Low(this.adapter, { users: {} });
    await this.db.read();
    await this.db.write();
    console.log("✅ Local database initialized successfully");
  }

  async getUser(userId) {
    if (this.isConnected) {
      console.log(`🔍 Getting user data for: ${userId}`);
      const user = await this.collection.findOne({ userId });
      console.log(`📊 User data found:`, user ? "Yes" : "No");
      return user?.data || { goals: [], todos: {}, stats: {} };
    } else {
      console.log(`🔍 Getting local user data for: ${userId}`);
      return (
        this.db?.data?.users[userId] || { goals: [], todos: {}, stats: {} }
      );
    }
  }

  async saveUser(userId, userData) {
    if (this.isConnected) {
      console.log(`💾 Saving user data for: ${userId}`);
      console.log(`📝 Data to save:`, JSON.stringify(userData, null, 2));
      await this.collection.updateOne(
        { userId },
        { $set: { userId, data: userData } },
        { upsert: true }
      );
      console.log(`✅ User data saved successfully for: ${userId}`);
    } else {
      console.log(`💾 Saving local user data for: ${userId}`);
      if (!this.db.data.users[userId]) {
        this.db.data.users[userId] = {};
      }
      this.db.data.users[userId] = userData;
      await this.db.write();
      console.log(`✅ Local user data saved successfully for: ${userId}`);
    }
  }

  async getAllUsers() {
    if (this.isConnected) {
      const users = await this.collection.find({}).toArray();
      const result = {};
      users.forEach((user) => {
        result[user.userId] = user.data;
      });
      return result;
    } else {
      return this.db?.data?.users || {};
    }
  }

  async write() {
    // This method is kept for backward compatibility
    if (!this.isConnected) {
      await this.db.write();
    }
  }

  get data() {
    // This is kept for backward compatibility
    if (this.isConnected) {
      console.warn(
        "⚠️ Using .data property with MongoDB - consider using getUser() instead"
      );
      return { users: {} }; // Return empty object as we can't easily get all users here
    } else {
      return this.db?.data || { users: {} };
    }
  }

  set data(value) {
    // This is kept for backward compatibility
    if (this.isConnected) {
      console.warn(
        "⚠️ Using .data property with MongoDB - consider using saveUser() instead"
      );
    } else {
      if (this.db) {
        this.db.data = value;
      }
    }
  }

  async close() {
    if (this.client) {
      await this.client.close();
      console.log("�� MongoDB connection closed");
    }
  }
}

module.exports = new Database();

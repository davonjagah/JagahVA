const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");

class Database {
  constructor() {
    this.db = null;
    this.adapter = new JSONFile("db.json");
  }

  async initialize() {
    try {
      this.db = new Low(this.adapter, { users: {} });
      await this.db.read();
      await this.db.write();
      console.log("✅ Database initialized successfully");
    } catch (error) {
      console.error("❌ Database initialization failed:", error);
      throw error;
    }
  }

  async write() {
    if (this.db) {
      await this.db.write();
    }
  }

  get data() {
    return this.db?.data || { users: {} };
  }

  set data(value) {
    if (this.db) {
      this.db.data = value;
    }
  }
}

module.exports = new Database();

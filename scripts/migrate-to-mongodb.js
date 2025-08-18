#!/usr/bin/env node

/**
 * Migration script to move data from local db.json to MongoDB Atlas
 * Usage: node scripts/migrate-to-mongodb.js
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

async function migrateToMongoDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("❌ MONGODB_URI environment variable not found");
    console.log(
      "💡 Please set up MongoDB Atlas and add MONGODB_URI to your .env file"
    );
    process.exit(1);
  }

  const dbPath = path.join(__dirname, "../db.json");

  if (!fs.existsSync(dbPath)) {
    console.log("ℹ️ No db.json file found. Nothing to migrate.");
    return;
  }

  try {
    console.log("🔄 Reading local database...");
    const localData = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    if (!localData.users || Object.keys(localData.users).length === 0) {
      console.log("ℹ️ No user data found in db.json. Nothing to migrate.");
      return;
    }

    console.log("🔄 Connecting to MongoDB Atlas...");
    const client = new MongoClient(mongoUri);
    await client.connect();

    const db = client.db("jagahva");
    const collection = db.collection("users");

    console.log("🔄 Migrating user data...");
    let migratedCount = 0;

    for (const [userId, userData] of Object.entries(localData.users)) {
      await collection.updateOne(
        { userId },
        { $set: { userId, data: userData } },
        { upsert: true }
      );
      migratedCount++;
      console.log(`✅ Migrated user: ${userId}`);
    }

    await client.close();

    console.log(
      `🎉 Migration completed! ${migratedCount} users migrated to MongoDB Atlas`
    );
    console.log("💡 You can now safely delete db.json if you want");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration
migrateToMongoDB().catch(console.error);

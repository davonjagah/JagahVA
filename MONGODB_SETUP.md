# 🗄️ MongoDB Atlas Setup Guide for JagahVA

## 📋 Overview

This guide will help you set up MongoDB Atlas (cloud database) for your JagahVA bot to ensure data persistence across deployments.

## 🚀 Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" or "Sign Up"
3. Create an account (free tier available)

## 🏗️ Step 2: Create a Cluster

1. **Choose Plan**: Select "FREE" tier (M0)
2. **Cloud Provider**: Choose AWS, Google Cloud, or Azure
3. **Region**: Select closest to your Render deployment
4. **Cluster Name**: `jagahva-cluster`
5. Click "Create"

## 🔐 Step 3: Set Up Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. **Username**: `jagahva-user`
4. **Password**: Generate a strong password (save it!)
5. **Database User Privileges**: Select "Read and write to any database"
6. Click "Add User"

## 🌐 Step 4: Set Up Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. **Access List Entry**: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

## 🔗 Step 5: Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. **Driver**: Node.js
5. **Version**: 6.0 or later
6. Copy the connection string

## 🔧 Step 6: Configure Environment Variables

### For Local Development
Create/update your `.env` file:
```env
MONGODB_URI=mongodb+srv://jagahva-user:YOUR_PASSWORD@jagahva-cluster.xxxxx.mongodb.net/jagahva?retryWrites=true&w=majority
```

### For Render Deployment
Add to your Render environment variables:
```env
MONGODB_URI=mongodb+srv://jagahva-user:YOUR_PASSWORD@jagahva-cluster.xxxxx.mongodb.net/jagahva?retryWrites=true&w=majority
NODE_ENV=production
```

## 📦 Step 7: Install Dependencies

The MongoDB driver is already added to `package.json`. Install it:

```bash
npm install
```

## ✅ Step 8: Test the Setup

1. Start your bot locally:
```bash
npm start
```

2. Check the logs for:
```
🔄 Connecting to MongoDB Atlas...
✅ Connected to MongoDB Atlas successfully
```

## 🔍 Step 9: Verify Data Persistence

1. Set some goals using your bot
2. Restart the bot
3. Check if your goals are still there

## 🚨 Troubleshooting

### Connection Issues
- **Error**: "MongoNetworkError: connect ECONNREFUSED"
  - **Solution**: Check if your IP is whitelisted in Network Access

### Authentication Issues
- **Error**: "MongoServerError: Authentication failed"
  - **Solution**: Verify username/password in connection string

### Timeout Issues
- **Error**: "MongoServerSelectionError: Server selection timed out"
  - **Solution**: Check if cluster is running and accessible

## 📊 Database Structure

Your data will be stored in the following structure:

```json
{
  "users": {
    "userId1": {
      "goals": [...],
      "todos": {...},
      "stats": {...},
      "dayTasks": {...},
      "dateTasks": {...}
    }
  }
}
```

## 💡 Tips

1. **Free Tier Limits**: 512MB storage, shared RAM
2. **Backup**: MongoDB Atlas provides automatic backups
3. **Monitoring**: Use Atlas dashboard to monitor usage
4. **Scaling**: Easy to upgrade when you need more resources

## 🔄 Migration from Local Database

If you have existing data in `db.json`:

1. The bot will automatically fall back to local storage if MongoDB is not configured
2. Once MongoDB is set up, new data will be stored there
3. Old data will remain in `db.json` until you manually migrate it

## 🆘 Support

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/)
- [Render Environment Variables](https://render.com/docs/environment-variables)

---

**Happy Database Setup! 🎉** 
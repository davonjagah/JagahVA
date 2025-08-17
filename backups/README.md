# Backups Directory

This directory contains backup files and previous versions of the JagahVA bot.

## 📁 Files

### `bot.js.backup`
Backup of the original monolithic bot.js file before refactoring.

### `test-db.json`
Test database file used during development.

## 🔄 Backup Strategy

- **Database Backups**: Consider backing up `db.json` regularly
- **Code Backups**: Important versions are stored here
- **Configuration**: Keep copies of working `.env` files

## 💾 Creating Backups

```bash
# Backup database
cp db.json backups/db-$(date +%Y%m%d).json

# Backup configuration
cp .env backups/env-$(date +%Y%m%d).env
```

## 🔍 Restoring

```bash
# Restore database
cp backups/db-20250817.json db.json

# Restore configuration
cp backups/env-20250817.env .env
``` 
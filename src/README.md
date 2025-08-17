# JagahVA Bot - Source Code Structure

## 📁 Directory Structure

```
src/
├── config/           # Configuration files
│   ├── database.js   # Database configuration (lowdb)
│   ├── express.js    # Express server configuration
│   └── whatsapp.js   # WhatsApp client configuration
├── controllers/      # Request handlers
│   └── messageController.js  # Main message handler
├── commands/         # Command implementations
│   ├── helpCommand.js
│   ├── todayCommand.js
│   ├── tomorrowCommand.js
│   ├── goalsCommand.js
│   └── taskCommand.js
├── services/         # Business logic
│   ├── todoService.js    # Task management
│   └── goalService.js    # Goal management
├── utils/            # Utility functions
│   ├── dateUtils.js      # Date handling
│   └── parser.js         # Text parsing
├── app.js           # Main application
└── index.js         # Module exports
```

## 🏗️ Architecture Overview

### **Configuration Layer** (`config/`)
- **database.js**: LowDB setup and initialization
- **express.js**: Web server configuration
- **whatsapp.js**: WhatsApp Web client setup

### **Controller Layer** (`controllers/`)
- **messageController.js**: Routes incoming messages to appropriate commands

### **Command Layer** (`commands/`)
- Each command is a separate class with static methods
- Commands handle specific bot functionalities
- Easy to add new commands

### **Service Layer** (`services/`)
- **todoService.js**: Task generation, management, and persistence
- **goalService.js**: Goal setting, progress tracking, and statistics

### **Utility Layer** (`utils/`)
- **dateUtils.js**: Date manipulation and formatting
- **parser.js**: Text parsing for goals and progress

## 🔧 Key Features

### **Modular Design**
- Each component has a single responsibility
- Easy to test and maintain
- Clear separation of concerns

### **Error Handling**
- Comprehensive error handling at each layer
- Graceful degradation
- User-friendly error messages

### **Database Management**
- Centralized database operations
- Automatic initialization
- Data persistence

### **Command System**
- Extensible command architecture
- Easy to add new commands
- Consistent response format

## 🚀 Adding New Features

### **New Command**
1. Create new file in `commands/`
2. Implement static `execute()` method
3. Add to `messageController.js`

### **New Service**
1. Create new file in `services/`
2. Implement business logic
3. Import in relevant commands

### **New Utility**
1. Create new file in `utils/`
2. Implement utility functions
3. Import where needed

## 📝 Code Standards

- **ES6+ Classes**: Use classes for organization
- **Async/Await**: Use for all async operations
- **Error Handling**: Try-catch blocks everywhere
- **Logging**: Console logs for debugging
- **Comments**: Clear documentation

## 🔄 Data Flow

1. **Message Received** → `messageController.js`
2. **Command Routing** → Appropriate command class
3. **Business Logic** → Service layer
4. **Data Operations** → Database layer
5. **Response** → User via WhatsApp

This structure ensures maintainability, scalability, and ease of testing. 
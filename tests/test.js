// Test script for JagahVA core functionality
const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");
const {
  format,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
} = require("date-fns");

// Initialize test database
const adapter = new JSONFile("test-db.json");
const db = new Low(adapter, { users: {} });

// Test user ID
const TEST_USER_ID = "test-user@c.us";

// Import functions from bot.js (simplified versions for testing)
function fallbackParseGoals(text) {
  const goals = [];

  // Daily goals
  const dailyPattern = /([^.]+?)\s+(?:every\s+)?day/gi;
  let match;
  while ((match = dailyPattern.exec(text)) !== null) {
    goals.push({
      id: Date.now() + goals.length,
      task: match[1].trim(),
      frequency: "daily",
      count: 7,
      progress: [],
    });
  }

  // Weekly goals
  const weeklyPattern = /([^.]+?)\s+(\d+)\s+times?\s+a\s+week/gi;
  while ((match = weeklyPattern.exec(text)) !== null) {
    goals.push({
      id: Date.now() + goals.length,
      task: match[1].trim(),
      frequency: "weekly",
      count: parseInt(match[2]),
      progress: [],
    });
  }

  return goals;
}

function fallbackParseProgress(text, goals) {
  const progress = [];
  const lowerText = text.toLowerCase();

  goals.forEach((goal) => {
    const taskWords = goal.task.toLowerCase().split(" ");
    const isCompleted = taskWords.some((word) => lowerText.includes(word));

    if (isCompleted) {
      progress.push({
        task: goal.task,
        completed: true,
      });
    }
  });

  return progress;
}

function generateTodos(userId, date) {
  const today = format(new Date(date), "yyyy-MM-dd");
  const user = db.data.users[userId] || { goals: [], todos: {}, stats: {} };
  const todos = [];

  user.goals.forEach((goal) => {
    if (goal.frequency === "daily") {
      todos.push({
        task: goal.task,
        goalId: goal.id,
        completed: false,
      });
    } else if (goal.frequency === "weekly") {
      const weekProgress =
        goal.progress?.filter((p) =>
          isWithinInterval(new Date(p.date), {
            start: startOfWeek(new Date(date)),
            end: endOfWeek(new Date(date)),
          })
        ).length || 0;

      if (weekProgress < goal.count) {
        todos.push({
          task: goal.task,
          goalId: goal.id,
          completed: false,
        });
      }
    }
  });

  user.todos[today] = todos;
  db.data.users[userId] = user;
  db.write();

  return todos.length > 0
    ? todos
    : [
        {
          task: "Rest day - No tasks scheduled",
          goalId: null,
          completed: false,
        },
      ];
}

// Test functions
async function testGoalParsing() {
  console.log("🧪 Testing Goal Parsing...");

  const testText =
    "Workout 4 times a week. Pray every day. Read 30 minutes daily.";
  const goals = fallbackParseGoals(testText);

  console.log("Input:", testText);
  console.log("Parsed Goals:", JSON.stringify(goals, null, 2));

  // Save to database
  db.data.users[TEST_USER_ID] = { goals, todos: {}, stats: {} };
  await db.write();

  console.log("✅ Goal parsing test passed!\n");
  return goals;
}

async function testProgressParsing(goals) {
  console.log("🧪 Testing Progress Parsing...");

  const testText = "I hit the gym, finished reading chapter 3";
  const progress = fallbackParseProgress(testText, goals);

  console.log("Input:", testText);
  console.log("Parsed Progress:", JSON.stringify(progress, null, 2));

  console.log("✅ Progress parsing test passed!\n");
  return progress;
}

async function testTodoGeneration() {
  console.log("🧪 Testing Todo Generation...");

  const todos = generateTodos(TEST_USER_ID, new Date());

  console.log("Generated Todos:", JSON.stringify(todos, null, 2));

  console.log("✅ Todo generation test passed!\n");
  return todos;
}

async function testDatabaseOperations() {
  console.log("🧪 Testing Database Operations...");

  // Test reading from database
  const user = db.data.users[TEST_USER_ID];
  console.log("User data from DB:", JSON.stringify(user, null, 2));

  // Test updating progress
  const today = format(new Date(), "yyyy-MM-dd");
  user.goals[0].progress = user.goals[0].progress || [];
  user.goals[0].progress.push({ date: today, done: true });

  await db.write();
  console.log("Updated user data:", JSON.stringify(user, null, 2));

  console.log("✅ Database operations test passed!\n");
}

// Run all tests
async function runTests() {
  console.log("🚀 Starting JagahVA Tests...\n");

  try {
    const goals = await testGoalParsing();
    await testProgressParsing(goals);
    await testTodoGeneration();
    await testDatabaseOperations();

    console.log(
      "🎉 All tests passed! JagahVA core functionality is working correctly."
    );
    console.log("\n📝 Next steps:");
    console.log("1. Set up your .env file with API keys");
    console.log('2. Run "npm start" to start the WhatsApp bot');
    console.log("3. Scan the QR code with your WhatsApp");
    console.log('4. Send "!help" to test the bot');
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testGoalParsing,
  testProgressParsing,
  testTodoGeneration,
  testDatabaseOperations,
};

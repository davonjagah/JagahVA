const todoService = require("../services/todoService");
const DateUtils = require("../utils/dateUtils");

class TodayCommand {
  static async execute(msg, userId) {
    console.log("📅 Generating today's tasks for user:", userId);
    const todos = await todoService.generateTodos(userId);

    if (todos.length === 0) {
      return "📝 No tasks for today. Use !setgoals to get started!";
    }

    const todayFormatted = DateUtils.formatDateReadable(new Date());
    const response = `📅 Today's Tasks (${todayFormatted}):\n\n${todos
      .map((t, i) => {
        let taskText = `${i + 1}. ${t.task}`;
        if (t.weeklyProgress !== null && t.weeklyProgress !== undefined) {
          taskText += ` (${t.weeklyProgress} this week)`;
        }
        taskText += ` - ${t.completed ? "✅ Done" : "⏳ Pending"}`;
        return taskText;
      })
      .join("\n")}\n\nUse !progress <numbers> to mark goals as completed.`;

    return response;
  }
}

module.exports = TodayCommand;

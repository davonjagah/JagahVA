const todoService = require("../services/todoService");
const DateUtils = require("../utils/dateUtils");

class TomorrowCommand {
  static async execute(msg, userId) {
    const tomorrow = DateUtils.getTomorrow();

    console.log("📅 Generating tomorrow's tasks for user:", userId);
    const todos = await todoService.generateTodos(userId, tomorrow);

    const tomorrowFormatted = DateUtils.formatDateReadable(tomorrow);
    const response = `📅 Tomorrow's Tasks (${tomorrowFormatted}):\n\n${todos
      .map((t, i) => {
        let taskText = `${i + 1}. ${t.task}`;
        if (t.weeklyProgress) {
          taskText += ` (${t.weeklyProgress} this week)`;
        }
        taskText += ` - ⏳ Pending`;
        return taskText;
      })
      .join("\n")}\n\nUse !today to see today's tasks.`;

    return response;
  }
}

module.exports = TomorrowCommand;

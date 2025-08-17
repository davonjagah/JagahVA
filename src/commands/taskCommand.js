const todoService = require("../services/todoService");
const DateUtils = require("../utils/dateUtils");

class TaskCommand {
  static async addTask(msg, userId) {
    const taskText = msg.body.slice(9).trim();
    if (!taskText) {
      return "Please provide a task. Example: !addtask Buy groceries";
    }

    try {
      await todoService.addManualTask(userId, taskText);
      return `✅ Task added: ${taskText}\n\nUse !today to see all your tasks.`;
    } catch (error) {
      return `❌ Error adding task: ${error.message}`;
    }
  }

  static async completeTask(msg, userId) {
    const parts = msg.body.split(" ");
    if (parts.length < 2) {
      return "Usage: !complete <number>\nExample: !complete 1";
    }

    const index = parseInt(parts[1]) - 1;

    try {
      const task = await todoService.toggleTaskCompletion(userId, index);
      const status = task.completed ? "✅ Completed" : "⏳ Pending";
      return `📝 Task updated: ${task.task} - ${status}\n\nUse !today to see all your tasks.`;
    } catch (error) {
      return `❌ Error completing task: ${error.message}`;
    }
  }

  static async setDayTasks(msg, userId) {
    const content = msg.body.slice(9).trim();
    const firstSpace = content.indexOf(" ");

    if (firstSpace === -1) {
      return "Usage: !setday <day> <tasks>\nExample: !setday Monday Gym, Team meeting";
    }

    const day = content.substring(0, firstSpace).toLowerCase();
    const tasksText = content.substring(firstSpace + 1);

    const validDays = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    if (!validDays.includes(day)) {
      return `Invalid day. Use one of: ${validDays.join(", ")}`;
    }

    const tasks = tasksText
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    if (tasks.length === 0) {
      return "Please provide tasks. Example: !setday Monday Gym, Team meeting";
    }

    try {
      await todoService.setDayTasks(userId, day, tasks);
      return `✅ Day tasks set for ${day}:\n${tasks
        .map((t, i) => `${i + 1}. ${t}`)
        .join("\n")}\n\nUse !today to see your tasks.`;
    } catch (error) {
      return `❌ Error setting day tasks: ${error.message}`;
    }
  }

  static async setDateTasks(msg, userId) {
    const content = msg.body.slice(10).trim();

    // Find the date part (look for a pattern like "21 October 2025")
    const dateMatch = content.match(/^(\d{1,2}\s+[A-Za-z]+\s+\d{4})\s+(.+)$/);

    if (!dateMatch) {
      return "Usage: !setdate <date> <tasks>\nExample: !setdate 21 October 2025 Wish Eniola Happy Birthday";
    }

    const dateStr = dateMatch[1];
    const tasksText = dateMatch[2];

    const date = DateUtils.parseDate(dateStr);
    if (!date) {
      return "Invalid date format. Use: DD Month YYYY (e.g., 21 October 2025)";
    }

    const tasks = tasksText
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    if (tasks.length === 0) {
      return "Please provide tasks. Example: !setdate 21 October 2025 Wish Eniola Happy Birthday";
    }

    const dateKey = DateUtils.formatDate(date);

    try {
      await todoService.setDateTasks(userId, dateKey, tasks);
      return `✅ Date tasks set for ${DateUtils.formatDateReadable(
        date
      )}:\n${tasks
        .map((t, i) => `${i + 1}. ${t}`)
        .join("\n")}\n\nUse !today to see your tasks.`;
    } catch (error) {
      return `❌ Error setting date tasks: ${error.message}`;
    }
  }
}

module.exports = TaskCommand;

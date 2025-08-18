const goalService = require("../services/goalService");
const todoService = require("../services/todoService");
const DateUtils = require("../utils/dateUtils");

class GoalsCommand {
  static async setGoals(msg, userId) {
    const goalsText = msg.body.slice(10).trim();
    if (!goalsText) {
      return "Please provide goals. Example: !setgoals workout 3 times a week, read daily";
    }

    try {
      const goals = await goalService.setGoals(userId, goalsText);
      return `✅ Goals set successfully!\n\n${goals
        .map((g, i) => `${i + 1}. ${g.task} (${g.frequency}: ${g.count}x)`)
        .join("\n")}\n\nUse !today to see your tasks.`;
    } catch (error) {
      return `❌ Error setting goals: ${error.message}`;
    }
  }

  static async listGoals(msg, userId) {
    const goals = await goalService.getGoals(userId);

    if (goals.length === 0) {
      return "No goals set yet. Use !setgoals to get started!";
    }

    let response = `🎯 Your Current Goals:\n\n`;

    goals.forEach((goal, index) => {
      const totalProgress = goal.progress?.filter((p) => p.done).length || 0;
      const weeklyProgress =
        goal.progress?.filter(
          (p) => DateUtils.isInCurrentWeek(new Date(p.date)) && p.done
        ).length || 0;

      response += `${index + 1}. ${goal.task}\n`;
      response += `   📊 ${goal.frequency}: ${goal.count}x`;
      if (goal.frequency === "weekly") {
        response += ` (${weeklyProgress}/${goal.count} this week)`;
      }
      response += `\n   📈 Total completed: ${totalProgress} times\n\n`;
    });

    return response;
  }

  static async logProgress(msg, userId) {
    const progressText = msg.body.slice(10).trim();
    if (!progressText) {
      return "Please provide progress. Example: !progress I hit the gym, finished reading";
    }

    try {
      await goalService.logProgress(userId, progressText);
      return "✅ Progress logged successfully! Use !today to see your updated tasks.";
    } catch (error) {
      return `❌ Error logging progress: ${error.message}`;
    }
  }

  static async updateProgress(msg, userId) {
    console.log("🔍 Debug: Original message body:", JSON.stringify(msg.body));

    // Extract everything after "!progress" command
    const progressText = msg.body.replace(/^!progress\s*/i, "").trim();
    console.log(
      "🔍 Debug: Extracted progressText:",
      JSON.stringify(progressText)
    );

    if (!progressText) {
      return "Please provide numbers to mark as completed. Example: !progress 1, 2, 5";
    }

    try {
      // Parse the numbers from the input (e.g., "1, 2, 5" -> [1, 2, 5])
      const numbers = progressText
        .split(",")
        .map((num) => parseInt(num.trim()))
        .filter((num) => !isNaN(num) && num > 0);

      if (numbers.length === 0) {
        return "Please provide valid numbers (e.g., 1, 2, 5)";
      }

      // First try to update goals
      let goalResults = null;
      try {
        goalResults = await goalService.updateProgressByNumbers(
          userId,
          progressText
        );
      } catch (goalError) {
        console.log("No goals to update or goal error:", goalError.message);
      }

      // Then try to update tasks
      let taskResults = null;
      try {
        taskResults = await todoService.updateTasksByNumbers(userId, numbers);
      } catch (taskError) {
        console.log("No tasks to update or task error:", taskError.message);
      }

      // Build response message
      let response = "";
      if (goalResults && typeof goalResults === "number" && goalResults > 0) {
        response += `✅ Goals updated: ${goalResults} goal(s)\n`;
      }
      if (taskResults && Array.isArray(taskResults) && taskResults.length > 0) {
        response += `✅ Tasks updated: ${taskResults.join(", ")}\n`;
      }

      if (!goalResults && !taskResults) {
        return "ℹ️ No goals or tasks found to update.";
      }

      response += "\nUse !today to see your updated tasks.";
      return response;
    } catch (error) {
      return `❌ Error updating progress: ${error.message}`;
    }
  }

  static async getWeeklyProgress(msg, userId) {
    const weeklyGoals = await goalService.getWeeklyProgress(userId);

    if (weeklyGoals.length === 0) {
      return "No weekly goals set. Use !setgoals to get started!";
    }

    let response = `📊 Weekly Progress (${DateUtils.formatDateReadable(
      DateUtils.getCurrentWeekStart()
    )} - ${DateUtils.formatDateReadable(DateUtils.getCurrentWeekEnd())}):\n\n`;

    weeklyGoals.forEach((goal, index) => {
      const progressBar = this.createProgressBar(goal.percentage);
      response += `${index + 1}. ${goal.task}\n`;
      response += `   ${progressBar} ${goal.weeklyProgress}/${goal.count} (${goal.percentage}%)\n`;
      response += `   📈 Total completed: ${goal.totalProgress} times\n\n`;
    });

    return response;
  }

  static createProgressBar(percentage) {
    const filled = Math.round(percentage / 10);
    const empty = 10 - filled;
    return "█".repeat(filled) + "░".repeat(empty);
  }
}

module.exports = GoalsCommand;

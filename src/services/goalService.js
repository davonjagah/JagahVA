const database = require("../config/database");
const Parser = require("../utils/parser");
const DateUtils = require("../utils/dateUtils");

class GoalService {
  async setGoals(userId, goalsText) {
    try {
      const goals = Parser.parseGoals(goalsText);
      const user = await database.getUser(userId);

      if (!user.goals) user.goals = [];
      if (!user.todos) user.todos = {};
      if (!user.stats) user.stats = {};

      user.goals = goals;
      await database.saveUser(userId, user);

      console.log("✅ Goals saved successfully for user:", userId);
      return goals;
    } catch (error) {
      console.error("❌ Error saving goals:", error);
      throw error;
    }
  }

  async getGoals(userId) {
    const user = await database.getUser(userId);
    return user?.goals || [];
  }

  async logProgress(userId, progressText) {
    try {
      const progress = Parser.parseProgress(progressText);
      const user = await database.getUser(userId);

      if (!user || !user.goals || user.goals.length === 0) {
        throw new Error("No goals set. Use !setgoals first.");
      }

      const today = DateUtils.formatDate(new Date());

      // Add progress to each goal
      for (const goal of user.goals) {
        if (!goal.progress) {
          goal.progress = [];
        }

        progress.forEach((p) => {
          goal.progress.push({
            ...p,
            date: today,
          });
        });
      }

      await database.saveUser(userId, user);
      console.log("✅ Progress logged successfully for user:", userId);
      return progress;
    } catch (error) {
      console.error("❌ Error logging progress:", error);
      throw error;
    }
  }

  async getWeeklyProgress(userId) {
    const user = await database.getUser(userId);
    if (!user || !user.goals || user.goals.length === 0) {
      return [];
    }

    const weeklyGoals = user.goals.filter(
      (goal) => goal.frequency === "weekly"
    );

    return weeklyGoals.map((goal) => {
      const weeklyProgress =
        goal.progress?.filter(
          (p) => DateUtils.isInCurrentWeek(new Date(p.date)) && p.done
        ).length || 0;

      const totalProgress = goal.progress?.filter((p) => p.done).length || 0;

      return {
        ...goal,
        weeklyProgress,
        totalProgress,
        percentage: Math.round((weeklyProgress / goal.count) * 100),
      };
    });
  }

  async clearGoals(userId) {
    const user = await database.getUser(userId);
    if (user) {
      user.goals = [];
      await database.saveUser(userId, user);
      console.log("✅ Goals cleared for user:", userId);
    }
  }

  async updateProgressByNumbers(userId, progressText) {
    try {
      const user = await database.getUser(userId);

      if (!user || !user.goals || user.goals.length === 0) {
        throw new Error("No goals set. Use !setgoals first.");
      }

      // Parse the numbers from the input (e.g., "1, 2, 5" -> [1, 2, 5])
      const numbers = progressText
        .split(",")
        .map((num) => parseInt(num.trim()))
        .filter((num) => !isNaN(num) && num > 0);

      if (numbers.length === 0) {
        throw new Error("Please provide valid goal numbers (e.g., 1, 2, 5)");
      }

      const today = DateUtils.formatDate(new Date());
      let updatedCount = 0;

      // Update progress for each specified goal number
      for (const goalNumber of numbers) {
        const goalIndex = goalNumber - 1; // Convert to 0-based index

        if (goalIndex >= 0 && goalIndex < user.goals.length) {
          const goal = user.goals[goalIndex];

          if (!goal.progress) {
            goal.progress = [];
          }

          // Check if already logged today
          const alreadyLogged = goal.progress.some(
            (p) => p.date === today && p.done
          );

          if (!alreadyLogged) {
            goal.progress.push({
              task: goal.task,
              done: true,
              date: today,
            });
            updatedCount++;
          }
        }
      }

      if (updatedCount === 0) {
        return "ℹ️ All specified goals were already completed today.";
      }

      await database.saveUser(userId, user);
      console.log(
        `✅ Progress updated for ${updatedCount} goals for user:`,
        userId
      );
      return updatedCount;
    } catch (error) {
      console.error("❌ Error updating progress:", error);
      throw error;
    }
  }
}

module.exports = new GoalService();

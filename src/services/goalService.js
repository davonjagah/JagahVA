const database = require("../config/database");
const Parser = require("../utils/parser");
const DateUtils = require("../utils/dateUtils");

class GoalService {
  async setGoals(userId, goalsText) {
    try {
      const goals = Parser.parseGoals(goalsText);

      if (!database.data.users[userId]) {
        database.data.users[userId] = { goals: [], todos: {}, stats: {} };
      }

      database.data.users[userId].goals = goals;
      await database.write();

      console.log("✅ Goals saved successfully for user:", userId);
      return goals;
    } catch (error) {
      console.error("❌ Error saving goals:", error);
      throw error;
    }
  }

  async getGoals(userId) {
    const user = database.data.users[userId];
    return user?.goals || [];
  }

  async logProgress(userId, progressText) {
    try {
      const progress = Parser.parseProgress(progressText);
      const user = database.data.users[userId];

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

      await database.write();
      console.log("✅ Progress logged successfully for user:", userId);
      return progress;
    } catch (error) {
      console.error("❌ Error logging progress:", error);
      throw error;
    }
  }

  async getWeeklyProgress(userId) {
    const user = database.data.users[userId];
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
    if (database.data.users[userId]) {
      database.data.users[userId].goals = [];
      await database.write();
      console.log("✅ Goals cleared for user:", userId);
    }
  }
}

module.exports = new GoalService();

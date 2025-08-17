const database = require("../config/database");
const DateUtils = require("../utils/dateUtils");

class TodoService {
  async generateTodos(userId, targetDate = new Date()) {
    const user = database.data.users[userId];
    if (!user || !user.goals || user.goals.length === 0) {
      return [];
    }

    const todos = [];
    const targetDateStr = DateUtils.formatDate(targetDate);
    const dayOfWeek = DateUtils.getDayOfWeek(targetDate);

    // Generate todos from goals
    for (const goal of user.goals) {
      let shouldInclude = false;

      if (goal.frequency === "daily") {
        shouldInclude = true;
      } else if (goal.frequency === "weekly") {
        shouldInclude = DateUtils.isInCurrentWeek(targetDate);
      }

      if (shouldInclude) {
        const weeklyProgress =
          goal.progress?.filter(
            (p) => DateUtils.isInCurrentWeek(new Date(p.date)) && p.done
          ).length || 0;

        todos.push({
          task: goal.task,
          goalId: goal.id || `goal-${Date.now()}`,
          completed: false,
          type: "goal",
          weeklyProgress: goal.frequency === "weekly" ? weeklyProgress : null,
        });
      }
    }

    // Add day-specific tasks
    if (user.dayTasks && user.dayTasks[dayOfWeek]) {
      user.dayTasks[dayOfWeek].forEach((task) => {
        todos.push({
          task,
          goalId: `day-${dayOfWeek}-${Date.now()}`,
          completed: false,
          type: "day",
        });
      });
    }

    // Add date-specific tasks
    if (user.dateTasks && user.dateTasks[targetDateStr]) {
      user.dateTasks[targetDateStr].forEach((task) => {
        todos.push({
          task,
          goalId: `date-${targetDateStr}-${Date.now()}`,
          completed: false,
          type: "date",
        });
      });
    }

    // Add existing todos for the target date
    if (user.todos && user.todos[targetDateStr]) {
      todos.push(...user.todos[targetDateStr]);
    }

    return todos;
  }

  async saveTodos(userId, todos, targetDate = new Date()) {
    const targetDateStr = DateUtils.formatDate(targetDate);

    if (!database.data.users[userId]) {
      database.data.users[userId] = { goals: [], todos: {}, stats: {} };
    }

    database.data.users[userId].todos[targetDateStr] = todos;
    await database.write();
  }

  async addManualTask(userId, taskText) {
    const today = DateUtils.formatDate(new Date());

    if (!database.data.users[userId]) {
      database.data.users[userId] = { goals: [], todos: {}, stats: {} };
    }
    if (!database.data.users[userId].todos[today]) {
      database.data.users[userId].todos[today] = [];
    }

    const newTask = {
      task: taskText,
      goalId: `manual-${Date.now()}`,
      completed: false,
      type: "manual",
    };

    database.data.users[userId].todos[today].push(newTask);
    await database.write();

    return newTask;
  }

  async toggleTaskCompletion(userId, taskIndex, targetDate = new Date()) {
    const targetDateStr = DateUtils.formatDate(targetDate);
    const todos = database.data.users[userId]?.todos[targetDateStr] || [];

    if (taskIndex < 0 || taskIndex >= todos.length) {
      throw new Error(
        `Invalid task number. Available tasks: 1-${todos.length}`
      );
    }

    const task = todos[taskIndex];
    task.completed = !task.completed;
    await database.write();

    return task;
  }

  async setDayTasks(userId, day, tasks) {
    if (!database.data.users[userId]) {
      database.data.users[userId] = { goals: [], todos: {}, stats: {} };
    }
    if (!database.data.users[userId].dayTasks) {
      database.data.users[userId].dayTasks = {};
    }

    database.data.users[userId].dayTasks[day] = tasks;
    await database.write();
  }

  async setDateTasks(userId, dateKey, tasks) {
    if (!database.data.users[userId]) {
      database.data.users[userId] = { goals: [], todos: {}, stats: {} };
    }
    if (!database.data.users[userId].dateTasks) {
      database.data.users[userId].dateTasks = {};
    }

    database.data.users[userId].dateTasks[dateKey] = tasks;
    await database.write();
  }
}

module.exports = new TodoService();

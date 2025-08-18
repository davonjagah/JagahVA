const database = require("../config/database");
const DateUtils = require("../utils/dateUtils");

class TodoService {
  async generateTodos(userId, targetDate = new Date()) {
    const user = await database.getUser(userId);
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
    const user = await database.getUser(userId);

    if (!user.goals) user.goals = [];
    if (!user.todos) user.todos = {};
    if (!user.stats) user.stats = {};

    user.todos[targetDateStr] = todos;
    await database.saveUser(userId, user);
  }

  async addManualTask(userId, taskText) {
    const today = DateUtils.formatDate(new Date());
    const user = await database.getUser(userId);

    if (!user.goals) user.goals = [];
    if (!user.todos) user.todos = {};
    if (!user.stats) user.stats = {};
    if (!user.todos[today]) {
      user.todos[today] = [];
    }

    const newTask = {
      task: taskText,
      goalId: `manual-${Date.now()}`,
      completed: false,
      type: "manual",
    };

    user.todos[today].push(newTask);
    await database.saveUser(userId, user);

    return newTask;
  }

  async toggleTaskCompletion(userId, taskIndex, targetDate = new Date()) {
    const targetDateStr = DateUtils.formatDate(targetDate);
    const user = await database.getUser(userId);
    const todos = user?.todos?.[targetDateStr] || [];

    if (taskIndex < 0 || taskIndex >= todos.length) {
      throw new Error(
        `Invalid task number. Available tasks: 1-${todos.length}`
      );
    }

    const task = todos[taskIndex];
    task.completed = !task.completed;
    await database.saveUser(userId, user);

    return task;
  }

  async setDayTasks(userId, day, tasks) {
    const user = await database.getUser(userId);
    
    if (!user.goals) user.goals = [];
    if (!user.todos) user.todos = {};
    if (!user.stats) user.stats = {};
    if (!user.dayTasks) user.dayTasks = {};

    user.dayTasks[day] = tasks;
    await database.saveUser(userId, user);
  }

  async setDateTasks(userId, dateKey, tasks) {
    const user = await database.getUser(userId);
    
    if (!user.goals) user.goals = [];
    if (!user.todos) user.todos = {};
    if (!user.stats) user.stats = {};
    if (!user.dateTasks) user.dateTasks = {};

    user.dateTasks[dateKey] = tasks;
    await database.saveUser(userId, user);
  }
}

module.exports = new TodoService();

class Parser {
  static parseGoals(text) {
    const goals = [];
    const lines = text
      .split(/[,\n]/)
      .map((line) => line.trim())
      .filter((line) => line);

    for (const line of lines) {
      const goal = this.parseGoalLine(line);
      if (goal) {
        goals.push(goal);
      }
    }

    return goals;
  }

  static parseGoalLine(line) {
    // Match patterns like "workout 3 times a week", "read 10 pages daily", etc.
    const patterns = [
      // "task X times a week"
      /^(.+?)\s+(\d+)\s+times?\s+a\s+week$/i,
      // "task X times weekly"
      /^(.+?)\s+(\d+)\s+times?\s+weekly$/i,
      // "task X times per week"
      /^(.+?)\s+(\d+)\s+times?\s+per\s+week$/i,
      // "task X times weekly"
      /^(.+?)\s+(\d+)\s+times?\s+weekly$/i,
      // "task daily"
      /^(.+?)\s+daily$/i,
      // "task everyday"
      /^(.+?)\s+everyday$/i,
      // "task every day"
      /^(.+?)\s+every\s+day$/i,
      // "task X times daily"
      /^(.+?)\s+(\d+)\s+times?\s+daily$/i,
      // "task X times everyday"
      /^(.+?)\s+(\d+)\s+times?\s+everyday$/i,
      // "task X times every day"
      /^(.+?)\s+(\d+)\s+times?\s+every\s+day$/i,
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        const task = match[1].trim();
        const count = match[2] ? parseInt(match[2]) : 1;
        const frequency = line.toLowerCase().includes("week")
          ? "weekly"
          : "daily";

        return {
          task,
          frequency,
          count,
          progress: [],
        };
      }
    }

    // Fallback: treat as daily goal with count 1
    return {
      task: line,
      frequency: "daily",
      count: 1,
      progress: [],
    };
  }

  static parseProgress(text) {
    const progress = [];
    const lines = text
      .split(/[,\n]/)
      .map((line) => line.trim())
      .filter((line) => line);

    for (const line of lines) {
      const progressItem = this.parseProgressLine(line);
      if (progressItem) {
        progress.push(progressItem);
      }
    }

    return progress;
  }

  static parseProgressLine(line) {
    // Simple progress parsing - mark as done
    return {
      task: line,
      done: true,
      date: new Date().toISOString().split("T")[0],
    };
  }
}

module.exports = Parser;

class HelpCommand {
  static getHelpText() {
    return `🤖 JagahVA Bot Commands:

🎯 GOALS & PROGRESS:
   !setgoals <goals> - Set your goals
      Example: !setgoals workout 3 times a week, read daily
   !listgoals - List all your current goals
   !progress <numbers> - Mark goals as completed
      Example: !progress 1, 2, 5
   !weekprogress - View weekly progress for all goals

📅 TASKS & SCHEDULING:
   !today - Get today's task list
   !tomorrow - Get tomorrow's task list
   !addtask <task> - Add a one-time task for today
      Example: !addtask Buy groceries
   !complete <number> - Mark a specific task as done/undone
      Example: !complete 1

📅 DAY & DATE TASKS:
   !setday <day> <tasks> - Set day-specific tasks
      Example: !setday Monday Gym, Team meeting
   !setdate <date> <tasks> - Set date-specific tasks
      Example: !setdate 21 October 2025 Wish Eniola Happy Birthday

📊 OTHER:
   !stats - View your statistics
   !prayer - Daily prayer
   !affirmations - Daily affirmations
   !help - Show this help message

🌐 Visit the web interface for detailed guidelines!`;
  }

  static async execute(msg) {
    return this.getHelpText();
  }
}

module.exports = HelpCommand;

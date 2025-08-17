class HelpCommand {
  static getHelpText() {
    return `🤖 JagahVA Bot Commands:

🎯 !setgoals <goals> - Set your goals
   Example: !setgoals workout 3 times a week, read daily

📅 !setday <day> <tasks> - Set day-specific tasks
   Example: !setday Monday Gym, Team meeting

📅 !setdate <date> <tasks> - Set date-specific tasks
   Example: !setdate 21 October 2025 Wish Eniola Happy Birthday

📅 !today - Get today's task list
📅 !tomorrow - Get tomorrow's task list

🎯 !listgoals - List all your current goals
📝 !addtask <task> - Add a one-time task for today
✅ !complete <number> - Mark a specific task as done/undone

📊 !weekprogress - View weekly progress for all goals

📝 !progress <numbers> - Mark goals as completed
   Example: !progress 1, 2, 5

📊 !stats - View your statistics
❓ !help - Show this help message

Visit the web interface for detailed guidelines!`;
  }

  static async execute(msg) {
    return this.getHelpText();
  }
}

module.exports = HelpCommand; 
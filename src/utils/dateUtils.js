const {
  format,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  isSameWeek,
  getWeek,
} = require("date-fns");

class DateUtils {
  static getCurrentWeekStart() {
    return startOfWeek(new Date(), { weekStartsOn: 0 }); // Sunday = 0
  }

  static getCurrentWeekEnd() {
    return endOfWeek(new Date(), { weekStartsOn: 0 }); // Sunday = 0
  }

  static isInCurrentWeek(date) {
    const weekStart = this.getCurrentWeekStart();
    const weekEnd = this.getCurrentWeekEnd();
    return isWithinInterval(date, { start: weekStart, end: weekEnd });
  }

  static formatDate(date) {
    return format(date, "yyyy-MM-dd");
  }

  static formatDateReadable(date) {
    return format(date, "EEEE, MMMM do");
  }

  static getDayOfWeek(date) {
    return format(date, "EEEE").toLowerCase();
  }

  static parseDate(dateString) {
    // Handle formats like "17 August 2025", "21 October 2025"
    const patterns = [
      // "DD Month YYYY" format
      /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/,
      // "Month DD, YYYY" format
      /^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/,
      // "YYYY-MM-DD" format
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/
    ];

    for (const pattern of patterns) {
      const match = dateString.trim().match(pattern);
      if (match) {
        let day, month, year;
        
        if (pattern.source.includes('\\d{4}')) {
          // "DD Month YYYY" or "Month DD, YYYY" format
          if (pattern.source.includes('\\d{1,2}\\s+[A-Za-z]+\\s+\\d{4}')) {
            // "DD Month YYYY" format
            day = parseInt(match[1]);
            month = match[2];
            year = parseInt(match[3]);
          } else if (pattern.source.includes('[A-Za-z]+\\s+\\d{1,2}')) {
            // "Month DD, YYYY" format
            month = match[1];
            day = parseInt(match[2]);
            year = parseInt(match[3]);
          } else {
            // "YYYY-MM-DD" format
            year = parseInt(match[1]);
            month = parseInt(match[2]) - 1; // Month is 0-indexed
            day = parseInt(match[3]);
          }
        }

        // Convert month name to number
        if (typeof month === 'string') {
          const monthNames = [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'
          ];
          const monthIndex = monthNames.indexOf(month.toLowerCase());
          if (monthIndex === -1) continue;
          month = monthIndex; // Month is 0-indexed
        }

        // Validate date
        if (day < 1 || day > 31 || month < 0 || month > 11 || year < 1900 || year > 2100) {
          continue;
        }

        const date = new Date(year, month, day);
        
        // Check if the date is valid (handles edge cases like February 30)
        if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
          return date;
        }
      }
    }

    // Fallback to native Date parsing
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  static getTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  static getToday() {
    return new Date();
  }
}

module.exports = DateUtils;

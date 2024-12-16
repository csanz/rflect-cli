const chalk = require('chalk');

const styles = {
  // Header
  header: (text) => chalk.inverse.bold.cyan(text),

  // Success message
  success: (text) => chalk.green(text),

  // Error messages
  error: (text) => chalk.red(text),
  warning: (text) => chalk.yellow(text),

  // Info messages
  info: (text) => chalk.blue(text),
  help: (text) => chalk.cyan(text),

  // Data display
  value: (text) => chalk.bold.whiteBright(text),
  date: (text) => chalk.yellow(text),

  // Prompts and questions
  prompt: (text) => chalk.magenta(text),

  // Stats and numbers
  number: (text) => chalk.yellow(text),

  // Entry display formatting
  entryHeader: () => chalk.inverse.bold.blue('\n=== Entry ===\n'),
  entryDate: (date) => `${chalk.bold.white('Date:')} ${chalk.yellow(date)}`,
  entryPrompt: (prompt) =>
    `${chalk.bold.white('Prompt:')} ${chalk.cyan(prompt)}`,
  entryResponse: (response) => `${chalk.bold.white('Response:')} ${response}}`,
  entryStats: (duration, wordCount) =>
    `${chalk.bold.white('Duration:')} ${chalk.green(duration)} minutes | ${chalk.bold.white('Word Count:')} ${chalk.green(wordCount)} words`,
};

module.exports = styles;

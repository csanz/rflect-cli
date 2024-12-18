const chalk = require('chalk');

const styles = {
  // Headers
  header: (text) => chalk.inverse.cyan.bold(text),

  // Status messages
  success: (text) => chalk.green(text),
  error: (text) => chalk.red(text),
  warning: (text) => chalk.yellow(text),

  // Information display
  info: (text) => chalk.cyan(text),
  help: (text) => chalk.blue(text),
  value: (text) => chalk.white(text),
  date: (text) => chalk.yellow(text),
  prompt: (text) => chalk.magenta(text),
  number: (text) => chalk.yellow(text),
  quote: (text) => chalk.italic.magenta(`'${text}'`),
  highlight: (text) => chalk.italic.yellow(`'${text}'`),

  // Entry formatting
  entryHeader: () => chalk.inverse.cyan.bold('\n=== Entry ===\n'),
  entryDate: (date) => `${chalk.white.bold('Date:')} ${chalk.yellow(date)}`,
  entryPrompt: (prompt) => `${chalk.white.bold('Prompt:')} ${chalk.cyan(prompt)}`,
  entryResponse: (response) => `${chalk.white.bold('Response:')} ${chalk.white(response)}`,
  entryStats: (duration, wordCount) =>
    `${chalk.white.bold('Duration:')} ${chalk.yellow(duration)} minutes | ` +
    `${chalk.white.bold('Word Count:')} ${chalk.yellow(wordCount)} words`,
};

module.exports = styles;
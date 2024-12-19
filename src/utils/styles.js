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
  em: (text) => chalk.italic.white(text),
  invert: (text) => chalk.inverse(text),

  // Entry formatting
  entryHeader: (index) => chalk.inverse.cyan.bold(`\n=== Entry ${index} ===\n`),
  entryDate: (date) => `${chalk.white.bold('Date:')} ${chalk.yellow(date)}`,
  entryPrompt: (prompt) => `${chalk.white.bold('Prompt:')} ${chalk.cyan(prompt)}`,
  entryPromptCategory: (category) => `${chalk.white.bold('Category:')} ${chalk.magenta(category)}`,
  entryMood: (mood) => `${chalk.white.bold('Mood:')} ${chalk.yellow(mood)}`,
  entryTags: (tags) => `${chalk.white.bold('Tags:')} ${tags.map(tag => chalk.cyan(`#${tag}`)).join(' ')}`,
  entryStats: (duration, wordCount) =>
    `${chalk.white.bold('Time Spent:')} ${chalk.yellow(duration)} | ` +
    `${chalk.white.bold('Words:')} ${chalk.yellow(wordCount)}`,
  entryResponse: (response) => `\n${chalk.white.bold('Response:')}\n${chalk.white(response)}\n`
};

module.exports = styles;

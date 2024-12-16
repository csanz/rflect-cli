const chalk = require('chalk');

const styles = {
    // Headers and titles
    header: (text) => chalk.bold.cyan(text),
    title: (text) => chalk.bold.blue(text),

    // Success messages
    success: (text) => chalk.green(text),
    check: (text) => chalk.green('✓ ') + text,

    // Error messages
    error: (text) => chalk.red(text),
    warning: (text) => chalk.yellow(text),

    // Info messages
    info: (text) => chalk.blue(text),
    help: (text) => chalk.cyan(text),

    // Data display
    label: (text) => chalk.bold.white(text),
    value: (text) => chalk.white(text),
    date: (text) => chalk.yellow(text),

    // Prompts and questions
    prompt: (text) => chalk.magenta(text),

    // Stats and numbers
    number: (text) => chalk.yellow(text),

    // Entry display formatting
    entryHeader: () => chalk.bold.cyan('\n=== Entry ==='),
    entryDate: (date) => `${chalk.bold.white('Date:')} ${chalk.yellow(date)}`,
    entryPrompt: (prompt) => `${chalk.bold.white('Prompt:')} ${chalk.cyan(prompt)}`,
    entryResponse: (response) => `${chalk.bold.white('Response:')} ${chalk.white(response)}`,
    entryStats: (duration, wordCount) => `${chalk.bold.white('Duration:')} ${chalk.yellow(duration)} minutes | ${chalk.bold.white('Word Count:')} ${chalk.yellow(wordCount)} words`
}

module.exports = styles;

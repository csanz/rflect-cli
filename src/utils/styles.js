const chalk = require('chalk');

// Color palette chosen for readability in both light and dark terminals
const colors = {
  primary: '#153273',    // Dark blue - good contrast on both backgrounds
  secondary: '#2E86C1',  // Medium blue - readable on both
  accent: '#d61adc',     // Purple - stands out on both
  success: '#1db05e',    // Forest green - visible on both
  error: '#da2010',      // Dark red - clear on both
  warning: '#de5e00',    // Dark orange - visible on both
  text: '#2C3E50',       // Dark slate - readable on light
  muted: '#788e8f',      // Medium gray - supplementary text
  tag: '#5d94a8',        // Muted steel blue
  numbers: '#5BC0DE',    // Bright blue - numbers
};

const styles = {
  // Headers and Sections
  header: (text) => chalk.bgHex(colors.primary).hex('C7E8EAFF').bold(`=== ${text} ===`),
  subheader: (text) => chalk.white.bold(`\n${text}`),

  // Status Messages
  success: (text) => chalk.hex(colors.success)(`✓ ${text}`),
  error: (text) => chalk.hex(colors.error)(`✖ ${text}`),
  warning: (text) => chalk.hex(colors.warning)(`⚠ ${text}`),

  // Information Display
  info: (text) => chalk.hex(colors.secondary)(text),
  help: (text) => chalk.hex(colors.accent)(text),
  value: (text) => chalk.hex(colors.text).bold(text),
  date: (text) => chalk.hex(colors.numbers).bold(text),
  prompt: (text) => chalk.hex(colors.accent).bold(text),
  number: (text) => chalk.hex(colors.numbers).bold(text),
  quote: (text) => chalk.hex(colors.accent).italic(`"${text}"`),
  highlight: (text) => chalk.hex(colors.secondary).italic(text),
  em: (text) => chalk.hex(colors.text).italic(text),
  invert: (text) => chalk.bgHex(colors.primary).white(` ${text} `),

  // Entry Formatting
  entryHeader: (index) => chalk.bgHex(colors.primary).white.bold(`\n=== Entry ${index} ===\n`),
  entryDate: (date) => `${chalk.hex(colors.text).bold('Date:')} ${chalk.hex(colors.secondary).bold(date)}`,
  entryPrompt: (prompt) => `${chalk.hex(colors.text).bold('Prompt:')} ${chalk.hex(colors.secondary)(prompt)}`,
  entryPromptCategory: (category) => `${chalk.hex(colors.text).bold('Category:')} ${chalk.hex(colors.accent)(category)}`,
  entryMood: (mood) => `${chalk.hex(colors.text).bold('Mood:')} ${chalk.hex(colors.warning)(mood)}`,
  entryTags: (tags) =>
    `${chalk.hex(colors.text).bold('Tags:')} ${tags.map(tag => chalk.hex(colors.tag)(`#${tag}`)).join(' ')}`,
  entryStats: (duration, wordCount) =>
    `${chalk.hex(colors.text).bold('Time Spent:')} ${chalk.hex(colors.numbers).bold(duration)} | ` +
    `${chalk.hex(colors.text).bold('Words:')} ${chalk.hex(colors.numbers).bold(wordCount)}`,
  entryResponse: (response) => `\n${chalk.hex(colors.text).bold('Response:')}\n${chalk.hex(colors.text)(response)}\n`,
};

module.exports = styles;
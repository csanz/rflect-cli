#!/usr/bin/env node
const { program } = require('commander');
const styles = require('./utils/styles');

const configCommand = require('./commands/config');
const initCommand = require('./commands/init');
const promptsCommand = require('./commands/prompts');
const writeCommand = require('./commands/write');

// CLI Description
program
  .name('rflect')
  .description(styles.header('📝 A CLI tool for guided reflections and journaling.'))
  .version('2.0.0');

// Writing & Viewing
program
  .command('write')
  .description(styles.help('Start a new reflection with a thoughtfully curated prompt.'))
  .action(writeCommand);

program
  .command('show')
  .description(styles.help('Browse and revisit your past reflections.'))
  .option('-a, --all', 'Display all entries.')
  .option('-r, --recent', 'View most recent entry.')
  .option('-d, --date <date>', 'Find entries from a specific date (MM/DD/YYYY).')
  .option('-t, --tag <tag>', 'Filter entries by tag.')
  .option('-s, --search <text>', 'Search entry contents.')
  .option('-c, --category <text>', 'Filter my prompt category')
  .action();

// Prompts, tags, mood
program
  .command('prompts')
  .description(styles.help('Browse available writing prompts.'))
  .option('-a, --all', 'View all prompts.')
  .option('-c, --category <type>', 'View prompts by category (mindfulness, gratitude, growth, question or quote).')
  .action(promptsCommand);

program
  .command('tags')
  .description(styles.help('View and manage your reflection tags.'))
  .option('-a, --all', 'List all used tags.')
  .option('-p, --popular', 'Show most frequently used tags.')
  .action();

program
  .command('mood')
  .description(styles.help('View your mood stats in relation to your writing.'))
  .option('-a, --all', 'Show all mood statistics')
  .option('-t, --top <number>', 'Show top N most frequent moods', '5')
  .option('-r, --range <date>', 'Show mood stats for a specific date range (e.g., "last-week", "last-month", "YYYY-MM-DD to YYYY-MM-DD")')
  .option('-c, --correlation', 'Show correlation between mood and writing productivity')
  .action();

// User settings & Stats
program
  .command('init')
  .description(styles.help('Set up your rflect account with initial preferences.'))
  .action(initCommand);

program
  .command('config')
  .description(styles.help('Customize your reflection preferences.'))
  .option('-i, --install', 'Reinstall rflect configuration file and directories.')
  .option('-n, --name', 'Set your display name.')
  .option('-s, --show', 'View current settings.')
  .option('-g, --goal', 'Configure word count or writing frequency goals.')
  .option('-t, --type <type>', 'Goal type (entries or words).')
  .option('-f, --frequency <frequency>', 'Goal frequency (daily, weekly, or monthly).')
  .option('-v, --value <number>', 'Goal value (# of entries or # of words).')
  .action(configCommand);

program
  .command('stats')
  .description(styles.help('View insights about your writing journey.'))
  .option('-a, --all', 'Show comprehensive statistics.')
  .option('-s, --streak', 'View streak and progress towards streak goal.')
  .option('-g, --goals', 'Show progress on all writing goals.')
  .option('-e, --entries', 'Display entry count and word statistics.')
  .option('-t, --time', 'Display time-related statistics.')
  .action();

// Entry Management
program
  .command('delete')
  .description(styles.help('Manage your reflection history.'))
  .option('-a, --all', 'Remove all entries.')
  .option('-d, --date <date>', 'Remove entries from specific date (MM/DD/YYYY).')
  .action();

// Future feature(s)
program
  .command('backup')
  .description(styles.value('[COMING SOON]: Backup your rflect entries to the cloud for access anywhere.'))
  .action(() => console.log(styles.warning(`[COMING SOON]: Backup your rflect entries to the cloud for access anywhere.`)));

program
  .command('theme')
  .description(styles.value(`[COMING SOON]: Customize rflect's outputs with your own theme and color choices.`))
  .action(() => console.log(styles.warning(`[COMING SOON]: Customize rflect's outputs with your own theme and color choices.`)));

program.parse(process.argv);
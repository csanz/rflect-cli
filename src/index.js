#!/usr/bin/env node
const { program } = require('commander');
const styles = require('./utils/styles');

const configCommand = require('./commands/config');
const initCommand = require('./commands/init');
const promptsCommand = require('./commands/prompts');
const writeCommand = require('./commands/write');
const showCommand = require('./commands/show');
const tagsCommand = require('./commands/tags');
const moodsCommand = require('./commands/moods');
const statsCommand = require('./commands/stats');
const deleteCommand = require('./commands/delete');

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
  .option('-c, --category <category>', 'Filter my prompt category')
  .action(showCommand);

// Prompts, tags, mood
program
  .command('prompts')
  .description(styles.help('Browse available writing prompts.'))
  .option('-a, --all', 'View all prompts.')
  .option('-c, --category <type>', 'View prompts by category (mindfulness, gratitude, growth, question or quote).')
  .action(promptsCommand);

program
  .command('tags')
  .description(styles.help(`View the tags you've created throughout your entries.`))
  .option('-a, --all', 'List all used tags.')
  .option('-t, --top', 'Show top 5 most frequently used tags.')
  .action(tagsCommand);

program
  .command('moods')
  .description(styles.help('View your mood stats in relation to your writing.'))
  .option('-f, --frequency', 'Show your mood frequency count.')
  .option('-calendar, --calendar', 'Visualize your moods for the current month')
  .action(moodsCommand);

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
  .option('-e, --editor <boolean>', 'Toggle system editor usage.')
  .option('-g, --goal', 'Configure word count or writing frequency goals.')
  .option('-t, --type <entries|words>', 'Goal type (entries or words).')
  .option('-f, --frequency <daily|weekly|monthly>', 'Goal frequency (daily, weekly, or monthly).')
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
  .action(statsCommand);

// Entry Management
program
  .command('delete')
  .description(styles.help('Manage your reflection history.'))
  .option('-a, --all', 'Remove all entries.')
  .option('-d, --date <date>', 'Remove entries from specific date (MM/DD/YYYY).')
  .action(deleteCommand);

// Future feature(s)
program
  .command('upcoming')
  .description(styles.value('Possible features to add in the future.'))
  .action(() => {
    console.log(`    ${styles.warning('rflect theme')}: Customize rflect's outputs with your own theme and color choices.`);
    console.log(`    ${styles.warning('rflect backup')}: Backup your rflect entries to the cloud for access anywhere.`);
    console.log(`    ${styles.warning('rflect search <term>')}: Advanced searching capabilities.`);
    console.log(`    ${styles.warning('rflect remind --frequency <daily|weekly|monthly> --time <HH:MM>')}: Get reminders to rflect.`);
    console.log(`    ${styles.warning('rflect encrypt/decrypt')}: Ensure privacy for your (all or select) entries.`); // crypto library
    console.log(`    ${styles.warning('rflect analyze')}: Use an AI API to get an analysis about your writing.`); // rate-limited
})

program.parse(process.argv);

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
  .option('-d, --date', 'Find entries from a specific date (MM/DD/YYYY).')
  .option('-t, --tag', 'Find reflections with a specific tag.')
  .option('-c, --category', 'Find reflections by prompt type.')
  .option('-m, --mood', 'Find reflections by mood.')
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
  .description(styles.help(`Discover themes in your reflection journey.`))
  .option('-a, --all', 'View all your used tags.')
  .option('-t, --top', 'See your 5 most frequent reflection themes.')
  .action(tagsCommand);

program
  .command('moods')
  .description(styles.help('Track your emotional journey through writing.'))
  .option('-f, --frequency', 'See patterns in your recorded moods.')
  .option('-c, --calendar', 'View your monthly mood patterns.')
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
  .option('-d, --date', 'Remove entries from specific date (MM/DD/YYYY).')
  .action(deleteCommand);

// Future feature(s)
program
  .command('upcoming')
  .description(styles.value('Peek at future rflect features.'))
  .action(() => {
      console.log(`    ${styles.warning('rflect theme')}: Personalize your journaling experience with custom themes.`);
      console.log(`    ${styles.warning('rflect backup')}: Keep your reflections safe with cloud backup.`);
      console.log(`    ${styles.warning('rflect search <term>')}: Find specific moments in your journey.`);
      console.log(`    ${styles.warning('rflect remind')}: Set gentle reminders for your reflection practice.`);
      console.log(`    ${styles.warning('rflect encrypt/decrypt')}: Add extra privacy to selected entries.`);
      console.log(`    ${styles.warning('rflect analyze')}: Gain insights into your reflection patterns with AI.`);
  });

program.parse(process.argv);

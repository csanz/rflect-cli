const { checkConfig } = require('../utils/config');
const styles = require('../utils/styles');
const { formatEntryForDisplay } = require('../utils/format');
const inquirer = require('inquirer');
const { moods } = require('../data/mood');
const {
  getAllEntries,
  getLastEntry,
  getEntryDates,
  getEntryByFileName,
  getEntryByTag,
  getEntryByMood,
  getEntryByPromptCategory,
} = require('../utils/entries');

async function showCommand(options) {
  try {
    const { isFirstTime, config } = await checkConfig();
    if (isFirstTime) {
      console.log(styles.warning(`\nWelcome to rflect! Let's get you set up first.`));
      console.log(
        styles.info('Run ') +
          styles.value('rflect init') +
          styles.info(' to start your reflection journey.')
      );
      return;
    }

    if (
      !options.all &&
      !options.recent &&
      !options.date &&
      !options.tag &&
      !options.category &&
      !options.mood
    ) {
      console.log(styles.help('Available options:'));
      console.log(styles.value('  rflect show --all      ') + styles.info('Display all entries'));
      console.log(
        styles.value('  rflect show --recent   ') + styles.info('View your most recent entry')
      );
      console.log(
        styles.value('  rflect show --date     ') + styles.info('Find entries from a specific date')
      );
      console.log(
        styles.value('  rflect show --tag      ') + styles.info('Find entries with a specific tag')
      );
      console.log(
        styles.value('  rflect show --category ') + styles.info('Find entries by prompt type')
      );
      console.log(styles.value('  rflect show --mood     ') + styles.info('Find entries by mood'));
      return;
    }

    if (options.all) {
      const entries = await getAllEntries();
      entries.forEach((entry, index) => {
        formatEntryForDisplay(entry, index + 1);
      });
    }

    if (options.recent) {
      const entry = await getLastEntry();
      formatEntryForDisplay(entry);
    }

    if (options.date) {
      const dates = await getEntryDates();
      const { selectedEntry } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedEntry',
          message: styles.prompt(`Select the date/time of the entry you'd like to view: `),
          choices: dates.map((date) => ({
            name: date.dateString,
            value: date.filename,
          })),
        },
      ]);
      const entry = await getEntryByFileName(selectedEntry);
      formatEntryForDisplay(entry);
    }

    if (options.tag) {
      const { tags } = config.stats;
      const { selectedTag } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedTag',
          message: styles.prompt(`Select the tag of the entries you'd like to view: `),
          choices: Object.keys(tags),
        },
      ]);
      const entries = await getEntryByTag(selectedTag);
      entries.forEach((entry, index) => {
        formatEntryForDisplay(entry, index + 1);
      });
    }

    if (options.category) {
      const categories = ['mindfulness', 'gratitude', 'growth', 'question', 'quote'];
      const { selectedCategory } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedCategory',
          message: styles.prompt(`Select the prompt category of the entries you'd like to view: `),
          choices: categories,
        },
      ]);
      const entries = await getEntryByPromptCategory(selectedCategory);
      entries.forEach((entry, index) => {
        formatEntryForDisplay(entry, index + 1);
      });
    }

    if (options.mood) {
      const { selectedMood } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedMood',
          message: styles.prompt(
            `Select the mood you'd like to visualize on the calendar (select one that you've used before)!`
          ),
          choices: moods,
        },
      ]);
      const entries = await getEntryByMood(selectedMood);
      entries.forEach((entry, index) => {
        formatEntryForDisplay(entry, index + 1);
      });
    }
  } catch (error) {
    console.error(styles.error('Error displaying entries: ') + styles.value(error.message));
    console.log(styles.info('Please try again or report this issue.'));
  }
}

module.exports = showCommand;

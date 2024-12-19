const { checkConfig } = require('../utils/config');
const styles = require('../utils/styles');
const { getAllEntries, formatEntryForDisplay, getLastEntry, getEntryDates, getEntryByFileName, getEntryByTag, getEntryByMood, getEntryByPromptCategory } = require('../utils/entries');
const inquirer = require('inquirer');
const { moods } = require('../data/mood');

async function showCommand(options) {
  try {
    const { isFirstTime, config  } = await checkConfig();
    if (isFirstTime) {
      console.log(
        styles.warning(`\n ⚠️ It looks like you haven't set up your rflect account yet.`)
      );
      console.log(
        styles.info('To get started, please use the ') + styles.value('rflect init') + styles.info(' command to configure your preferences.')
      );
      return;
    }

    if (options.all) {
      const entries = await getAllEntries();
      entries.forEach((entry, index) => {
        formatEntryForDisplay(entry, index + 1);
      })
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
          message: styles.prompt(
            `Select the date/time of the entry you'd like to view: `
          ),
          choices: dates.map(date => ({
            name: date.dateString,
            value: date.filename
          }))
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
          message: styles.prompt(
            `Select the tag of the entries you'd like to view: `
          ),
          choices: Object.keys(tags),
        },
      ]);
      const entries = await getEntryByTag(selectedTag);
      entries.forEach((entry, index) => {
        formatEntryForDisplay(entry, index + 1);
      })
    }

    if (options.category) {
      const categories = ['mindfulness', 'gratitude', 'growth', 'question', 'quote'];
      const { selectedCategory } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedCategory',
          message: styles.prompt(
            `Select the prompt category of the entries you'd like to view: `
          ),
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
    console.log(error);
  }
}

module.exports = showCommand;
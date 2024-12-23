const { getAllMoods, displayMoodCal } = require('../utils/moods');
const { moods } = require('../data/mood');
const inquirer = require('inquirer');
const styles = require('../utils/styles');
const { checkConfig } = require('../utils/config');

async function moodsCommand(options) {
  try {
    const { isFirstTime } = await checkConfig();
    if (isFirstTime) {
      console.log(styles.warning(`\nWelcome to rflect! Let's get you set up first.`));
      console.log(
        styles.info('Run ') +
        styles.value('rflect init') +
        styles.info(' to start your reflection journey.')
      );
      return;
    }

    if (options.frequency) {
      await getAllMoods();
    } else if (options.calendar) {
      const { mood } = await inquirer.prompt([
        {
          type: 'list',
          name: 'mood',
          message: styles.prompt(
            `Select the mood you'd like to visualize on the calendar (select one that you've used before)!`
          ),
          choices: moods,
        },
      ]);
      await displayMoodCal(mood);
    } else {
      await getAllMoods();
    }
  } catch (error) {
    // error messaging
  }
}

module.exports = moodsCommand;

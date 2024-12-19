const { getAllMoods, displayMoodCal } = require('../utils/moods');
const { moods } = require('../data/mood');
const inquirer = require('inquirer');
const styles = require('../utils/styles');
const { checkConfig } = require('../utils/config');

async function moodsCommand(options) {
  try {
    const { isFirstTime  } = await checkConfig();
    if (isFirstTime) {
      console.log(
        styles.warning(`\n ⚠️ It looks like you haven't set up your rflect account yet.`)
      );
      console.log(
        styles.info('To get started, please use the ') + styles.value('rflect init') + styles.info(' command to configure your preferences.')
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

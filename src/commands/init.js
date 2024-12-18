const inquirer = require('inquirer');
const { checkConfig, updateConfig } = require('../utils/config');
const styles = require('../utils/styles');

async function initCommand() {
  try {
    const { isFirstTime, config } = await checkConfig();
    if (config && !isFirstTime) {
      const { initConfirmation } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'initConfirmation',
          message: styles.warning(`rflect is already initialized for ${styles.info(config.user.name)}. Would you like to restart the setup?`),
          default: false
        }
      ]);
      if (!initConfirmation) {
        console.log(styles.info('\nSetup cancelled. Use rflect config to modify settings.'));
        return;
      }
    }

    // Init setup
    console.log(styles.header('\n=== Welcome to rflect! ==='));
    console.log(styles.info('Let\'s get you set up for your reflection journey.\n'));

    // Get user config
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: styles.prompt('What should I call you?'),
        validate: (input) => input.trim() ? true : styles.warning('Name is required.'),
      },
      {
        type: 'confirm',
        name: 'setGoals',
        message: styles.prompt('Would you like to set writing goals?'),
        default: true
      },
      {
        type: 'list',
        name: 'entryFrequency',
        message: styles.prompt('How often would you like to write with rflect?'),
        choices: [
          { name: 'Daily entries', value: 'daily' },
          { name: 'Weekly entries', value: 'weekly' },
          { name: 'Monthly entries', value: 'monthly' }
        ],
        when: (answers) => answers.setGoals
      },
      {
        type: 'number',
        name: 'entryGoal',
        message: (answers) => {
            return styles.prompt(`How many entries would you like to write ${answers.entryFrequency}?`);
        },
        when: (answers) => answers.setGoals,
        validate: (input) => input > 0 ? true : styles.warning('Set a goal higher than 0.'),
      },
      {
        type: 'list',
        name: 'wordCountFrequency',
        message: styles.prompt('How often would you like to track your word count?'),
        choices: [
          { name: 'Daily word count', value: 'daily' },
          { name: 'Weekly word count', value: 'weekly' },
          { name: 'Monthly word count', value: 'monthly' }
        ],
        when: (answers) => answers.setGoals,
      },
      {
        type: 'number',
        name: 'wordCountGoal',
        message: (answers) => {
          return styles.prompt(`How many words would you like to write ${answers.wordCountFrequency}?`);
        },
        when: (answers) => answers.setGoals,
        validate: (input) => input > 0 ? true : styles.warning('Set a goal higher than 0.'),
      },
    ]);

    config.user.name = answers.name;
    if (answers.setGoals) {
      config.goals.entries = {
        type: answers.entryFrequency,
        goal: answers.entryGoal
      };
      config.goals.words = {
        type: answers.wordCountFrequency,
        goal: answers.wordCountGoal
      }
    }
    await updateConfig(config);

    // Success message
    console.log(styles.success(`\n✨ Welcome, ${styles.value(answers.name)}!`));
    if (answers.setGoals) {
      console.log(styles.info(`\nYour goals:`));
      console.log(styles.help(`- Write ${styles.number(answers.entryGoal)} entries ${styles.number(answers.entryFrequency)}`));
      console.log(styles.help(`- Write ${styles.number(answers.wordCountGoal)} words ${styles.number(answers.wordCountFrequency)}`));
    }

    console.log(styles.info('\nGet started with:'));
    console.log(styles.help(`rflect write   - Start your first reflection`));
    console.log(styles.help(`rflect show    - View your entries`));
    console.log(styles.help(`rflect stats   - Track your progress`));
  } catch (error) {
    console.error(styles.error('Setup failed: ') + styles.value(error.message));
    console.log(styles.help('Please try again.'));
  }
}

module.exports = initCommand;
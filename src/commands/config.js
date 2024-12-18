const inquirer = require('inquirer');
const styles = require('../utils/styles');
const { checkConfig, updateConfig } = require('../utils/config');

async function configCommand(options) {
  try {
    const { isFirstTime, config } = await checkConfig();
    if (!options.name && !options.show && !options.goal) {
      console.log(styles.header('\n=== Configuration ===\n'));
      console.log(styles.help('Available options:'));
      console.log(styles.value('  rflect config --name <name>   ') + styles.help('Change your display name'));
      console.log(styles.value('  rflect config --show   ') + styles.help('View current settings'));
      console.log(styles.value('  rflect config goal -t <type> -f <frequency> -v <number> ') + styles.help('Set goals ("entry" or "words")'));
      return;
    }

    if (isFirstTime) {
      console.log(styles.warning(`\n ⚠️ It looks like you haven't set up your rflect account yet.`));
      console.log(styles.info('To get started, please use the ') + styles.value('rflect init') + styles.info(' command to configure your preferences.'));
      return;
    }

    if (options.name) {
      const { newName, confirmChange } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmChange',
          message: styles.prompt(`⚠️ Are you sure you would like to change your current name, ${config.user.name}?`),
          default: true
        },
        {
          type: 'input',
          name: 'newName',
          message: styles.prompt(`Enter a new display name: `),
          validate: (input) => input.trim() ? true : styles.warning('Name is required.'),
        },
      ]);

      if (confirmChange) {
        config.user.name = newName;
        await updateConfig(config);
        console.log(styles.success(`Display name updated to ${styles.highlight(newName)}.`));
      }
    }

    if (options.show) {
      console.log(styles.header('\n✨ Current Settings ✨\n'));
      console.log(styles.info(`Name: ${styles.highlight(config.user.name)}`));
      console.log(styles.info(`Entry Goal: ${styles.number(config.goals.entries.goal)} ${config.goals.entries.type} 📝`));
      console.log(styles.info(`Word Goal: ${styles.number(config.goals.words.goal)} ${config.goals.words.type} 💬`));
      console.log();
      console.log(styles.help('Use rflect config --name to change your display name 🧑‍🎨'));
      console.log(styles.help('Use rflect config goal -t <type> -f <frequency> -v <number> to set new writing goals 📈'));
      console.log();
      console.log(styles.error(`🔜 COMING SOON => Settings to back up your entries to a cloud 🌐 and change the theme! 🎨`));
    }

    if (options.goal) {
      const { frequency, type, value } = options;
      if (!frequency || !type || !value) {
        console.log(styles.error('Please provide all required goal information:'));
        console.log(styles.warning(`--type or -t can be "words" or "entry" goal.`));
        console.log(styles.warning(`--frequency or -f can be a "monthly", "weekly" or "daily" goal.`));
        console.log(styles.warning(`--value or -v can be a number.`));
        console.log();
        console.log(styles.info(`For example, "rflect config --goal -f weekly -v 10 -t entry" means you would like to write 10 entries a week. `));
        console.log(styles.info(`For example, "rflect config --goal -f daily -v 500 -t words" means you would like to write 500 words a day. `));
        return;
      }
    }
  } catch (error) {
    // error messages
    console.error(styles.error('Error in configCommand:'), error);
  }
}

async function goalCommand(options) {
  console.log("hello")
}

module.exports = configCommand;
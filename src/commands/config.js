const inquirer = require('inquirer');
const styles = require('../utils/styles');
const { checkConfig, updateConfig } = require('../utils/config');
const createRflectDirectory = require('../scripts/install');

async function configCommand(options) {
  try {
    const { isFirstTime, config } = await checkConfig();
    if (!options.name && !options.show && !options.goal && !options.install & !options.editor) {
      console.log(styles.header('\n=== Configuration ===\n'));
      console.log(styles.help('Available options:'));
      console.log(
        styles.value('  rflect config --name <name>   ') + styles.help('Change your display name')
      );
      console.log(styles.value('  rflect config --show   ') + styles.help('View current settings'));
      console.log(
        styles.value('  rflect config --install   ') +
          styles.help('Reinstall rflect configuration file and directories.')
      );
      console.log(
        styles.value('  rflect config --editor <boolean> ') +
          styles.help('Toggle your system editor usage (true/false).')
      );
      console.log(
        styles.value('  rflect config goal -t <type> -f <frequency> -v <number> ') +
          styles.help('Set goals ("entry" or "words")')
      );
      return;
    }

    if (isFirstTime) {
      console.log(
        styles.warning(`\n ⚠️ It looks like you haven't set up your rflect account yet.`)
      );
      console.log(
        styles.info('To get started, please use the ') +
          styles.value('rflect init') +
          styles.info(' command to configure your preferences.')
      );
      return;
    }

    if (options.install) {
      const { confirmInstall } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmInstall',
          message: config
            ? styles.warning(
                'This will reset your configuration and will require you to re-configure your details. Are you sure?'
              )
            : styles.prompt('Would you like to install rflect?'),
          default: false,
        },
      ]);
      if (confirmInstall) {
        const success = await createRflectDirectory(true);
        if (success) {
          console.log(styles.success('\nConfiguration reset successfully.'));
          console.log(
            styles.info('\nPlease run rflect init to populate the config file with your details.')
          );
        } else {
          console.log(styles.error('\nFailed to reset configuration.'));
          console.log(styles.help('Please try again or check file permissions.'));
        }
      } else {
        console.log(styles.info('\nInstallation cancelled.'));
      }
      return;
    }

    if (options.name) {
      const { newName, confirmChange } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmChange',
          message: styles.prompt(
            `⚠️ Are you sure you would like to change your current name, ${config.user.name}?`
          ),
          default: true,
        },
        {
          type: 'input',
          name: 'newName',
          message: styles.prompt(`Enter a new display name: `),
          validate: (input) => (input.trim() ? true : styles.warning('Name is required.')),
        },
      ]);

      if (confirmChange) {
        config.user.name = newName;
        await updateConfig(config);
        console.log(styles.success(`Display name updated to ${styles.highlight(newName)}.`));
      }
    }

    if (options.editor !== undefined) {
      const useEditor = options.editor.toLowerCase() === 'true';
      config.user.useEditor = useEditor;
      await updateConfig(config);
      console.log(
        styles.success(
          `System editor preference is ${styles.invert(`${useEditor ? 'enabled' : 'disabled'}`)}.`
        )
      );
    }

    if (options.show) {
      console.log(styles.header('\n✨ Current Settings ✨\n'));
      console.log(styles.info(`Name: ${styles.highlight(config.user.name)}`));
      console.log(styles.info(`Editor Preference: ${config.user.useEditor === "true" ? "Using your system's built-in editor" : "Using plain text input within the terminal"}`));
      console.log(
        styles.info(
          `Current Entry Goal: ${styles.number(config.goals.entries.goal)} ${config.goals.entries.type} 📝`
        )
      );
      console.log(
        styles.info(
          `Current Word Goal: ${styles.number(config.goals.words.goal)} ${config.goals.words.type} 💬`
        )
      );
      console.log();
      console.log(styles.help('Use rflect config --name to change your display name 🧑‍🎨'));
      console.log(
        styles.help(
          'Use rflect config goal -t <type> -f <frequency> -v <number> to set new writing goals 📈'
        )
      );
      console.log(
        styles.help(
          'Use rflect stats to see your current progress towards your goals and other writing stats!'
        )
      );
    }

    if (options.goal) {
      const { frequency, type, value } = options;
      if (!frequency || !type || !value) {
        console.log(
          styles.error(`Please provide all ${styles.invert('required')} goal-related details: `)
        );
        console.log(
          styles.warning(
            `--type or -t can be "words" for a word count goal or "entries" for an entry goal.`
          )
        );
        console.log(
          styles.warning(`--frequency or -f can be a "monthly", "weekly" or "daily" goal.`)
        );
        console.log(styles.warning(`--value or -v can be a number.`));
        console.log(
          styles.em(
            `   - "rflect config --goal -f weekly -v 10 -t entry" = you would like to write 10 entries a week. `
          )
        );
        console.log(
          styles.em(
            `   - "rflect config --goal -t words -f monthly -v 5000" = you would like to write at least 5000 words every month. `
          )
        );
        return;
      }
      const validTypes = ['words', 'entries'];
      const validFrequency = ['monthly', 'daily', 'weekly'];

      if (!validTypes.includes(options.type)) {
        console.log(styles.error('Invalid goal type. Use "entries" or "words".'));
      }

      if (!validFrequency.includes(options.frequency)) {
        console.log(styles.error('Invalid frequency. Use "daily", "weekly" or "monthly".'));
      }

      if (isNaN(options.value)) {
        console.log(
          styles.error(
            `Invalid input. Enter a number that you'd like to achieve in your specified frequency.`
          )
        );
      }

      if (
        isNaN(options.value) ||
        !validFrequency.includes(options.frequency) ||
        !validTypes.includes(options.type)
      ) {
        return;
      }

      // Update config at this point
      config.goals[type] = {
        type: frequency,
        goal: Number(value),
      };
      await updateConfig(config);
      console.log(
        styles.success(
          `${type === 'words' ? 'Word' : 'Entry'} count goal has ${styles.em('successfully')} 
            been updated to ${styles.invert(options.value)} ${
            type === 'words' ? 'words' : 'entries'
          } 
          ${
            options.frequency === 'daily'
              ? 'per day'
              : options.frequency === 'weekly'
              ? 'per week'
              : 'per month'
          }.`
        )
      );
    }
  } catch (error) {
    // error messages
    console.error(styles.error('Error in config:'), error);
  }
}

module.exports = configCommand;

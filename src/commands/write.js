const inquirer = require('inquirer');
const styles = require('../utils/styles');
const { checkConfig, updateConfig } = require('../utils/config');
const { getRandomPrompt, incrementPromptUsageCount } = require('../utils/prompts');
const { format, differenceInMinutes } = require('date-fns');

async function writeCommand() {
  try {
    const { isFirstTime, config } = await checkConfig();
    if (isFirstTime) {
      console.log(styles.warning(`\n ⚠️ It looks like you haven't set up your rflect account yet.`));
      console.log(styles.info('To get started, please use the ') + styles.value('rflect init') + styles.info(' command to configure your preferences.'));
      return;
    }

    const prompt = await getRandomPrompt();
    console.log(prompt);

    const { body } = await inquirer.prompt([
      {
        type: 'editor',
        name: 'body',
        message: styles.prompt(prompt.question),
        waitUserInput: true,
        default: '\n\n [Start writing here...]'
      }
    ])
    // use inquirer to get random prompt (based on user's preference)
    // update usageCount of the random prompt
    // add category by default to the entry
    // timer duration
    // allow user to write
    // ask for tags (optional) => comma separated list only
    // ask for mood (optional) => predefined
    // save entry (MM-DD-YY-HHmm_category_entry.txt)
    // update stats and tags in the config -> use updateconfig to update in the file
  } catch (error) {
    // errors
  }
}

module.exports = writeCommand;
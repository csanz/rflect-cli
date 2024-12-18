const inquirer = require('inquirer');
const styles = require('../utils/styles');
const { checkConfig, updateConfig } = require('../utils/config');
const { getRandomPrompt, incrementPromptUsageCount } = require('../utils/prompts');
const { format, intervalToDuration, differenceInMinutes } = require('date-fns');
const { formatDuration } = require('../utils/format');
const { moods } = require('../utils/mood');
const { saveEntry } = require('../utils/entries');

async function writeCommand() {
  try {
    const { isFirstTime, config } = await checkConfig();
    if (isFirstTime) {
      console.log(styles.warning(`\n ⚠️ It looks like you haven't set up your rflect account yet.`));
      console.log(styles.info('To get started, please use the ') + styles.value('rflect init') + styles.info(' command to configure your preferences.'));
      return;
    }

    let body;
    const prompt = await getRandomPrompt();
    await incrementPromptUsageCount(prompt.id);

    const { mood } = await inquirer.prompt([
      {
        type: 'list',
        name: 'mood',
        message: styles.prompt('How are you feeling today?'),
        choices: moods,
      }
    ]);

    const startTime = new Date();
    if (config.user.useEditor) {
      ({ body } = await inquirer.prompt([
        {
          type: 'editor',
          name: 'body',
          message: styles.prompt(prompt.question + "\n"),
          waitUserInput: true,
          default: '\n\n[Write your reflection here...]',
          // Editor content is validated after closing the editor
          validate: input => {
            const wordCount = input.trim().split(/\s+/).length;
            if (wordCount < 10) {
              return styles.warning('Your reflection seems a bit short. Please write at least 10 words to capture your thoughts.');
            }
            return true;
          }
        }
      ]));
    } else {
      ({ body } = await inquirer.prompt([
        {
          type: 'input',
          name: 'body',
          message: styles.prompt(prompt.question + "\n"),
          validate: input => {
            const wordCount = input.trim().split(/\s+/).length;
            if (wordCount < 10) {
              return styles.warning('Your reflection seems a bit short. Please write at least 10 words to capture your thoughts.');
            }
            return true;
          }
        }
      ]));
    }

    const { tags } = await inquirer.prompt([
        {
          type: 'input',
          name: 'tags',
          message: styles.prompt('Add tags (comma-separated) [optional]:'),
          filter: input => input.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        }
      ]);

    const endTime = new Date();
    const duration = intervalToDuration({ start: startTime, end: endTime });
    const durationString = formatDuration(duration);

    const rawEntry = {
      prompt,
      body,
      tags,
      mood,
      startTime,
      endTime,
      durationString
    };
    const savedEntry = await saveEntry(rawEntry);
    console.log(savedEntry);

    console.log(styles.success('\n✨ Your reflection has been saved!\n'));
    // update stats and tags in the config -> use updateconfig to update in the file
  } catch (error) {
    // errors
  }
}

module.exports = writeCommand;
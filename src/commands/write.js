const inquirer = require('inquirer');
const styles = require('../utils/styles');
const { checkConfig, updateConfig } = require('../utils/config');
const { getRandomPrompt, incrementPromptUsageCount } = require('../utils/prompts');
const { format, differenceInMinutes } = require('date-fns');

async function writeCommand() {
  try {
    const { config } = await checkConfig();
    // ensure config exists otherwise prompt users to use rflect init
    // use inquirer to get random prompt
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
const inquirer = require('inquirer');

const styles = require('../utils/styles');
const { checkConfig, updateConfig } = require('../utils/config');
const { getRandomPrompt, incrementPromptUsageCount } = require('../utils/prompts');

async function writeCommand() {
  try {
    const { config } = await checkConfig();
    if (!config) {
      return;
    }
  } catch (error) {
    // errors
  }
}

module.exports = writeCommand;
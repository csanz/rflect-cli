const { getAllPrompts, getPromptsByCategory, formatQuoteInPrompt } = require('../utils/prompts');
const inquirer = require('inquirer');
const styles = require('../utils/styles');

async function promptsCommand(options) {
  try {
    if (!options.all && !options.category) {
      console.log(styles.header('\n=== Reflection Prompts ===\n'));
      console.log(styles.help('Available options:'));
      console.log(styles.value('  rflect prompts --all     ') + styles.help('Show all prompts'));
      console.log(styles.value('  rflect prompts --category <category>  ') + styles.help('Show prompts for a specific category'));
      return;
    }

    if (options.all) {
      const prompts = await getAllPrompts();
      prompts.forEach((prompt, index) => console.log(styles.number(index + 1) + `. ${prompt}`));
    }

    const categories = ['mindfulness', 'gratitude', 'growth', 'question', 'quote'];
    const isValid = categories.filter(category => category === options.category);
    if (options.category && isValid) {
      const prompts = await getPromptsByCategory(options.category);
      prompts.forEach((prompt, index) => {
        if (options.category === 'quote') {
          console.log(styles.number(index + 1) + `. ${formatQuoteInPrompt(prompt)}`);
        } else {
          console.log(styles.number(index + 1) + `. ${prompt}`);
        }
      });
    }
    // add pagination option + allow users to start writing based on a prompt they click (?)
  } catch (error) {
    // error messaging
    console.log(error);
  }
}

module.exports = promptsCommand;
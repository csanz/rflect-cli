const { getAllPrompts, getPromptsByCategory } = require('../utils/prompts');
const { formatQuoteInPrompt } = require('../utils/format');
const styles = require('../utils/styles');
const { checkConfig } = require('../utils/config');

async function promptsCommand(options) {
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

    if (!options.all && !options.category) {
      console.log(styles.help('Available options:'));
      console.log(
        styles.value('  rflect prompts --all      ') + styles.info('View all available prompts')
      );
      console.log(
        styles.value('  rflect prompts --category ') +
          styles.info(
            'View prompts by category (mindfulness, gratitude, growth, question or quote)'
          )
      );
      return;
    }

    if (options.all) {
      const prompts = await getAllPrompts();
      console.log(styles.header('All Available Prompts'));
      prompts.forEach((prompt, index) => console.log(styles.number(index + 1) + `. ${prompt}`));
      console.log(
        styles.info(`\nUse `) +
          styles.value('rflect write') +
          styles.info(' to get a random prompt and start your reflection.')
      );
    }

    const categories = ['mindfulness', 'gratitude', 'growth', 'question', 'quote'];
    const isValid = categories.filter((category) => category === options.category);
    if (options.category && isValid) {
      const prompts = await getPromptsByCategory(options.category);
      console.log(styles.header(`Prompts in '${styles.value(options.category)}' Category`));

      prompts.forEach((prompt, index) => {
        if (options.category === 'quote') {
          console.log(styles.number(index + 1) + `. ${formatQuoteInPrompt(prompt)}`);
        } else {
          console.log(styles.number(index + 1) + `. ${prompt}`);
        }
      });
      console.log(
        styles.info(`\nUse `) +
          styles.value('rflect write') +
          styles.info(' to get a random prompt and start your reflection.')
      );
    }
  } catch (error) {
    console.error(styles.error('Error processing prompts: ') + styles.value(error.message));
    console.log(styles.help('Please try again or report this issue.'));
  }
}

module.exports = promptsCommand;

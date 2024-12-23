const { getAllTags, getTopFiveTags } = require('../utils/tags');
const { checkConfig } = require('../utils/config');
const styles = require('../utils/styles');

async function tagsCommand(options) {
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

    if (!options.all && !options.top) {
      console.log(styles.help('Available options:'));
      console.log(styles.value('  rflect tags --all      ') + styles.info('View all your used tags'));
      console.log(styles.value('  rflect tags --top      ') + styles.info('See your 5 most frequent reflection themes'));
      return;
    }

    if (options.all) {
      await getAllTags();
    } else if (options.top) {
      await getTopFiveTags();
    } else {
      await getAllTags();
    }
  } catch (error) {
    console.error(styles.error('Error processing tags: ') + styles.value(error.message));
    console.log(styles.info('Please try again or report this issue.'));
  }
}

module.exports = tagsCommand;

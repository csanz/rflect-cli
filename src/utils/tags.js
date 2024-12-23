const { checkConfig } = require('./config');
const styles = require('./styles');

async function getAllTags() {
  try {
    const { config } = await checkConfig();
    const { tags } = config.stats;

    if (Object.keys(tags).length === 0) {
      console.log(styles.info('\nNo tags found.'));
      console.log(
        styles.help('Start adding tags to your entries when writing: ') +
          styles.value('rflect write')
      );
      return;
    }

    console.log(styles.header('All Tags'));
    console.log(
      styles.help(
        'Here are ALL the tags that you have used across your entries and the number of times it was used:'
      )
    );
    for (const tag of Object.keys(tags)) {
      const count = tags[tag].files.length;
      console.log(
        styles.value(`#${tag}`) +
          styles.info(` used in `) +
          styles.number(count) +
          styles.info(` ${count === 1 ? 'entry' : 'entries'}`)
      );
    }
  } catch (error) {
    console.error(styles.error('Failed to retrieve tags: ') + styles.value(error.message));
    console.log(styles.help('Please check your configuration or report this issue.'));
  }
}

async function getTopFiveTags() {
  try {
    const { config } = await checkConfig();
    const { tags } = config.stats;

    if (Object.keys(tags).length === 0) {
      console.log(styles.info('\nNo tags found.'));
      console.log(
        styles.help('Start adding tags to your entries when writing: ') +
          styles.value('rflect write')
      );
      return;
    }

    console.log(styles.header('Most Used Tags'));
    console.log(
      styles.help('Here are the top 5 tags that you have used the most in your entries:')
    );
    const sortedTags = Object.entries(tags)
      .sort(([, a], [, b]) => b.files.length - a.files.length)
      .slice(0, 5);

    sortedTags.forEach(([tag, data]) => {
      const count = data.files.length;
      console.log(
        styles.value(`#${tag}`) +
          styles.info(` used in `) +
          styles.number(count) +
          styles.info(` ${count === 1 ? 'entry' : 'entries'}`)
      );
    });

    console.log(
      styles.help('\nUse ') + styles.value('rflect tags --all') + styles.help(' to see all tags')
    );
  } catch (error) {
    console.error(styles.error('Failed to retrieve top tags: ') + styles.value(error.message));
    console.log(styles.help('Please check your configuration or report this issue.'));
  }
}

module.exports = { getAllTags, getTopFiveTags };

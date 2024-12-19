const { getAllTags, getTopFiveTags } = require('../utils/tags');
const { checkConfig } = require('../utils/config');
const styles = require('../utils/styles');

async function tagsCommand(options) {
  try {
    const { isFirstTime  } = await checkConfig();
    if (isFirstTime) {
      console.log(
        styles.warning(`\n ⚠️ It looks like you haven't set up your rflect account yet.`)
      );
      console.log(
        styles.info('To get started, please use the ') + styles.value('rflect init') + styles.info(' command to configure your preferences.')
      );
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
    // error messaging
  }
}

module.exports = tagsCommand;

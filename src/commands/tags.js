const { getAllTags, getTopFiveTags } = require('../utils/tags');

async function tagsCommand (options) {
  try {
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
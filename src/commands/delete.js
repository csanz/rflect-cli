const { checkConfig, updateConfig } = require('../utils/config');
const { deleteAllEntries, deleteEntryByFileName, getEntryDates, getEntryByFileName } = require('../utils/entries');
const styles = require('../utils/styles');
const inquirer = require('inquirer');

async function deleteCommand(options) {
  try {
    const { isFirstTime, config } = await checkConfig();
    if (isFirstTime) {
      console.log(styles.warning(`\nWelcome to rflect! Let's get you set up first.`));
      console.log(
        styles.info('Run ') +
        styles.value('rflect init') +
        styles.info(' to start your reflection journey.')
      );
      return;
    }

    if (options.all) {
      const { firstConfirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'firstConfirm',
          message: styles.warning(`⚠️ PERMANENT DELETION WARNING\n\nThis action will completely remove ALL of your journal entries from your computer.\n- This cannot be undone\n- ALL journal entries will be permanently deleted\n- This includes ALL saved entries across ALL dates\n\nAre you absolutely certain you want to proceed?`),
          default: false,
        },
      ]);

      if (firstConfirm) {
        const { finalConfirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'finalConfirm',
            message: styles.warning(`🚨 FINAL CONFIRMATION\n\nYou are about to permanently delete EVERYTHING:\n- ALL journal entries will be IRREVERSIBLY ERASED\n- No recovery is possible\n\nDO YOU WANT TO CONTINUE?`),
            default: false,
          },
        ]);

        if (finalConfirm) {
          const deletedFileCount = await deleteAllEntries();
          const totalEntryCount = config.stats.totalEntries;
          config.stats.deletedEntries += totalEntryCount;

          const totalWordCount = config.stats.totalWords;
          config.stats.deletedWords += totalWordCount;

          config.stats.totalEntries = 0;
          config.stats.totalWords = 0;

          await updateConfig(config);
          console.log(styles.success(`Deleted ${deletedFileCount} entries.`));
        }
      }
    }

    if (options.date) {
      const dates = await getEntryDates();
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedEntry',
          message: styles.prompt(`Select the date/time of the entry you'd like to DELETE: `),
          choices: dates.map((date) => ({
            name: date.dateString,
            value: {
              filename: date.filename,
              dateString: date.dateString,
            },
          })),
        },
        {
          type: 'confirm',
          name: 'confirmation',
          message: (answers) =>
            styles.warning(
              `WARNING: This action cannot be undone. Are you sure you want to delete the entry from ${answers.selectedEntry.dateString}?`
            ),
          default: false,
        },
      ]);
      if (answers.confirmation) {
        const fileToDelete = await getEntryByFileName(answers.selectedEntry.filename);
        await deleteEntryByFileName(answers.selectedEntry.filename);
        config.stats.totalEntries = config.stats.totalEntries - 1;
        config.stats.deletedEntries = config.stats.deletedEntries + 1;
        config.stats.deletedWords = config.stats.deletedWords + fileToDelete.content.wordCount;
        config.stats.totalWords = config.stats.totalWords - fileToDelete.content.wordCount;
        await updateConfig(config);
        console.log(styles.success(`Entry from ${answers.selectedEntry.dateString} deleted successfully.`));
      }
    }
  }
  catch (error) {
    console.error(styles.error('Error during deletion:'), error.message);
  }
}

module.exports = deleteCommand;
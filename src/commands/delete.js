const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { isLoggedIn } = require('../utils/auth');
const User = require('../models/user');
const Entry = require('../models/entry');
const inquirer = require('inquirer');
const styles = require('../utils/styles');

async function deleteCommand(options) {
  try {
    const session = await isLoggedIn();
    if (!session.isValid) {
      console.log(styles.error('You are currently not logged in.'));
      console.log(
        styles.help(
          `Use ${styles.value('rflect login')} to access your account.`
        )
      );
      return;
    }

    const user = await User.findById(session.userId);
    if (!user) {
      console.log(
        styles.error('Something went wrong. Try logging out and back in!')
      );
      return;
    }

    if (!options.local && !options.cloud && !options.both) {
      console.log(styles.header('\n=== Delete Entries ===\n'));
      console.log(styles.warning('No delete option provided.'));
      console.log(
        styles.info(`Current storage: ${styles.value(user.storagePreference)}`)
      );
      console.log(styles.help('\nAvailable options:'));
      console.log(
        styles.help(
          `Use ${styles.value('-l')} or ${styles.value('--local')} to delete local entries`
        )
      );
      console.log(
        styles.help(
          `Use ${styles.value('-c')} or ${styles.value('--cloud')} to delete cloud entries`
        )
      );
      console.log(
        styles.help(
          `Use ${styles.value('-b')} or ${styles.value('--both')} to delete all entries`
        )
      );
      return;
    }

    let storageToDelete;
    if (options.local) storageToDelete = 'local';
    if (options.cloud) storageToDelete = 'cloud';
    if (options.both) storageToDelete = 'both';

    console.log(styles.header('\n=== Delete Confirmation ==='));
    console.log(styles.warning('⚠️  This action cannot be undone!\n'));

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: styles.prompt(
          `Are you sure you want to delete your entries from ${styles.value(storageToDelete)} storage?`
        ),
        default: false,
      },
    ]);

    if (!confirm) {
      console.log(styles.info('\nDeletion cancelled. Your entries are safe.'));
      return;
    }

    console.log(styles.info('\nDeleting entries...'));

    let localEntryCount = 0;
    let cloudEntryCount = 0;

    if (options.local || options.both) {
      const entriesDir = path.join(os.homedir(), '.rflect', 'entries');
      try {
        const files = await fs.readdir(entriesDir);
        localEntryCount = files.filter((file) =>
          file.endsWith('_entry.txt')
        ).length;

        if (localEntryCount > 0) {
          await fs.rm(entriesDir, { recursive: true, force: true });
          console.log(
            styles.success(
              `Deleted ${styles.number(localEntryCount)} local entries`
            )
          );
        } else {
          console.log(styles.info('No local entries found.'));
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(styles.info('No local entries found.'));
        } else {
          throw error;
        }
      }
    }

    if (options.cloud || options.both) {
      cloudEntryCount = await Entry.countDocuments({
        userId: session.userId,
      });
      if (cloudEntryCount > 0) {
        await Entry.deleteMany({ userId: session.userId });
        console.log(
          styles.success(
            `Deleted ${styles.number(cloudEntryCount)} cloud entries`
          )
        );
      } else {
        console.log(styles.info('No cloud entries found.'));
      }
    }

    if (localEntryCount > 0 || cloudEntryCount > 0) {
      await User.updateOne({ _id: user._id }, { $set: { entryCount: 0 } });
      console.log(
        styles.success(
          `\n✨ Deletion complete! All entries removed from ${styles.value(storageToDelete)} storage.`
        )
      );
    } else {
      console.log(styles.info('\nNo entries found to delete.'));
    }

    console.log(
      styles.help(`\nStart fresh with ${styles.value('rflect write')}`)
    );
  } catch (error) {
    console.log(
      styles.error('\nError deleting entries: ') + styles.value(error.message)
    );
    console.log(styles.help('Please try again or check your connection.'));
  }
}

module.exports = deleteCommand;

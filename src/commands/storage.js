const User = require('../models/user');
const { isLoggedIn } = require('../utils/auth');
const { migrateCloudToLocal, migrateLocalToCloud } = require('../utils/sync');
const inquirer = require('inquirer');
const styles = require('../utils/styles');

async function storageCommand(options) {
    try {
        const session = await isLoggedIn();
        if (!session.isValid) {
            console.log(styles.error('You are currently not logged in.'));
            return;
        }

        const user = await User.findById(session.userId);
        if (!user) {
            console.log(styles.error('Something went wrong. Try logging out and back in!'));
            return;
        }

        if (!options.local && !options.cloud && !options.both) {
            console.log(styles.header('\n=== Storage Settings ===\n'));
            console.log(styles.info(`Current storage: ${styles.value(user.storagePreference)}`));
            console.log(styles.warning('\nNo storage preference provided. Available options:'));
            console.log(styles.help(`Use ${styles.value('-l')} or ${styles.value('--local')} for filesystem storage only`));
            console.log(styles.help(`Use ${styles.value('-c')} or ${styles.value('--cloud')} for cloud storage only`));
            console.log(styles.help(`Use ${styles.value('-b')} or ${styles.value('--both')} for both local and cloud storage`));
            return;
        }

        let newPreference;
        const currentPreference = user.storagePreference;
        if (options.local) newPreference = 'local';
        if (options.cloud) newPreference = 'cloud';
        if (options.both) newPreference = 'both';

        if (!options.local && !options.cloud && !options.both) {
            newPreference = currentPreference;
        }

        if (currentPreference !== newPreference && (options.local || options.cloud || options.both)) {
            console.log(styles.info('\nStorage Migration Required'));
            console.log(styles.info(`From: ${styles.value(currentPreference)}`));
            console.log(styles.info(`To: ${styles.value(newPreference)}`));

            const { confirm } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: styles.prompt('Would you like to migrate your existing entries?'),
                    default: true
                }
            ]);

            if (!confirm) {
                console.log(styles.warning('Migration cancelled. Storage preference not updated.'));
                return;
            }

            console.log(styles.info('\nStarting migration...'));

            if (currentPreference === 'local' && newPreference === 'cloud') {
                await migrateLocalToCloud(user._id);
            }
            if (currentPreference === 'cloud' && newPreference === 'local') {
                await migrateCloudToLocal(user._id);
            }
            if (currentPreference === 'local' && newPreference === 'both') {
                await migrateLocalToCloud(user._id);
            }
            if (currentPreference === 'cloud' && newPreference === 'both') {
                await migrateCloudToLocal(user._id);
            }
        }

        await User.updateOne({_id: user._id }, { storagePreference: newPreference });
        console.log(styles.success('\nStorage settings updated successfully! ✨'));
        console.log(styles.info(`Your entries will now be saved to ${styles.value(newPreference)} storage.`));

        if (newPreference === 'both') {
            console.log(styles.help('\nTip: Your entries are now backed up in both locations for extra safety.'));
        } else if (newPreference === 'cloud') {
            console.log(styles.help('\nTip: Your entries can now be accessed from any device.'));
        } else {
            console.log(styles.help('\nTip: Your entries are stored privately on your device.'));
        }

    } catch (error) {
        console.log(styles.error('\nError updating storage settings: ') + styles.value(error.message));
        console.log(styles.help('Try the command again or check your connection.'));
    }
}

module.exports = storageCommand;
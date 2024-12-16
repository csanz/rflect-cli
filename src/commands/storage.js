const User = require('../models/user');
const { isLoggedIn } = require('../utils/auth');
const { migrateCloudToLocal, migrateLocalToCloud } = require('../utils/sync');
const inquirer = require('inquirer');

async function storageCommand(options) {
    try {
        const session = await isLoggedIn();
        if (!session.isValid) {
            console.log('You are currently not logged in.');
            return;
        }

        const user = await User.findById(session.userId);
        if (!user) {
            console.log('Something went wrong. Try logging out and logging back in!');
            return;
        }

        if (!options.local && !options.cloud && !options.both) {
            console.log('No storage preference provided.');
            console.log(`You currently save your entries to ${user.storagePreference} storage option(s).`);
            console.log('Use -l or --local to save your entries to your local filesystem.');
            console.log('Use -c or --cloud to save your entries to the cloud.');
            console.log('Use -b or --both to save your entries to the cloud and locally.');
        }

        const currentPreference = user.storagePreference;
        let newPreference;
        if (options.local) newPreference = 'local';
        if (options.cloud) newPreference = 'cloud';
        if (options.both) newPreference = 'both';

        if (currentPreference !== newPreference) {
            const { confirm } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: `Do you want to migrate your entries from ${currentPreference} to ${newPreference} storage?`,
                    default: false
                }
            ]);

            if (!confirm) {
                console.log('Migration cancelled.');
                return;
            }

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

        await User.updateOne({_id: user._id}, {storagePreference: newPreference});
        console.log(`You currently save your entries to ${newPreference} storage option(s).`);
    } catch (error) {
        // Error messaging
        console.log("Error occurred when updating storage preference: ", error.message);
    }
}

module.exports = storageCommand;
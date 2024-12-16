const User = require('../models/user');
const { isLoggedIn } = require('../utils/auth');

/***** sync the data based on what is passed *****/

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

        let newPreference;
        if (options.local) newPreference = 'local';
        if (options.cloud) newPreference = 'cloud';
        if (options.both) newPreference = 'both';
        await User.updateOne({_id: user._id}, {storagePreference: newPreference});
        console.log(`You currently save your entries to ${user.storagePreference} storage option(s).`);
    } catch (error) {
        // Error messaging
        console.log("Error occurred when updating storage preference: ", error.message);
    }
}

async function migrateCloudToLocal(userId) {}

async function migrateLocalToCloud(userId) {}

module.exports = storageCommand;
const User = require('../models/user');
const { isLoggedIn } = require('../utils/auth');

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

        if (options.local) {
            await User.updateOne({_id: user._id}, {storagePreference: "local"});
        }
        if (options.cloud) {
            await User.updateOne({_id: user._id}, {storagePreference: "cloud"});
        }
        if (options.both) {
            await User.updateOne({_id: user._id}, {storagePreference: "both"});
        }

        console.log(`You currently save your entries to ${user.storagePreference} storage option(s).`);
    } catch (error) {
        // Error messaging
        console.log("Error occurred when updating storage preference: ", error.message);
    }
}

module.exports = storageCommand;
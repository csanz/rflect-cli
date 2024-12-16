const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { isLoggedIn } = require('../utils/auth');
const User = require('../models/user');
const Entry = require('../models/entry');
const inquirer = require('inquirer');

async function deleteCommand(options) {
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
            console.log('No delete option provided.');
            console.log(`You currently save your entries to ${user.storagePreference} storage option.`);
            console.log('Use -l or --local to delete entries from your local filesystem.');
            console.log('Use -c or --cloud to delete entries from the cloud.');
            console.log('Use -b or --both to delete entries from the cloud and locally.');
            return;
        }

        let storageToDelete;
        if (options.local) storageToDelete = 'local';
        if (options.cloud) storageToDelete = 'cloud';
        if (options.both) storageToDelete = 'both';

        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: `Are you sure you want to delete your entries from ${storageToDelete} storage?`,
                default: true
            }
        ]);

        if (!confirm) {
            console.log('Deletion cancelled.');
            return;
        }

        let localEntryCount = 0;
        let cloudEntryCount = 0;

        if (options.local || options.both) {
            const entriesDir = path.join(os.homedir(), '.rflect', 'entries');
            const files = await fs.readdir(entriesDir);
            localEntryCount = files.filter(file => file.endsWith('_entry.txt')).length;

            await fs.rm(entriesDir, {
                recursive: true,
                force: true
            });
        }

        if (options.cloud || options.both) {
            cloudEntryCount = await Entry.countDocuments({ userId: session.userId });
            await Entry.deleteMany({ userId: session.userId });
        }

        await User.updateOne(
            { _id: user._id },
            { $set: { entryCount: 0 } }
        );
        console.log(`Deleted ${localEntryCount} local entries and ${cloudEntryCount} cloud entries from ${storageToDelete} storage.`);
    } catch (error) {
        // Error messaging
        if (error.code === "ENOENT") {
            console.log("No local entries found to delete.");
        } else {
            console.log("Error occurred when delete stored entries: ", error.message);
        }
    }
}

module.exports = deleteCommand;
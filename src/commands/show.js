const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const User = require("../models/user");
const Entry = require("../models/entry");
const { isLoggedIn } = require('../utils/auth');
const displayEntry = require('../utils/entry');

const styles = require('../utils/styles');

async function showCommand(options) {
    try {
        const session = await isLoggedIn();
        if (!session.isValid) {
            console.log(styles.error('You are currently not logged in.'));
            return;
        }

        const user = await User.findById(session.userId);
        if (!user) {
            console.log(styles.error('Something went wrong. Try logging out and logging back in!'));
            return;
        }

        const storagePreference = user.storagePreference;
        if (!options.date && !options.all && !options.recent) {
            console.log(styles.warning('No option provided. Please enter one of the following:'));
            console.log(styles.help(`Use ${styles.value('-a')} or ${styles.value('--all')} to see all your entries saved in ${styles.value(storagePreference)} storage.`));
            console.log(styles.help(`Use ${styles.value('-r')} or ${styles.value('--recent')} to see your most recent entry saved in ${styles.value(storagePreference)} storage.`));
            console.log(styles.help(`Use ${styles.value('-d')} or ${styles.value('--date')} ${styles.value('<MM/DD/YYYY>')} to see an entry from the specified date.`));
            return;
        }

        if (storagePreference === "cloud" || storagePreference === "both") {
            if (options.all) {
                const entries = await Entry.find({ userId: user._id }).populate('promptId').sort({ createdAt: -1 });
                if (entries.length === 0) {
                    console.log(styles.error(`No entries found. Start writing with ${styles.value('rflect write')}!`));
                    return;
                }
                for (const entry of entries) {
                    displayEntry(entry, storagePreference);
                }
            }
            if (options.recent) {
                const mostRecentEntry = await Entry.findOne({ userId: user._id }).sort({ createdAt: -1 }).populate('promptId');
                if (!mostRecentEntry) {
                    console.log(styles.error(`No entries found. Start writing with ${styles.value('rflect write')}!`));
                    return;
                }
                displayEntry(mostRecentEntry, storagePreference);
            }
           if (options.date) {
               const date = new Date(options.date);
               // the date provided + 24 hours in case there are multiple entries throughout the specified date
               const entries = await Entry.find({ userId: user._id, createdAt: { $gte: date, $lte: new Date(date.getTime() + 24 * 60 * 60 * 1000 )}}).populate('promptId');
               if (entries.length === 0) {
                   console.log(styles.error(`No entries found for ${styles.value(options.date)}.`));
                   return;
               }
               for (const entry of entries) {
                   displayEntry(entry, storagePreference);
               }
           }
        }

        if (storagePreference === "local") {
            const entriesDir = path.join(os.homedir(), '.rflect', 'entries');
            const files = await fs.readdir(entriesDir);
            const entryFiles = files.filter(file => file.endsWith('_entry.txt'));

            if (entryFiles.length === 0) {
                console.log(styles.error(`No entries found. Start writing with ${styles.value('rflect write')}!`));
                return;
            }

            if (options.all) {
                // newest first
                const sortedEntries = entryFiles.sort().reverse();
                for (const file of sortedEntries) {
                    const content = await fs.readFile(path.join(entriesDir, file));
                    const entry = JSON.parse(content);
                    displayEntry(entry, storagePreference);
                }
            }
            if (options.recent) {
                const sortedEntries = entryFiles.sort().reverse();
                const mostRecentFile = sortedEntries[0];
                const content = await fs.readFile(path.join(entriesDir, mostRecentFile), 'utf8');
                const entry = JSON.parse(content);
                displayEntry(entry, storagePreference);
            }
            if (options.date) {
                const date = new Date(options.date).toLocaleDateString();
                let found = false;
                for (const file of entryFiles) {
                    const content = await fs.readFile(path.join(entriesDir, file), 'utf8');
                    const entry = JSON.parse(content);

                    if (new Date(entry.createdAt).toLocaleDateString() === date) {
                        displayEntry(entry, storagePreference);
                        found = true;
                    }
                }
                if (!found) {
                    console.log(styles.error(`No entries found for ${styles.value(date)}`));
                }
            }
        }
    } catch (error) {
        // Error messaging
        console.log(styles.error(`Error occurred when trying to receive your past entries: ${styles.value(error.message)}`));
    }
}

module.exports = showCommand;
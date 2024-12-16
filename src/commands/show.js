const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const User = require("../models/user");
const Entry = require("../models/entry");
const { isLoggedIn } = require('../utils/auth');
const displayEntry = require('../utils/entry');

async function showCommand(options) {
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

        const storagePreference = user.storagePreference;
        if (!options.date && !options.all && !options.recent) {
            console.log('No option provided. Please enter one of the following: ');
            console.log(`Use -a or --all to see all your entries saved in ${storagePreference} storage.`);
            console.log(`Use -r or --recent to see your most recent entry saved in ${storagePreference} storage.`);
            console.log(`Use -d or --date <date> to an entry from the specified date MM/DD/YYYY.`);
            return;
        }

        if (storagePreference === "cloud" || storagePreference === "both") {
            if (options.all) {
                const entries = await Entry.find({ userId: user._id }).populate('promptId').sort({ createdAt: -1 });
                if (entries.length === 0) {
                    console.log('No entries found.');
                    return;
                }
                for (const entry of entries) {
                    displayEntry(entry, storagePreference);
                }
            }
            if (options.recent) {
                const mostRecentEntry = await Entry.findOne({ userId: user._id }).sort({ createdAt: -1 }).populate('promptId');
                if (!mostRecentEntry) {
                    console.log('No entries found.');
                    return;
                }
                displayEntry(mostRecentEntry, storagePreference);
            }
           if (options.date) {
               const date = new Date(options.date);
               // the date provided + 24 hours in case there are multiple entries throughout the specified date
               const entries = await Entry.find({ userId: user._id, createdAt: { $gte: date, $lte: new Date(date.getTime() + 24 * 60 * 60 * 1000 )}}).populate('promptId');
               if (entries.length === 0) {
                   console.log(`No entries found for ${options.date}`);
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
                console.log('No entries found.');
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
            if (options.recent) {}
            if (options.date) {}
            // pull from local
            // --all show all entries (show date, prompt question, category, recorded resposne, duration and word count
            // --recent show most recently saved entry (same content)
            // --date <MM/DD/YYYY> show entry(ies) from the specified date (first convert the given date to ISO string in order to match with the filename)
        }
    } catch (error) {
        // Error messaging
        console.log("Error occurred when trying to receive your past entries: ", error.message);
    }
}

module.exports = showCommand;
const { isLoggedIn } = require('../utils/auth');
const User = require("../models/user");
const Entry = require("../models/entry");
const Prompt = require("../models/prompt");

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
                    console.log('\n=== Entry ===');
                    console.log(`Date: ${new Date(entry.createdAt).toLocaleDateString()}`);
                    console.log(`Prompt: ${entry.promptId ? entry.promptId.question : 'Unknown prompt'}`);
                    console.log(`Response: ${entry.content}`);
                    console.log(`Duration: ${entry.duration} minutes`);
                    console.log(`Word Count: ${entry.wordCount} words`);
                }
            }
            // --recent show most recently saved entry (same content)
            if (options.recent) {
                const mostRecentEntry = await Entry.findOne({ userId: user._id }).sort({ createdAt: -1 }).populate('promptId');
                if (!mostRecentEntry) {
                    console.log('No entries found.');
                    return;
                }

                console.log('\n=== Entry ===');
                console.log(`Date: ${new Date(mostRecentEntry.createdAt).toLocaleDateString()}`);
                console.log(`Prompt: ${mostRecentEntry.promptId ? mostRecentEntry.promptId.question : 'Unknown prompt'}`);
                console.log(`Response: ${mostRecentEntry.content}`);
                console.log(`Duration: ${mostRecentEntry.duration} minutes`);
                console.log(`Word Count: ${mostRecentEntry.wordCount} words`);
            }
            // --date <MM/DD/YYYY> show entry from the specified date
        }

        if (storagePreference === "local") {
            // pull from cloud
            // --all show all entries (show date, prompt question, category, recorded resposne, duration and word count
            // --recent show most recently saved entry (same content)
            // --date <MM/DD/YYYY> show entry(ies) from the specified date (first convert the given date to ISO string in order to match with the filename)
        }
    } catch (error) {
        // Error messaging
        console.log("Error occurred when trying to receive your past entries: ", error.message);
    }
}

function displayResults() {

}

module.exports = showCommand;
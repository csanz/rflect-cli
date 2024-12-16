const User = require('../models/user');
const { isLoggedIn } = require('../utils/auth');

async function statusCommand() {
    try {
        const session = await isLoggedIn();
        if (!session.isValid) {
            console.log(`CURRENT STATUS =========================`);
            console.log('Status: You are currently not logged in.');
            return;
        }

        const user = await User.findById(session.userId);
        if (!user) {
            console.log('Error: User not found.');
            return;
        }

        console.log(`CURRENT STATUS ====================================`);
        console.log(`You are currently logged in as ${session.username}.`);
        console.log(`You have been writing with rflect since ${user.createdAt.toLocaleDateString()}.`);
        console.log(`You have ${user.entryCount} total entries with the rflect CLI tool.`);
        console.log(`Storage preference for your rflect entries is set to ${user.storagePreference}.`);
    } catch (error) {
        // Error messaging
        console.log('Status check failed: ', error.message);
    }
}

module.exports = statusCommand;
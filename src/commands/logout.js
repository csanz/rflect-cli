const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { isLoggedIn } = require('../utils/auth');

async function logoutCommand() {
    try {
        const session = await isLoggedIn();
        if (!session.isValid) {
            console.log('You are not logged in.');
            return;
        }

        // Remove session file to log out
        const sessionPath = path.join(os.homedir(), '.rflect', 'session.json');
        await fs.unlink(sessionPath);
        console.log(`Successfully logged out of rflect. Come back soon, ${session.username}.`);
    } catch (error) {
        console.log('Logout failed: ', error.message);
    }
}

module.exports = logoutCommand;
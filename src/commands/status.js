const User = require('../models/user');
const { isLoggedIn } = require('../utils/auth');
const styles = require('../utils/styles');

async function statusCommand() {
    try {
        const session = await isLoggedIn();
        if (!session.isValid) {
            console.log(styles.header('\n=== Account Status ==='));
            console.log(styles.warning('Currently logged out. Use ') +
                styles.value('rflect login') +
                styles.warning(' to access your account.'));
            return;
        }

        const user = await User.findById(session.userId);
        if (!user) {
            console.log(styles.error('Account error: Unable to retrieve user information.'));
            console.log(styles.help('Try logging out and back in with ') +
                styles.value('rflect logout') +
                styles.help(' and ') +
                styles.value('rflect login'));
            return;
        }

        const joinDate = new Date(user.createdAt).toLocaleDateString();

        console.log(styles.header('\n=== Account Status ==='));
        console.log(styles.success(`Logged in as: ${styles.value(session.username)}`));
        console.log(styles.info(`Member since: ${styles.date(joinDate)}`));
        console.log(styles.info(`Total reflections: ${styles.number(user.entryCount)}`));
        console.log(styles.info(`Storage mode: ${styles.value(user.storagePreference)}`));

        if (user.entryCount === 0) {
            console.log(styles.help('\nTip: Start your first reflection with ') +
                styles.value('rflect write'));
        } else {
            console.log(styles.help('\nTip: View your past reflections with ') +
                styles.value('rflect show --all'));
        }

    } catch (error) {
        console.log(styles.error('Unable to retrieve account status: ') +
            styles.value(error.message));
        console.log(styles.help('If this persists, try logging out and back in.'));
    }
}

module.exports = statusCommand;
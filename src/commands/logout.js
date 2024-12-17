const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { isLoggedIn } = require('../utils/auth');
const styles = require('../utils/styles');

async function logoutCommand() {
  try {
    const session = await isLoggedIn();
    if (!session.isValid) {
      console.log(styles.warning('You are not currently logged in.'));
      console.log(styles.help(`Use ${styles.value('rflect login')} to access your account.`));
      return;
    }

    // Remove session file to log out
    const sessionPath = path.join(os.homedir(), '.rflect', 'session.json');
    await fs.unlink(sessionPath);

    console.log(styles.success('\n👋 Successfully logged out!'));
    console.log(styles.info(`See you soon, ${styles.value(session.username)}.`));
    console.log(
      styles.help(`\nUse ${styles.value('rflect login')} when you're ready to write again.`)
    );
  } catch (error) {
    console.log(styles.error('Logout failed: ') + styles.value(error.message));
    console.log(styles.help('Try logging in and out again.'));
  }
}

module.exports = logoutCommand;

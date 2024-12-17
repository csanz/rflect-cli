const inquirer = require('inquirer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { isLoggedIn, saveSession } = require('../utils/auth');
const styles = require('../utils/styles');

async function loginCommand() {
  try {
    // Check if user already logged in
    const session = await isLoggedIn();
    if (session.isValid) {
      console.log(
        styles.warning(`You are already logged in as ${styles.value(session.username)}.`)
      );
      console.log(styles.help(`Use ${styles.value('rflect logout')} to switch accounts.`));
      return;
    }

    console.log(styles.header('\n=== Login to rflect ===\n'));

    const response = await inquirer.prompt([
      {
        type: 'input',
        name: 'username',
        message: styles.prompt('Username:'),
        validate: (input) => {
          if (!input.trim()) {
            return styles.error('Username is required');
          }
          return true;
        },
      },
      {
        type: 'password',
        name: 'password',
        mask: true,
        message: styles.prompt('Password:'),
        validate: (input) => {
          if (!input.trim()) {
            return styles.error('Password is required');
          }
          return true;
        },
      },
    ]);

    console.log(styles.info('\nVerifying credentials...'));

    const user = await User.findOne({ username: response.username });
    if (!user) {
      console.log(styles.error('\nInvalid username or password.'));
      console.log(styles.help(`No account? Register with ${styles.value('rflect register')}`));
      return;
    }

    const passwordCheck = await bcrypt.compare(response.password, user.password);
    if (!passwordCheck) {
      console.log(styles.error('\nInvalid username or password.'));
      console.log(styles.help('Please try again.'));
      return;
    }

    // Generate session token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    await saveSession(token, user.username);

    console.log(styles.success('\n✨ Login successful!'));
    console.log(styles.info(`Welcome back, ${styles.value(user.username)}!`));

    if (user.entryCount === 0) {
      console.log(
        styles.help(`\nStart your first reflection with ${styles.value('rflect write')}`)
      );
    } else {
      console.log(
        styles.info(
          `You have ${styles.number(user.entryCount)} reflection${user.entryCount === 1 ? '' : 's'}.`
        )
      );
      console.log(
        styles.help(`\nTip: View your entries with ${styles.value('rflect show --all')}`)
      );
    }
  } catch (error) {
    console.log(styles.error('\nLogin failed: ') + styles.value(error.message));
    console.log(styles.help('Please try again or check your connection.'));
  }
}

module.exports = loginCommand;

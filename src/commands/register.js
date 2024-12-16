const inquirer = require('inquirer');
const bcrypt = require('bcrypt');
const styles = require('../utils/styles');

const User = require('../models/user');
const { isLoggedIn } = require('../utils/auth');

async function registerCommand() {
    try {
        const session = await isLoggedIn();
        if (session.isValid) {
            console.log(styles.warning(`You are already logged in as ${styles.value(session.username)}.`));
            console.log(styles.help(`Use ${styles.value('rflect logout')} to switch accounts.`));
            return;
        }

        console.log(styles.header('\n=== Create Your Account ===\n'));
        console.log(styles.info('Follow the prompts to set up your rflect account.\n'));

        const response = await inquirer.prompt([
            {
                type: 'input',
                name: 'username',
                message: styles.prompt('Choose a username:'),
                validate: (input) => {
                    if (input.trim().length < 3) {
                        return styles.error('Username must be at least 3 characters');
                    }
                    return true;
                },
            },
            {
                type: 'password',
                name: 'password',
                message: styles.prompt('Enter a password:'),
                mask: true,
                validate: (input) => {
                    if (input.trim().length < 6) {
                        return styles.error('Password must be at least 6 characters');
                    }
                    return true;
                },
            },
            {
                type: 'password',
                name: 'confirmPassword',
                message: styles.prompt('Confirm your password:'),
                mask: true,
                validate: (input, answers) => {
                    if (input !== answers.password) {
                        return styles.error('Passwords do not match');
                    }
                    return true;
                },
            },
            {
                type: 'list',
                name: 'storagePreference',
                message: styles.prompt('\nChoose where to save your entries:'),
                choices: [
                    {
                        name: '💻 Local Storage Only (Private to this device)',
                        value: 'local'
                    },
                    {
                        name: '☁️  Cloud Storage Only (Access anywhere)',
                        value: 'cloud'
                    },
                    {
                        name: '✨ Both Local & Cloud Storage (Maximum safety)',
                        value: 'both'
                    }
                ],
                default: 'local'
            }
        ]);

        if (await User.findOne({ username: response.username })) {
            console.log(styles.error('\nUsername already exists.'));
            console.log(styles.help(`Try ${styles.value('rflect register')} again with a different username.`));
            return;
        }

        console.log(styles.info('\nCreating your account...'));

        const hashedPassword = await bcrypt.hash(response.password, 10);
        const user = new User({
            username: response.username,
            password: hashedPassword,
            storagePreference: response.storagePreference
        });
        await user.save();

        // Success
        console.log(styles.success('\n✨ Account created successfully! '));
        console.log(styles.info(`Welcome to rflect, ${styles.value(response.username)}!`));
        console.log(styles.info(`Your entries will be saved to ${styles.value(response.storagePreference)} storage.`));

        // Next
        console.log(styles.help('\nNext steps:'));
        console.log(styles.help(`1. Login with ${styles.value('rflect login')}`));
        console.log(styles.help(`2. Start writing with ${styles.value('rflect write')}`));
        console.log(styles.help(`3. View your entries with ${styles.value('rflect show')}`));

    } catch (error) {
        console.log(styles.error('\nRegistration failed: ') + styles.value(error.message));
        console.log(styles.help('Please try again or check your connection.'));
    }
}

module.exports = registerCommand;
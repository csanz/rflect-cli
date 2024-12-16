const inquirer = require('inquirer');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const { isLoggedIn } = require('../utils/auth');

async function registerCommand() {
    try {
        const session = await isLoggedIn();
        if (session.isValid) {
            console.log(`You are already logged in as ${session.username}.`);
            return;
        }

        const response = await inquirer.prompt([
            // Choose a username
            {
                type: 'input',
                name: 'username',
                message: 'Choose a username: ',
                validate: (input) => {
                    if (input.trim().length < 3) {
                        return 'Username must be at least 3 characters.';
                    }
                    return true;
                },
            },
            // Choose a password
            {
                type: 'password',
                name: 'password',
                message: 'Enter a password: ',
                mask: true,
                validate: (input) => {
                    if (input.trim().length < 6) {
                        return 'Password must be at least 6 characters.';
                    }
                    return true;
                },
            },
            // Confirm password
            {
                type: 'password',
                name: 'confirmPassword',
                message: 'Confirm your password: ',
                mask: true,
                validate: (input, response) => {
                    if (input !== response.password) {
                        return 'Passwords do not match.';
                    }
                    return true;
                },
            },
            {
                type: 'list',
                name: 'storagePreference',
                message: 'Choose your storage preference: ',
                choices: [
                    { name: 'Local Storage Only', value: 'local' },
                    { name: 'Cloud Storage Only', value: 'cloud' },
                    { name: 'Both Local & Cloud Storage', value: 'both'}
                ],
                default: 'local'
            }
        ]);

        // Check if username exists
        if (await User.findOne({ username: response.username })) {
            console.log('Username already exists. Please run \'rflect register\' to try again.');
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(response.password, 10);

        // Create user in MongoDB
        const user = new User({
            username: response.username,
            password: hashedPassword,
            storagePreference: response.storagePreference
        });
        // Success messaging
        await user.save();

        console.log(`Registration successful for ${response.username}! You can now login using 'rflect login'.`);
        console.log(`Storage preference for your rflect entries is set to ${response.storagePreference}.`);
    } catch (error) {
        // Error messaging
        console.log('Registration failed: ', error.message);
    }
}

module.exports = registerCommand;
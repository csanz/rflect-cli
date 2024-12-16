const inquirer = require('inquirer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { isLoggedIn, saveSession } = require('../utils/auth');

async function loginCommand() {
    try {
        // Check if user already logged in
        const session = await isLoggedIn();
        if (session.isValid) {
            console.log(`You are already logged in as ${session.username}.`);
            return;
        }

        const response = await inquirer.prompt([
            {
                type: 'input',
                name: 'username',
                message: 'Username: ',
            },
            {
                type: 'password',
                name: 'password',
                mask: true,
                message: 'Password: ',
            }
        ])

        const user = await User.findOne({ username: response.username });
        if (!user) {
            console.log('Invalid username or password. Please register for access or try again.');
            return;
        }

        const passwordCheck = await bcrypt.compare(response.password, user.password);
        if (!passwordCheck) {
            console.log('Invalid username or password. Please try again.');
            return;
        }

        // Generate session token
        const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET);
        await saveSession(token, user.username);
        console.log(`Welcome, ${user.username}! You currently have ${user.entryCount} entries. Start reflecting.`);
    } catch (error) {
        // Error messaging
        console.log('Login failed: ', error.message);
    }
}

module.exports = loginCommand;
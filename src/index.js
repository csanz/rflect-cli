#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const { program } = require('commander');

(async function connectDB() {
    const db = process.env.DB_URI.replace('<password>', process.env.DB_PW);
    await mongoose.connect(db);
})();

function wrap(action) {
    return async function(...args) {
        try {
            // calls the function with arguments passed to wrapper
            await action(...args);
        }
        finally {
            // ensures db connection closes to avoid the terminal hanging
            await mongoose.connection.close();
        }
    }
}

// Command scripts
const registerCommand = require('./commands/register');
const loginCommand = require('./commands/login');
const logoutCommand = require('./commands/logout');
const statusCommand = require('./commands/status');
const writeCommand = require('./commands/write');
const storageCommand = require('./commands/storage');
const deleteCommand = require('./commands/delete');
const showCommand = require('./commands/show');

// Description
program
    .name('rflect')
    .description('📝 Your personal space for guided reflections and mindful journaling.')
    .version('1.0.0');

// Entries
program
    .command('write')
    .description('Start a new reflection with a thoughtfully selected prompt.')
    .action(wrap(writeCommand));
program
    .command('show')
    .description('Browse and revisit your past reflections.')
    .option('-a, --all', 'Display all your saved reflections.')
    .option('-r, --recent', 'View your latest reflection.')
    .option('-d, --date <date>', 'Find reflections from a specific date (MM/DD/YYYY).')
    .action(wrap(showCommand));

// Authentication & Registration
program
    .command('status')
    .description('View your account information and settings.')
    .action(wrap(statusCommand));
program
    .command('register')
    .description('Begin your reflection journey - create an account.')
    .action(wrap(registerCommand));
program
    .command('login')
    .description('Access your personal reflection space.')
    .action(wrap(loginCommand));
program
    .command('logout')
    .description('Safely end your reflection session.')
    .action(wrap(logoutCommand));

// Storage Settings
program
    .command('storage')
    .description('Choose where to keep your reflections safe.')
    .option('-l, --local', 'Store entries privately on your device.')
    .option('-c, --cloud', 'Save entries securely in the cloud.')
    .option('-b, --both', 'Keep entries backed up in both locations.')
    .action(wrap(storageCommand));

// Delete
program
    .command('delete')
    .description('Thoughtfully manage your reflection history.')
    .option('-l, --local', 'Remove entries stored on your device.')
    .option('-c, --cloud', 'Remove entries from cloud storage.')
    .option('-b, --both', 'Clear all entries from both storage locations.')
    .action(wrap(deleteCommand));

program.parse(process.argv);
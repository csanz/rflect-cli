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
const reflectCommand = require('./commands/reflect');
const storageCommand = require('./commands/storage');

// Description
program
    .name('rflect')
    .description('📝 A CLI tool for guided reflections and journaling.')
    .version('1.0.0');

// Entries
program
    .command('reflect')
    .description('Write a guided reflection based on the given prompt.')
    .action(wrap(reflectCommand));
program
    .command('show')
    .description('View your past reflections.')
    .option('-a, --all', 'Show all saved reflections.')
    .option('-d, --date <date>', 'Show entries from a specific date (MM/DD/YYYY)')
    .action();

// Authentication & Registration
program
    .command('status')
    .description('Check your login and account status.')
    .action(wrap(statusCommand));
program
    .command('register')
    .description('Create a new account.')
    .action(wrap(registerCommand));
program
    .command('login')
    .description('Login to your account.')
    .action(wrap(loginCommand));
program
    .command('logout')
    .description('Logout from your account.')
    .action(wrap(logoutCommand));

// Configuration
program
    .command('storage')
    .description('Backup your entries to the cloud for safekeeping.')
    .option('-l, --local', 'Save entries to your filesystem (default).')
    .option('-c, --cloud', 'Save entries to the cloud.')
    .option('-b, --both', 'Save entries to both local and cloud storage.')
    .action(wrap(storageCommand));

// Delete
program
    .command('delete')
    .description('Manage and clear your reflection history')
    .option('-l, --local', 'Delete entries from local filesystem.')
    .option('-c, --cloud', 'Delete entries from cloud storage.')
    .option('-a, --all', 'Delete all entries from both local and cloud.')
    .action();

/* Wrapped (Data) general
 - # of entries,
 - which prompt was given the most,
 - which category had the most entries (across all users in cloud db),
 - average number of minutes people tend to reflect,
 - # of users

 Wrapped (data) user-specific
 - # of entries by user
 - total time spent
 - shortest entry (word count + date)
 - largest entry (word count + date)
 - category with the most entries
 - category with the least entries
 */

program.parse(process.argv);

// Add styling once complete (user chalk or node:utils)
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

// Description
program
    .name('rflect')
    .description('📝 A CLI tool for guided reflections and journaling.')
    .version('1.0.0');

// Entries
program
    .command('reflect')
    .description('Write a guided reflection based on the given prompt.')
    .action();
program
    .command('show')
    .description('View your past reflections.')
    .option('-a, --all', 'Show all saved reflections.')
    .argument('[date]', 'Show entries from a specific date (MM/DD/YYYY)')
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
    .command('backup')
    .description('Backup your entries to the cloud for safekeeping.')
    .action();
program
    .command('sync')
    .description('Choose where to read your entries from (defaults to filesystem).')
    .option('-l, --local', 'Read entries from your filesystem (default).')
    .option('-c, --cloud', 'Read entries from the cloud.')
    .option('-b, --both', 'Save entries to both local and cloud storage.')
    .action();

program.parse(process.argv);
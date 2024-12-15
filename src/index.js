#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const { program } = require('commander');

(async function connectDB() {
    const db = process.env.DB_URI.replace('<password>', process.env.DB_PW);
    await mongoose.connect(db);
})();

program.command('write').description('Write a free-form journal entry about anything you want.').action();
program.command('reflect').description('Write a guided reflection with prompts.').action();
program.command('show').description('View your past reflections.').option('-a, --all', 'Show all saved reflections.').argument('[date]', 'Show entries from a specific date (MM/DD/YYYY)').action();

program.command('status').description('Check your login status').action();
program.command('register').description('Create a new account').action();
program.command('login').description('Login to your account.').action();
program.command('logout').description('Logout from your account').action();
program.command('config').description('Configure your storage preferences.').action();

program.parse(process.argv);
#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const { program } = require('commander');
const inquirer = require('inquirer');

(async function connectDB() {
    const db = process.env.DB_URI.replace('<password>', process.env.DB_PW);
    await mongoose.connect(db);
})();

program.command('test').description('test command').action(() => {
    console.log("Test commands works...!");
});

program.parse(process.argv);
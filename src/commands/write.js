const { isLoggedIn } = require('../utils/auth');
const User = require('../models/user');
const Prompt = require('../models/prompt');
const Entry = require('../models/entry');
const inquirer = require('inquirer');
const styles = require('../utils/styles');

const fs = require('fs').promises;
const path = require('path');
const os = require('os');

async function writeCommand() {
  try {
    const session = await isLoggedIn();
    if (!session.isValid) {
      console.log(styles.error('You are currently not logged in.'));
      return;
    }

    const randomPrompt = await Prompt.aggregate([{ $sample: { size: 1 } }]);
    const prompt = randomPrompt[0];

    await Prompt.updateOne({ _id: prompt._id }, { $inc: { usageCount: 1 } });

    console.log(styles.header('\n=== Time to Reflect ===\n'));
    console.log(styles.info('Take your time. Your response will be saved when you press Enter.'));

    const startTime = Date.now();
    const response = await inquirer.prompt([
      {
        type: 'input',
        name: 'response',
        message: styles.prompt(prompt.question) + '\n\n',
        validate: (input) => {
          if (!input.trim()) {
            return styles.error('Please provide a response.');
          }
          return true;
        },
      },
    ]);
    const endTime = Date.now();
    const durationMinutes = Math.round((endTime - startTime) / 60000);
    const wordCount = countWords(response.response);
    const creationDate = new Date().toISOString();

    const user = await User.findOne({ username: session.username });
    if (user) {
      await User.updateOne({ _id: user._id }, { $inc: { entryCount: 1 } });
    }

    const entry = new Entry({
      userId: user._id,
      promptId: prompt._id,
      content: response.response,
      duration: durationMinutes,
      wordCount: wordCount,
      createdAt: creationDate,
    });

    console.log(styles.info('\nSaving your reflection...'));

    if (user.storagePreference === 'both' || user.storagePreference === 'cloud') {
      await entry.save();
    }

    if (user.storagePreference === 'both' || user.storagePreference === 'local') {
      const entriesDir = path.join(os.homedir(), '.rflect', 'entries');
      await fs.mkdir(entriesDir, { recursive: true });

      const filename = `${creationDate.replace(/:/g, '-')}_entry.txt`;
      const filePath = path.join(entriesDir, filename);

      await fs.writeFile(
        filePath,
        JSON.stringify({
          userId: user._id.toString(),
          promptId: prompt._id.toString(),
          promptQuestion: prompt.question,
          content: response.response,
          duration: durationMinutes,
          wordCount: wordCount,
          createdAt: creationDate,
        })
      );
    }

    // Stats display
    console.log(styles.success('\nReflection complete! ✨'));
    console.log(styles.info(`Time spent: ${styles.number(durationMinutes)} minute(s)`));
    console.log(styles.info(`Words written: ${styles.number(wordCount)}`));

    // Storage confirmation
    let storageMessage;
    if (user.storagePreference === 'both') {
      storageMessage = 'Entry saved locally and in the cloud.';
    } else if (user.storagePreference === 'local') {
      storageMessage = 'Entry saved locally.';
    } else {
      storageMessage = 'Entry saved to the cloud.';
    }
    console.log(styles.success(storageMessage));
    console.log(
      styles.info('\nUse ') +
        styles.value('rflect show --recent') +
        styles.info(' to view this entry again.')
    );
  } catch (error) {
    console.log(styles.error('Reflection prompt failed: ') + styles.value(error.message));
  }
}

function countWords(text) {
  return text.trim().split(/\s+/).length;
}

module.exports = writeCommand;

const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const styles = require('../utils/styles');

async function createRflectDirectory() {
  try {
    console.log(styles.header('\n=== 🚀 Installing rflect ===\n'));

    // Directories needed for rflect
    const primaryDirectory = path.join(os.homedir(), '.rflect');
    const entriesDirectory = path.join(primaryDirectory, 'entries');
    await fs.mkdir(primaryDirectory, { recursive: true }); // no duplicates
    await fs.mkdir(entriesDirectory, { recursive: true });
    console.log(styles.success('✨ Directory setup complete!'));

    // Initial user config
    const configLocation = path.join(primaryDirectory, 'config.json');
    const config = {
      user: {
        name: '',
        createdAt: new Date().toISOString(),
      },
      goals: {
        streak: {
          goal: 0,
          type: null // daily, weekly, monthly
        },
        wordCount: {
          goal: 0,
          type: null // daily, weekly, monthly
        },
        entryCount: {
          goal: 0,
          type: null // daily, weekly, monthly
        }
      },
      stats: {
        totalEntries: 0,
        totalWords: 0,
        totalTimeSpent: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastEntry: null,
        entryCountByPromptType: {
          question: 0,
          quote: 0,
          gratitude: 0,
          growth: 0,
          mindfulness: 0
        }
      },
      tags: []
    }

    try {
      await fs.access(configLocation); // checks existence otherwise throws an error
      console.log(styles.info(`Found existing configuration: ${configLocation}`));
    } catch {
      await fs.writeFile(configLocation, JSON.stringify(config, null, 2));
      console.log(styles.success(`Created initial configuration file: ${configLocation}.`));
    }

    // Welcome and next steps
    console.log(styles.header('\n=== 👋🏼 Welcome to rflect! ==='));
    console.log(styles.info('\nGet started with these commands:'));
    console.log(styles.help('1. Set up your profile:'));
    console.log(styles.value('   rflect init'));
    console.log(styles.help('\n2. Start writing:'));
    console.log(styles.value('   rflect write'));
    console.log(styles.help('\n3. View your entries:'));
    console.log(styles.value('   rflect show --recent\n'));
  } catch (error) {
    console.error(styles.error('\nSetup error: ') + styles.value(error.message));
    process.exit(1);
  }
}

createRflectDirectory();
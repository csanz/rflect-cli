const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const styles = require('../utils/styles');

async function checkConfig() {
  try {
    const configLocation = path.join(os.homedir(), '.rflect', 'config.json');
    const configFile = await fs.readFile(configLocation, 'utf8');
    const config = JSON.parse(configFile);

    // Presence of name indicates user has run init command before
    if (!config.user.name.trim()) {
      return {
        isFirstTime: true,
        config: config
      }
    }
    return {
      isFirstTime: false,
      config: config
    }
  } catch (error) {
    console.log(styles.error('\nConfiguration not found.'));
    console.log(styles.help('Run: ') + styles.value('rflect init'));
    return false;
  }
}

async function updateConfig(config) {
  const configLocation = path.join(os.homedir(), '.rflect', 'config.json');
  await fs.writeFile(configLocation, JSON.stringify(config, null, 2));
}

module.exports = { checkConfig, updateConfig };
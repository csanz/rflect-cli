const fs = require('fs').promises;
const path = require('path');

const promptLocation = path.join(__dirname, '../data/prompts.json');

async function getAllPrompts() {
  try {
    const data = await fs.readFile(promptLocation, 'utf8');
    const prompts = JSON.parse(data);
    return prompts.map((prompt) => prompt.question);
  } catch (error) {
    // error messaging - add later
    console.log(error);
  }
}

async function getPromptsByCategory(category) {
  try {
    const data = await fs.readFile(promptLocation, 'utf8');
    const prompts = JSON.parse(data);
    return prompts
      .filter((prompt) => prompt.category === category)
      .map((prompt) => prompt.question);
  } catch (error) {
    // error messaging - add later
  }
}

async function getRandomPrompt() {
  try {
    const data = await fs.readFile(promptLocation, 'utf8');
    const prompts = JSON.parse(data);
    const unusedPrompts = prompts.filter((prompt) => prompt.usageCount === 0); // prioritize unused
    const selectedPrompts = unusedPrompts.length > 0 ? unusedPrompts : prompts; // if all have been used at least once, just pick from prompts at random
    return selectedPrompts[Math.floor(Math.random() * selectedPrompts.length)];
  } catch (error) {
    // error messaging
  }
}

async function incrementPromptUsageCount(id) {
  try {
    const data = await fs.readFile(promptLocation, 'utf8');
    const prompts = JSON.parse(data);
    prompts[prompts.findIndex((prompt) => prompt.id === id)].usageCount++;
    await fs.writeFile(promptLocation, JSON.stringify(prompts, null, 2));
  } catch (error) {
    // error messaging
    console.log(error);
  }
}

module.exports = {
  incrementPromptUsageCount,
  getAllPrompts,
  getPromptsByCategory,
  getRandomPrompt,
};

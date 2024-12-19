const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { format, differenceInMinutes } = require('date-fns');
const { updateStatsAndGoals } = require('./stats');

async function saveEntry({
  prompt,
  body,
  tags = [],
  mood,
  startTime,
  endTime,
  durationString,
  config,
}) {
  const timestamp = format(startTime, 'MM-dd-yyyy-HHmm');
  const durationInMinutes = differenceInMinutes(endTime, startTime);
  const entry = {
    prompt,
    content: {
      body,
      wordCount: body
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length,
      tags,
      mood,
    },
    metadata: {
      timestamp,
      durationInMinutes,
      durationString,
      created: startTime.toISOString(),
    },
  };

  try {
    // Save the entry file
    const entriesDir = path.join(os.homedir(), '.rflect', 'entries');
    await fs.mkdir(entriesDir, { recursive: true });
    const filename = `${timestamp}.json`;
    await fs.writeFile(path.join(entriesDir, filename), JSON.stringify(entry, null, 2));

    // Update stats and get messages
    const { messages } = await updateStatsAndGoals(config, entry);
    return {
      entry,
      messages,
    };
  } catch (error) {
    throw new Error(`Failed to save entry: ${error.message}`);
  }
}

async function getEntries() {}

async function getEntryByTag(tag) {}

async function getEntryByPromptCategory(tag) {}

async function getEntryByDate(date) {}

async function getLastEntry() {}

async function formatEntryForDisplay(entry) {
  // takes an entry object and returns an array of styled strings
  // print to user wherever necessary
}

module.exports = {
  saveEntry,
  getEntries,
  getEntryByTag,
  getEntryByPromptCategory,
  getEntryByDate,
  getLastEntry,
};

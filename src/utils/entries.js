const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { format, differenceInMinutes, parse } = require('date-fns');
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

async function getAllEntries() {
  try {
    const entriesDir = path.join(os.homedir(), '.rflect', 'entries');
    const files = await fs.readdir(entriesDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    return await Promise.all(
      jsonFiles.map(async (filename) => {
        const filePath = path.join(entriesDir, filename);
        const content = await fs.readFile(filePath, 'utf8');
        return JSON.parse(content);
      })
    );
  } catch (error) {
    throw new Error(`Failed to read entries: ${error.message}`);
  }
}

async function getEntryDates() {
  try {
    const entriesDir = path.join(os.homedir(), '.rflect', 'entries');
    const files = await fs.readdir(entriesDir);
    return files.filter(file => file.endsWith('.json')).map(filename => {
      const dateString = filename.replace('.json', '');
      const parsedDate = parse(dateString, 'MM-dd-yyyy-HHmm', new Date());
      const formattedDate = format(parsedDate, 'MMM dd yyyy \'at\' h:mm a');
      return {
        filename: filename,
        date: formattedDate
      };
    });
  } catch (error) {
    throw new Error(`Failed to read entries: ${error.message}`);
  }
}

async function getEntryByTag(tag) {}

async function getEntryByPromptCategory(tag) {}

async function getEntryByDate(date) {}

async function getLastEntry() {}

async function formatEntryForDisplay(entry) {
  // takes an entry object and returns an array of styled strings
  // print to user wherever necessary
}
getEntryDates();

module.exports = {
  saveEntry,
  getEntryDates,
  getAllEntries,
  getEntryByTag,
  getEntryByPromptCategory,
  getEntryByDate,
  getLastEntry,
};

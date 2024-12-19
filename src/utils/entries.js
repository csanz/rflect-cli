const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { format, differenceInMinutes, parse, parseISO, isAfter } = require('date-fns');
const { updateStatsAndGoals } = require('./stats');
const styles = require('./styles');

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
  const parsedDate = parse(timestamp, 'MM-dd-yyyy-HHmm', new Date());
  const dateString = format(parsedDate, 'MMM dd yyyy \'at\' h:mm a');

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
      dateString,
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
    const entries = await getAllEntries();
    return entries.map(entry => {
        return {
          filename: `${entry.metadata.timestamp}.json`,
          dateString: entry.metadata.dateString,
          created: entry.metadata.created
        };
    });
  } catch (error) {
    throw new Error(`Failed to read entries: ${error.message}`);
  }
}

async function getEntryByTag(tag) {
  try {
    const entries = await getAllEntries();
    return entries.filter(entry => entry.content.tags.includes(tag));
  } catch (error) {
    throw new Error(`Failed to read entries: ${error.message}`);
  }
}

async function getEntryByPromptCategory(category) {
  try {
    const entries = await getAllEntries();
    return entries.filter(entry => entry.prompt.category.includes(category));
  } catch (error) {
    throw new Error(`Failed to read entries: ${error.message}`);
  }
}

async function getEntryByFileName(filename) {
  const entriesDir = path.join(os.homedir(), '.rflect', 'entries');
  const filePath = path.join(entriesDir, filename);
  const file = await fs.readFile(filePath, 'utf8');
  return JSON.parse(file);
}

async function getLastEntry() {
  try {
    const entries = await getAllEntries();
    return entries.sort((a, b) => {
      const dateA = parseISO(a.metadata.created);
      const dateB = parseISO(b.metadata.created);
      return isAfter(dateA, dateB) ? -1 : 1;
    })[0];
  } catch (error) {
    throw new Error(`Failed to read entries: ${error.message}`);
  }
}

async function formatEntryForDisplay(entry, index = 1) {
  const { prompt, content, metadata } = entry;

  console.log(styles.entryHeader(index));
  console.log(styles.entryDate(metadata.dateString));
  console.log(styles.entryPrompt(prompt.question));
  console.log(styles.entryPromptCategory(prompt.category));
  console.log(styles.entryMood(content.mood));
  console.log(styles.entryTags(content.tags));
  console.log(styles.entryStats(metadata.durationString, content.wordCount));
  console.log(styles.entryResponse(content.body));
}

module.exports = {
  saveEntry,
  getEntryDates,
  getAllEntries,
  getEntryByTag,
  getEntryByPromptCategory,
  getEntryByFileName,
  getLastEntry,
  formatEntryForDisplay
};

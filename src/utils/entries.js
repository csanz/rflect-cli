// write entries in
// format entries into json
// format entries to display
// get existing entries as an object
// update config with related content

const fs = require('fs/promises');
const path = require('path');
const { format, differenceInMinutes } = require('date-fns');
const os = require('os');

async function saveEntry({ prompt, body, tags = [], mood, startTime, endTime, durationString}) {
  const timestamp = format(startTime, 'MM-dd-yyyy-HHmm');
  const durationInMinutes = differenceInMinutes(endTime, startTime);
  const wordCount = body.trim().split(/\s+/).filter(word => word.length > 0).length

  const entry = {
    prompt,
    tags,
    mood,
    wordCount,
    body,
    metadata: {
      timestamp,
      durationInMinutes,
      durationString,
      created: startTime.toISOString(),
      lastModified: new Date().toISOString(),
    },
  }

  const entriesDir = path.join(os.homedir(), '.rflect', 'entries');
  await fs.mkdir(entriesDir, { recursive: true });

  const filename = `${timestamp}.json`;
  await fs.writeFile(path.join(entriesDir, filename), JSON.stringify(entry, null, 2));
  return entry;
}

module.exports = { saveEntry };
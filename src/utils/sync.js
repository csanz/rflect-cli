const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const Entry = require('../models/entry');
const Prompt = require('../models/prompt');
const styles = require('../utils/styles');

const entriesDir = path.join(os.homedir(), '.rflect', 'entries');

async function migrateCloudToLocal(userId) {
  let migratedCount = 0;
  await fs.mkdir(entriesDir, { recursive: true });

  try {
    console.log(styles.info('\nFetching entries from cloud...'));
    const cloudEntries = await Entry.find({ userId }).populate('promptId');

    if (cloudEntries.length === 0) {
      console.log(styles.info('No cloud entries found to migrate.'));
      return;
    }

    console.log(styles.info(`Found ${styles.number(cloudEntries.length)} entries to migrate.`));

    for (const entry of cloudEntries) {
      const filename = `${entry.createdAt.toISOString().replace(/:/g, '-')}_entry.txt`;
      const filePath = path.join(entriesDir, filename);

      try {
        await fs.access(filePath);
        console.log(styles.warning(`Skipping: ${styles.value(filename)} (already exists)`));
      } catch {
        await fs.writeFile(
          filePath,
          JSON.stringify({
            userId: entry.userId.toString(),
            promptId: entry.promptId._id.toString(),
            promptQuestion: entry.promptId.question,
            content: entry.content,
            duration: entry.duration,
            wordCount: entry.wordCount,
            createdAt: entry.createdAt.toISOString(),
          })
        );
        migratedCount++;
        console.log(styles.success(`Migrated: ${styles.value(filename)}`));
      }
    }

    console.log(
      styles.success(
        `\n✨ Migration complete! ${styles.number(migratedCount)} entries saved locally.`
      )
    );
  } catch (error) {
    console.log(styles.error('Failed to migrate cloud entries:'), styles.value(error.message));
  }
}

async function migrateLocalToCloud(userId) {
  let migratedCount = 0;

  try {
    console.log(styles.info('\nScanning local entries...'));
    const files = await fs.readdir(entriesDir);
    const entryFiles = files.filter((file) => !file.startsWith('.') && file.endsWith('_entry.txt'));

    if (entryFiles.length === 0) {
      console.log(styles.info('No local entries found to migrate.'));
      return;
    }

    console.log(styles.info(`Found ${styles.number(entryFiles.length)} entries to process.`));

    for (const file of entryFiles) {
      const filePath = path.join(entriesDir, file);
      try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        const entry = JSON.parse(fileContent);

        const prompt = await Prompt.findOne({
          question: entry.promptQuestion,
        });
        if (!prompt) {
          console.log(styles.warning(`Skipping: ${styles.value(file)} (prompt not found)`));
          continue;
        }

        const existingEntry = await Entry.findOne({
          userId: userId,
          duration: entry.duration,
          wordCount: entry.wordCount,
          promptId: prompt._id,
          createdAt: entry.createdAt,
        });

        if (!existingEntry) {
          const newEntry = new Entry({
            userId: userId,
            promptId: prompt._id,
            content: entry.content,
            duration: entry.duration,
            wordCount: entry.wordCount,
            createdAt: entry.createdAt,
          });
          await newEntry.save();
          migratedCount++;
          console.log(styles.success(`Migrated: ${styles.value(file)}`));
        } else {
          console.log(styles.warning(`Skipping: ${styles.value(file)} (already exists in cloud)`));
        }
      } catch (parseError) {
        console.log(
          styles.error(`Error processing ${styles.value(file)}:`),
          styles.value(parseError.message)
        );
        continue;
      }
    }

    console.log(
      styles.success(
        `\n✨ Migration complete! ${styles.number(migratedCount)} entries saved to cloud.`
      )
    );
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(styles.warning('\nNo local entries directory found.'));
      console.log(styles.help('Start writing entries locally before migrating.'));
    } else {
      console.log(styles.error('\nFailed to migrate local entries:'), styles.value(error.message));
    }
  }
}

module.exports = { migrateCloudToLocal, migrateLocalToCloud };

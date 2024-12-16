const styles = require('./styles');

function displayEntry(entry, type) {
    console.log(styles.entryHeader());
    console.log(styles.entryDate(new Date(entry.createdAt).toLocaleDateString()));
    console.log(styles.entryPrompt(type === 'cloud' || type === 'both'
        ? (entry.promptId ? entry.promptId.question : 'Unknown prompt')
        : (entry.promptQuestion ? entry.promptQuestion : 'Unknown prompt')));
    console.log(styles.entryResponse(entry.content));
    console.log(styles.entryStats(entry.duration, entry.wordCount));
}

module.exports = displayEntry;
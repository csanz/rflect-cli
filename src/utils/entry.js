function displayEntry(entry, type) {
    console.log('\n=== Entry ===');
    console.log(`Date: ${new Date(entry.createdAt).toLocaleDateString()}`);

    type === 'cloud' || type === 'both'
        ? console.log(`Prompt: ${entry.promptId ? entry.promptId.question : 'Unknown prompt'}`)
        : console.log(`Prompt: ${entry.promptQuestion ? entry.promptQuestion : 'Unknown prompt'}`);
    console.log(`Response: ${entry.content}`);
    console.log(`Duration: ${entry.duration} minutes`);
    console.log(`Word Count: ${entry.wordCount} words`);
}

module.exports = displayEntry;
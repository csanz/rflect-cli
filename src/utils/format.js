const styles = require('./styles');

function formatQuoteInPrompt(prompt) {
  const quoteMatch = prompt.match(/'([^']+)'/);
  if (quoteMatch) {
    const [fullMatch, quote] = quoteMatch;
    return prompt.replace(fullMatch, styles.quote(quote));
  }
  return prompt;
}

function formatDuration(duration) {
  const { seconds, minutes, hours } = duration;

  const hString = hours ? `${hours}h ` : '';
  const mString = minutes ? `${minutes}m ` : '';
  const sString = seconds ? `${seconds}s` : '';
  return `${hString}${mString}${sString}`;
}

function formatEntryForDisplay(entry, index = 1) {
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

function formatStatsForDisplay(stats) {
  // --streak progress (e.g. you've written 5 days in a row or 2 weeks in a row; best streak was x)
  // --goals progress (e.g. progress toward set word count and entry count
  // --entries count, total word count, average word count, largest word count and shortest word count + references to the file (date)
  // --time stats => total duration spent writing, average time spent on entries
  // --all is all of the above
}

module.exports = { formatQuoteInPrompt, formatDuration, formatEntryForDisplay };

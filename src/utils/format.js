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

module.exports = { formatQuoteInPrompt, formatDuration };

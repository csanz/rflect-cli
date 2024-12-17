function updateStreak(lastEntryDate, currentDays = 0) {
  if (!lastEntryDate) return {
    days: 1,
    lastEntry: new Date()
  };

  const now = new Date();
  const lastEntry = new Date(lastEntryDate);
  const hoursSinceLastEntry = (now - lastEntry) / (1000 * 60 * 60);

  // If less than 24 hours, increment streak, otherwise reset to 1
  return {
    days: hoursSinceLastEntry < 24 ? currentDays + 1 : 1,
    lastEntry: now
  };
}

module.exports = updateStreak;
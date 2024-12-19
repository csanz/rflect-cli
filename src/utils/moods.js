const { checkConfig } = require('./config');
const styles = require('./styles');
const { format } = require('date-fns');
const Calendar = require('calendar-js');

async function getAllMoods() {
  const { config } = await checkConfig();
  const { moods } = config.stats;

  if (Object.keys(moods).length === 0) {
    console.log(styles.info('\nNo moods recorded.'));
    console.log(styles.help('Select your mood at the start of your entry: rflect write'));
    return;
  }

  console.log(styles.header('\n=== All Moods ===\n'));
  Object.keys(moods).forEach(mood => {
    const count = moods[mood].dates.length
    console.log(`You were ${mood} when writing ${count} entries out of ${config.stats.totalEntries} total entries.`);
  });
}

async function displayMoodCal(targetMood) {
  const { config } = await checkConfig();
  const { moods } = config.stats;
  const now = new Date();

  if (!moods[targetMood]) {
    console.log(styles.warning(`\nNo entries found with mood: ${targetMood}`));
    return;
  }

  const currentMonth = format(now, 'MM');
  const moodDates = moods[targetMood].dates.filter(date => date.split('-')[0] === currentMonth).map(date => parseInt(date.split('-')[1]));
  const emoji = targetMood.split(' ')[0];
  const monthCalendar = Calendar().of(now.getFullYear(), now.getMonth()).calendar;

  console.log(styles.header(`\n=== ${targetMood} Calendar: ${format(now, 'MMMM yyyy')} ===\n`));
  console.log(styles.value('Su  Mo  Tu  We  Th  Fr  Sa'));

  monthCalendar.forEach(week => {
    const weekLine = week.map(day => {
      if (day === 0) return '';
      return moodDates.includes(day)
        ? `${emoji}  `
        : `${day.toString().padStart(2)}  `;
    }).join('');
    console.log(weekLine);
  });

  const monthCount = moodDates.length;
  console.log(styles.info(`\nYou felt ${targetMood} on ${monthCount} ${monthCount === 1 ? 'day' : 'days'} this month`));
}

module.exports = { getAllMoods, displayMoodCal };
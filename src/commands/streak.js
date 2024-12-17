const { isLoggedIn } = require('../utils/auth');
const styles = require('../utils/styles');
const User = require('../models/user');

async function streakCommand(options) {
  try {
    const session = await isLoggedIn();
    if (!session.isValid) {
      console.log(styles.error('You are currently not logged in.'));
      return;
    }

    const user = await User.findById(session.userId);
    if (!user) {
      console.log(styles.error('Something went wrong. Try logging out and back in!'));
      return;
    }

    if (!user.streaks) {
      console.log(styles.info('No streak data yet.'));
      console.log(styles.help(`Start your streak with ${styles.value('rflect write')}`));
      return;
    }

    if (!options.current && !options.best) {
      console.log(styles.warning('No option provided. Try:'));
      console.log(styles.help(`${styles.value('rflect streak --current')} to see your current streak`));
      console.log(styles.help(`${styles.value('rflect streak --best')} to see your best streak`));
      return;
    }

    if (options.current) {
      // Calculate hours since last entry, or default to 24 if no previous entry exists
      const hoursSinceLastEntry = user.streaks.lastEntry ? (new Date() - new Date(user.streaks.lastEntry)) / (1000 * 60 * 60) : 24;
      if (hoursSinceLastEntry >= 24) {
        console.log(styles.warning('Your streak has ended.'));
        console.log(styles.help(`Write today to start a new streak!`));
      } else {
        console.log(styles.success(`🔥 Current streak: ${styles.number(user.streaks.current)} days`));
        console.log(styles.help(`Keep it going with ${styles.value('rflect write')}`));
      }
    }

    if (options.best) {
      if (!user.streaks.best || user.streaks.best === 0) {
        console.log(styles.info('No streak record yet.'));
        console.log(styles.help('Write daily to build your first streak!'));
      } else {
        console.log(styles.success(`✨ Best streak: ${styles.number(user.streaks.best)} days`));
      }
    }
  } catch (error) {
    console.log(styles.error('Error checking streak: ') + styles.value(error.message));
  }
}

module.exports = streakCommand;
const { checkConfig } = require('../utils/config');
const styles = require('../utils/styles');
const { format, differenceInDays } = require('date-fns');
const { getShortestLongestEntryDuration } = require('../utils/entries');

async function statsCommand(options) {
  try {
    const { isFirstTime, config } = await checkConfig();
    if (isFirstTime) {
      console.log(styles.warning(`\nWelcome to rflect! Let's get you set up first.`));
      console.log(
        styles.info('Run ') +
          styles.value('rflect init') +
          styles.info(' to start your reflection journey.')
      );
      return;
    }

    if (!options.all && !options.streak && !options.goals && !options.entries && !options.time) {
      console.log(styles.help('Available options:'));
      console.log(
        styles.value('  rflect stats --all      ') + styles.info('Show comprehensive statistics')
      );
      console.log(
        styles.value('  rflect stats --streak   ') + styles.info('View your writing streak')
      );
      console.log(
        styles.value('  rflect stats --goals    ') + styles.info('Check progress on writing goals')
      );
      console.log(
        styles.value('  rflect stats --entries  ') + styles.info('See entry and word count stats')
      );
      console.log(
        styles.value('  rflect stats --time     ') + styles.info('View time-related statistics')
      );
      return;
    }

    const { goals, stats } = config;
    const daysSinceCreation = differenceInDays(new Date(), new Date(config.user.createdAt));

    if (options.all) {
      // Entry Statistics
      console.log(styles.header('Entry Statistics'));
      const averageWords = Math.round(stats.totalWords / stats.totalEntries) || 0;
      console.log(
        styles.info('Account Created: ') +
          styles.date(format(new Date(config.user.createdAt), 'MMM dd, yyyy'))
      );
      console.log(styles.info('Total Entries Written: ') + styles.number(stats.totalEntries));
      console.log(styles.info('Total Words Written: ') + styles.number(stats.totalWords));
      console.log(styles.info('Average Words per Entry: ') + styles.number(averageWords));

      if (stats.lastEntry) {
        console.log(
          styles.info('Latest Entry: ') +
            styles.date(format(new Date(stats.lastEntry), 'MMM dd, yyyy'))
        );
      }

      // Streak Information
      console.log(styles.subheader('Writing Streak'));
      console.log(styles.info('Current Streak: ') + styles.number(`${stats.currentStreak} days`));
      console.log(styles.info('Longest Streak: ') + styles.number(`${stats.longestStreak} days`));

      // Writing Duration Statistics
      console.log(styles.subheader('Time Statistics'));
      console.log(styles.info('Days Since Creation: ') + styles.number(daysSinceCreation));

      const totalHours = Math.floor(stats.writingTime.totalMinutes / 60);
      const remainingMinutes = stats.writingTime.totalMinutes % 60;
      console.log(
        styles.info('Total Time Writing: ') + styles.number(`${totalHours}h ${remainingMinutes}m`)
      );
      console.log(
        styles.info('Average Time per Entry: ') +
          styles.number(`${stats.writingTime.averageMinutes}m`)
      );

      // Entry Duration Range
      try {
        const durationStats = await getShortestLongestEntryDuration();
        if (durationStats && durationStats.shortest && durationStats.longest) {
          const { shortest, longest } = durationStats;
          console.log(styles.subheader('Entry Duration Range'));
          console.log(
            styles.info('Shortest Entry: ') +
              styles.number(`${shortest.metadata.durationInMinutes}m`) +
              styles.info(' on ') +
              styles.date(format(new Date(shortest.metadata.created), 'MMM dd, yyyy'))
          );

          console.log(
            styles.info('Longest Entry: ') +
              styles.number(`${longest.metadata.durationInMinutes}m`) +
              styles.info(' on ') +
              styles.date(format(new Date(longest.metadata.created), 'MMM dd, yyyy'))
          );
        }
      } catch {
        // Silently skip duration range if there's an error
      }

      // Deleted Content (if any)
      if (stats.deletedEntries > 0 || stats.deletedWords > 0) {
        console.log(styles.subheader('Deleted Content'));
        if (stats.deletedEntries > 0) {
          console.log(styles.info('Entries Deleted: ') + styles.number(stats.deletedEntries));
        }
        if (stats.deletedWords > 0) {
          console.log(styles.info('Words Deleted: ') + styles.number(stats.deletedWords));
        }
      }
    }

    if (options.streak) {
      console.log(styles.header('Writing Streak'));

      console.log(styles.info('Current Streak: ') + styles.number(`${stats.currentStreak} days`));
      console.log(styles.info('Longest Streak: ') + styles.number(`${stats.longestStreak} days`));

      if (stats.currentStreak === 0) {
        console.log(styles.info('Start a new streak by writing today!'));
      } else if (stats.currentStreak === stats.longestStreak) {
        console.log(styles.success("🔥 You're on your best streak ever! Keep it going!"));
      } else if (stats.currentStreak > 0) {
        const daysToRecord = stats.longestStreak - stats.currentStreak;
        console.log(
          stats.currentStreak === 1
            ? styles.success('🎯 Great start! Write again tomorrow to keep your streak alive.')
            : styles.success(`🔥 Keep writing! ${daysToRecord} more days to beat your record.`)
        );
      }
    }

    if (options.goals) {
      console.log(styles.header('Writing Goals Progress'));
      const { entries, words } = goals;
      const entryPercentage = Math.round((entries.current / entries.goal) * 100) || 0;
      const wordPercentage = Math.round((words.current / words.goal) * 100) || 0;

      console.log(styles.subheader('Entry Goals'));
      if (entries.goal > 0) {
        console.log(
          styles.info(`Goal: Write ${styles.number(entries.goal)} entries ${entries.type}`)
        );
        console.log(styles.info(`Progress: ${styles.number(entries.current)} entries completed`));
        console.log(styles.info(`Completion: ${styles.number(entryPercentage)}%`));
        if (entryPercentage >= 100) {
          console.log(
            styles.success("🎯 You've reached your entry goal! Consider setting a new challenge.")
          );
        } else if (entryPercentage >= 75) {
          console.log(styles.success('💪 Almost there! Keep up the great work.'));
        } else if (entryPercentage >= 50) {
          console.log(styles.info("👍 You're making steady progress."));
        } else {
          console.log(styles.info('✍️  Keep writing - every entry counts!'));
        }
      } else {
        console.log(
          styles.info(
            'No entry goals set. Use ' +
              styles.value('rflect config --goal') +
              ' to set writing goals.'
          )
        );
      }

      console.log(styles.subheader('Word Count Goals'));
      if (words.goal > 0) {
        console.log(styles.info(`Goal: Write ${styles.number(words.goal)} words ${words.type}`));
        console.log(styles.info(`Progress: ${styles.number(words.current)} words written`));
        console.log(styles.info(`Completion: ${styles.number(wordPercentage)}%`));
        if (wordPercentage >= 100) {
          console.log(
            styles.success("🎯 You've reached your word count goal! Ready for a bigger challenge?")
          );
        } else if (wordPercentage >= 75) {
          console.log(styles.success('💪 Getting close! The finish line is in sight.'));
        } else if (wordPercentage >= 50) {
          console.log(styles.info("👍 Halfway there - you're making great progress!"));
        } else {
          console.log(styles.info('✍️  Keep going - every word counts!'));
        }
      } else {
        console.log(
          styles.info(
            'No word count goals set. Use ' +
              styles.value('rflect config --goal') +
              ' to set writing goals.'
          )
        );
      }

      if (entries.goal > 0 || words.goal > 0) {
        console.log(styles.subheader('Goal Period'));
        console.log(
          styles.info(`Started: `) +
            styles.date(format(new Date(entries.periodStart), 'MMM dd, yyyy'))
        );

        if (entries.goal > 0) {
          console.log(
            styles.info(`Entry Goal Frequency: `) +
              styles.date(
                entries.type === 'daily'
                  ? 'Every day'
                  : entries.type === 'weekly'
                  ? 'Every week'
                  : 'Every month'
              )
          );
        }

        if (words.goal > 0) {
          console.log(
            styles.info(`Word Count Goal Frequency: `) +
              styles.date(
                words.type === 'daily'
                  ? 'Every day'
                  : words.type === 'weekly'
                  ? 'Every week'
                  : 'Every month'
              )
          );
        }
      }
    }

    if (options.entries) {
      console.log(styles.header('Entry Statistics'));

      const averageWords = Math.round(stats.totalWords / stats.totalEntries) || 0;
      console.log(
        styles.info('Account Created: ') +
          styles.date(format(new Date(config.user.createdAt), 'MMM dd, yyyy'))
      );
      console.log(styles.info('Total Entries Written: ') + styles.number(stats.totalEntries));
      console.log(styles.info('Total Words Written: ') + styles.number(stats.totalWords));
      console.log(styles.info('Average Words per Entry: ') + styles.number(averageWords));

      if (stats.lastEntry) {
        console.log(
          styles.info('Last Entry: ') +
            styles.date(format(new Date(stats.lastEntry), 'MMM dd, yyyy'))
        );
      }

      if (stats.deletedEntries > 0 || stats.deletedWords > 0) {
        console.log(styles.subheader('Deleted Content'));
        if (stats.deletedEntries > 0) {
          console.log(styles.info('Entries Deleted: ') + styles.number(stats.deletedEntries));
        }
        if (stats.deletedWords > 0) {
          console.log(styles.info('Words Deleted: ') + styles.number(stats.deletedWords));
        }
      }
    }

    if (options.time) {
      console.log(styles.header('Time Statistics'));
      console.log(
        styles.info('Account Created: ') +
          styles.date(format(new Date(config.user.createdAt), 'MMM dd, yyyy'))
      );
      console.log(styles.info('Days Since Creation: ') + styles.number(daysSinceCreation));

      const totalHours = Math.floor(stats.writingTime.totalMinutes / 60);
      const remainingMinutes = stats.writingTime.totalMinutes % 60;
      console.log(
        styles.info('Total Time Writing: ') + styles.number(`${totalHours}h ${remainingMinutes}m`)
      );
      console.log(
        styles.info('Average Time per Entry: ') +
          styles.number(`${stats.writingTime.averageMinutes}m`)
      );

      try {
        const durationStats = await getShortestLongestEntryDuration();
        if (durationStats && durationStats.shortest && durationStats.longest) {
          const { shortest, longest } = durationStats;
          console.log(styles.subheader('Entry Duration Range'));
          console.log(
            styles.info('Shortest Entry: ') +
              styles.number(`${shortest.metadata.durationInMinutes}m`) +
              styles.info(' on ') +
              styles.date(format(new Date(shortest.metadata.created), 'MMM dd, yyyy'))
          );

          console.log(
            styles.info('Longest Entry: ') +
              styles.number(`${longest.metadata.durationInMinutes}m`) +
              styles.info(' on ') +
              styles.date(format(new Date(longest.metadata.created), 'MMM dd, yyyy'))
          );
        }
      } catch {
        // Skip
      }
    }
  } catch (error) {
    console.error(styles.error('Error displaying statistics: ') + styles.value(error.message));
    console.log(styles.info('Please try again or report this issue.'));
  }
}

module.exports = statsCommand;

# rflect ![NPM Version](https://img.shields.io/npm/v/rflect)

📝 A CLI tool for guided reflections and journaling, offering a variety of prompts and tracking features to enhance your writing journey.

## Features

- 🤔 Thoughtfully curated reflection prompts across multiple categories (mindfulness, gratitude, growth, etc.)
- 📊 Track your writing progress and streaks
- 📝 Journaling stats including word count and duration tracking for each entry
- 🔍 Easy access to past reflections with date, tag and mood-based filtering
- 💾 Works offline using your local filesystem, ensuring your data is secure and not shared

## Reflection Categories

- 🎯 Growth - Professional and personal development
- 🙏 Gratitude - Practicing daily thankfulness
- 💭 Mindfulness - Present moment awareness
- 💡 Question - Thought-provoking inquiries
- 💌 Quote - Reflections inspired by meaningful quotes

## Installation

```bash
npm install -g rflect
```

## Getting Started

During setup, you'll set up a configuration file to store your preferences:

```bash
rflect init
```

## Storage

`rflect` uses local storage:

- Entries are stored in `~/.rflect/entries/`
- Complete offline access
- Private journaling as it saves the entries in the user's file system

## Commands

### Writing & Viewing

**Start a New Reflection**

```bash
rflect write
```

Begin a new reflection session with a thoughtfully curated prompt.

**Browse Past Reflections**

```bash
rflect show [options]
```

- `--all`: Display all entries.
- `--recent`: View the most recent entry.
- `--date`: Find entries from a specific date.
- `--tag`: Find reflections with a specific tag.
- `--category`: Find reflections by prompt type.
- `--mood`: Find reflections by mood.

### Prompts, Tags, Mood

**Browse Available Writing Prompts**

```bash
rflect prompts [options]
```

- `--all`: View all prompts.
- `--category <type>`: View prompts by category (mindfulness, gratitude, growth, question, or quote).

**Discover Themes in Your Reflection Journey**

```bash
rflect tags [options]
```

- `--all`: View all your used tags.
- `--top`: See your 5 most frequent reflection themes.

**Track Your Emotional Journey**

```bash
rflect moods [options]
```

- `--frequency`: See patterns in your recorded moods.
- `--calendar`: View your monthly mood patterns.

### User Settings & Stats

**Set Up Your rflect Account**

```bash
rflect init
```

Initialize your account with initial preferences.

**Customize Your Reflection Preferences**

```bash
rflect config [options]
```

- `--install`: Reinstall rflect configuration file and directories.
- `--name`: Set your display name.
- `--show`: View current settings.
- `--editor <boolean>`: Toggle system editor usage.
- `--goal`: Configure word count or writing frequency goals.
- `--type <entries|words>`: Goal type.
- `--frequency <daily|weekly|monthly>`: Goal frequency.
- `--value <number>`: Goal value.

**View Insights About Your Writing Journey**

```bash
rflect stats [options]
```

- `--all`: Show comprehensive statistics.
- `--streak`: View streak and progress towards streak goal.
- `--goals`: Show progress on all writing goals.
- `--entries`: Display entry count and word statistics.
- `--time`: Display time-related statistics.

### Entry Management

**Manage Your Reflection History**

```bash
rflect delete [options]
```

- `--all`: Remove all entries.
- `--date`: Remove entries from a specific date.

### Future Features

**See a list of upcoming features**

```bash
rflect upcoming
```

Discover upcoming features like custom themes, cloud backup, search, reminders, encryption, and AI insights.

## Tech

#### Requires: **Node.js**

- **Core**: `commander`, `inquirer`
- **Dates & Calendar**: `calendar-js`, `date-fns`
- **Styling**: `chalk`
- **Dev Tools**: `nodemon`, `eslint`, `prettier`

#### Scripts

```bash
npm run dev     # Run with nodemon for development
npm run lint    # Run ESLint checks
npm run format  # Format code with Prettier
```

## Issues

_Found a bug? Have a suggestion?_ Please open an [issue](https://github.com/aniqatc/rflect-cli/issues) on GitHub.

## Contributing

Contributions are welcome!

## License

This project is licensed under the MIT License.

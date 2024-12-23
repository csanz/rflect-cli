# rflect

[![NPM Version](https://img.shields.io/npm/v/rflect)](https://www.npmjs.com/package/rflect)
[![GitHub Issues](https://img.shields.io/github/issues/aniqatc/rflect-cli)](https://github.com/aniqatc/rflect-cli/issues)
[![License](https://img.shields.io/github/license/aniqatc/rflect-cli)](https://github.com/aniqatc/rflect-cli/blob/main/LICENSE)

📝 A CLI tool for guided reflections and journaling, offering a variety of prompts and tracking features to enhance your writing journey.

## ✨ Key Features

- 🤔 **Thoughtful Prompts**: Curated reflections across multiple categories
    - Growth: Professional and personal development
    - Gratitude: Practicing daily thankfulness
    - Mindfulness: Present moment awareness
    - Question-based: Thought-provoking inquiries
    - Quote-inspired: Reflections from meaningful words

- 📊 **Comprehensive Tracking**
    - Writing progress and streaks
    - Word count and writing duration
    - Mood and tag-based entry filtering

- 💾 **Secure & Private**
    - Offline-first design
    - Local filesystem storage
    - Complete data ownership

## 🚀 Quick Start

### Installation

```bash
npm install -g rflect
```

### Initial Setup

During setup, you'll set up a configuration file to store your preferences:

```bash
rflect init
```

## Privacy & Storage

`rflect` uses local storage:

- Entries are stored in `~/.rflect/entries/`
- Complete offline access
- Private journaling as it saves the entries in the user's file system

## Commands Overview

### Writing & Viewing

**Start a New Reflection**: 
Begin a new reflection session with a thoughtfully curated prompt.

```bash
rflect write
```

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

**Set Up Your rflect Account**: 
Initialize your account with initial preferences.

```bash
rflect init
```


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

**See a list of upcoming features**: Discover upcoming features like custom themes, cloud backup, search, reminders, encryption, and AI insights.


```bash
rflect upcoming
```

## Tech

- **Core**: `node.js`, `commander`, `inquirer`
- **Date Handling**: `calendar-js`, `date-fns`
- **Styling**: `chalk`
- **Development**: `nodemon`, `eslint`, `prettier`

## 🔧 Requirements

- **Node.js**: Version 14.0.0 or higher
- **Operating System**: macOS, Linux, or Windows

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

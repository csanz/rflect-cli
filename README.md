# rflect
📝 A CLI journaling tool that guides you through daily reflections with thoughtfully curated prompts.

## Features
- 🤔 Thoughtfully curated reflection prompts across multiple categories (mindfulness, gratitude, growth, etc.)
- 💾 Flexible storage options (local filesystem, cloud, or both)
- 🔐 Secure user authentication
- 📊 Track your writing progress and streaks
- 📝 Journaling stats including word count and duration tracking for each entry
- 🔍 Easy access to past reflections with date-based filtering
- 📱 Works offline with local storage option
- 🔄 Seamless syncing between local and cloud storage

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
**During registration, you'll**:
- Choose a username (minimum 3 characters)
- Set a secure password (minimum 6 characters)
- Select your preferred storage option

```bash
rflect register
```

**Basic Commands**
```bash
rflect write     # Start a new reflection
rflect show      # View past entries
rflect status    # Check account status
rflect streak    # View your writing streak
```

## Security
- Passwords are hashed using `bcrypt`
- JWT-based authentication
- Entries are stored securely with user-specific encryption
- Local storage is protected within your own home directory
- Session management for secure login/logout

## Storage
`rflect` offers three storage settings:
1. **Local Storage** `--local`
   - Entries stored in `~/.rflect/entries/`
   - Complete offline access
   - Private journaling as it is saves the entries in the user's file system
2. **Cloud Storage** `--cloud`
   - Storage in MongoDB
   - Access entries across devices 
   - Automatic backups
3. **Both** `--both`
   - Synchronized local and cloud storage
   - Seamless offline and online transitions
   - Ensures data backs up in two locations

Change storage settings anytime:
```bash
rflect storage --local  # Switch to local storage
rflect storage --cloud  # Switch to cloud storage
rflect storage --both   # Use both storage options
```

## Managing Entries
**View your entries**:
```bash
rflect show --all               # Show all entries
rflect show --recent           # Show most recent entry
rflect show --date MM/DD/YYYY  # Show entries from specific date
```

**Delete entries**:
```bash
rflect delete --local  # Delete local entries
rflect delete --cloud  # Delete cloud entries
rflect delete --both   # Delete all entries
```

**Tracking progress**:
```bash
rflect streak --current  # View current streak
rflect streak --best     # View longest streak
```

## Issues
*Found a bug? Have a suggestion?* Please open an [issue](https://github.com/aniqatc/rflect-cli/issues) on GitHub.

## Contributing
Contributions are welcome!

## License
This project is licensed under the MIT License.

---

## Tech
#### Requires: **Node.js, MongoDB**
- **Core**: `commander`, `inquirer`, `mongoose`, `chalk`, `dotenv`
- **Security**: `bcrypt`, `jsonwebtoken`
- **Dev Tools**: `nodemon`, `eslint`, `prettier`

#### Scripts
```bash
npm run dev     # Run with nodemon for development
npm run lint    # Run ESLint checks
npm run format  # Format code with Prettier
```

#### Environment Setup
Create a `.env` file in the root directory:
```bash
DB_URI=your_mongodb_connection_string
DB_PW=your_database_password
JWT_SECRET=your_jwt_secret_key
```


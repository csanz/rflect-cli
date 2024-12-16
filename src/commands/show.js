// Imports

// Use isLoggedIn() from auth to get user details
// Pull Users db to get storage preference
// If cloud [x] or both, pull entries from cloud to display to user
// If local, pull entries from local files to display to user

// --all / -a => shows all entries
// --date <date> / -d <date> => shows entries for specific date
// show without flags => shows most recent entry

// Display entries

/**************************************************/
async function showCommand(options) {
    console.log(options);
}

module.exports = showCommand;
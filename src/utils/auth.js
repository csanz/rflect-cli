const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const jwt = require('jsonwebtoken');

// Session path (homedir/.rflect/session.json)
const sessionPath = path.join(os.homedir(), '.rflect', 'session.json');

async function isLoggedIn() {
  try {
    const data = await fs.readFile(sessionPath, 'utf8');
    const session = JSON.parse(data);

    // Verify token
    const decoded = jwt.verify(session.token, process.env.JWT_SECRET);
    return {
      isValid: true,
      username: session.username,
      userId: decoded.userId,
    };
  } catch {
    return { isValid: false };
  }
}

async function saveSession(token, username) {
  // Create the .rflect directory if it doesn't exist
  await fs.mkdir(path.dirname(sessionPath), { recursive: true });
  await fs.writeFile(sessionPath, JSON.stringify({ token, username }));
}

module.exports = { isLoggedIn, saveSession };

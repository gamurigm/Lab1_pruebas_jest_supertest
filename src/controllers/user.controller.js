const users = [];
let nextId = 1;

function getUsers(req, res) {
  return res.json(users);
}

function createUser(req, res) {
  const { name, email } = req.body || {};
  if (!name || typeof name !== 'string' || !email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Invalid input: name and email are required' });
  }
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid input: email must be valid' });
  }
  const user = { id: nextId++, name: name.trim(), email: email.trim() };
  users.push(user);
  return res.status(201).json(user);
}

// Helper for tests to reset the in-memory store
function resetUsers() {
  users.length = 0;
  nextId = 1;
}

module.exports = {
  getUsers,
  createUser,
  resetUsers,
};

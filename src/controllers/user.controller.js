const users = [];
let nextId = 1;

function getUsers(req, res) {
  return res.json(users);
}

function createUser(req, res) {
  let { name, email } = req.body || {};
  if (!name || typeof name !== 'string' || !email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Invalid input: name and email are required' });
  }

  name = name.trim();
  email = email.trim();

  if (name.length < 3) {
    return res.status(400).json({ error: 'Invalid input: name must be at least 3 characters' });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid input: email must be valid' });
  }

  const domain = email.split('@')[1];
  if (domain === 'example.com') {
    return res.status(400).json({ error: 'Invalid input: example.com is not allowed' });
  }

  if (users.some(u => u.email === email)) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  const user = { id: nextId++, name, email };
  users.push(user);
  return res.status(201).json(user);
}

function getUserById(req, res) {
  const id = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json(user);
}

function updateUser(req, res) {
  const id = parseInt(req.params.id, 10);
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  let { name, email } = req.body || {};
  if (name && typeof name === 'string') {
    name = name.trim();
    if (name.length < 3) {
      return res.status(400).json({ error: 'Invalid input: name must be at least 3 characters' });
    }
    users[userIndex].name = name;
  }
  
  if (email && typeof email === 'string') {
    email = email.trim();
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid input: email must be valid' });
    }
    // Check for duplicate email if email is being changed
    if (email !== users[userIndex].email && users.some(u => u.email === email)) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    users[userIndex].email = email;
  }

  return res.json(users[userIndex]);
}

function deleteUser(req, res) {
  const id = parseInt(req.params.id, 10);
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(userIndex, 1);
  return res.status(204).send();
}

// Helper for tests to reset the in-memory store
function resetUsers() {
  users.length = 0;
  nextId = 1;
}

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  resetUsers,
};

const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Sample in-memory database to store user data
let users = [];

// Create a new user
app.post('/api/users', (req, res) => {
  const { username, email, role } = req.body;

  // Validation
  if (!username || !email || !role) {
    return res.status(400).json({ message: 'Please provide username, email, and role' });
  }

  // Check if username is already taken
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Create new user object
  const newUser = {
    id: uuid.v4(),
    username,
    email,
    role,
    createdDate: new Date(),
    updatedDate: new Date()
  };

  // Add the user to the database
  users.push(newUser);

  return res.status(201).json(newUser);
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const user = users.find(user => user.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json(user);
});

// Get user by username
app.get('/api/users/username/:username', (req, res) => {
  const username = req.params.username;
  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json(user);
});

// Get all users
app.get('/api/users', (req, res) => {
  return res.json(users);
});

// Update user by ID
app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const { username, email, role } = req.body;

  // Find the user by ID
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Update user details
  users[userIndex] = {
    ...users[userIndex],
    username: username || users[userIndex].username,
    email: email || users[userIndex].email,
    role: role || users[userIndex].role,
    updatedDate: new Date()
  };

  return res.json(users[userIndex]);
});

// Delete user by ID
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;

  // Find user index by ID
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Remove user from array
  users.splice(userIndex, 1);

  return res.status(204).send(); // No content response
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

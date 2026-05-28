const express = require('express');
const router = express.Router();

const PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

router.get('/', (req, res) => {
  if (req.session.loggedIn) return res.redirect('/students');
  res.render('login', { error: null });
});

router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    req.session.loggedIn = true;
    res.redirect('/students');
  } else {
    res.render('login', { error: 'Incorrect password. Try again.' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;

const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'attendance-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8 hours
}));

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.loggedIn) return next();
  res.redirect('/');
}

// Routes
app.use('/', require('./routes/auth'));
app.use('/students', requireAuth, require('./routes/students'));
app.use('/attendance', requireAuth, require('./routes/attendance'));

app.listen(PORT, () => {
  console.log(`\n✅ Attendance System running at http://localhost:${PORT}\n`);
});

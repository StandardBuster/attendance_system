const express = require('express');
const router = express.Router();
const db = require('../supabase');

router.get('/', async (req, res) => {
  try {
    const students = await db.getStudents();
    const summary = await db.getAttendanceSummary();

    // Build stats per student
    const stats = {};
    for (const s of summary) {
      if (!stats[s.student_id]) stats[s.student_id] = { present: 0, absent: 0 };
      stats[s.student_id][s.status] = (stats[s.student_id][s.status] || 0) + 1;
    }

    res.render('students', { students, stats, message: req.query.message || null, error: null });
  } catch (e) {
    res.render('students', { students: [], stats: {}, message: null, error: e.message });
  }
});

router.post('/add', async (req, res) => {
  const { name, student_id, class: cls } = req.body;
  try {
    await db.addStudent(name, student_id, cls);
    res.redirect('/students?message=Student added successfully');
  } catch (e) {
    const students = await db.getStudents().catch(() => []);
    res.render('students', { students, stats: {}, message: null, error: e.message });
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    await db.deleteStudent(req.params.id);
    res.redirect('/students?message=Student removed');
  } catch (e) {
    res.redirect('/students?message=Error: ' + e.message);
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../supabase');

// Take attendance page
router.get('/take', async (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];
  try {
    const [students, existing] = await Promise.all([
      db.getStudents(),
      db.getAttendanceForDate(date)
    ]);
    const existingMap = {};
    for (const r of existing) existingMap[r.student_id] = r.status;
    res.render('take-attendance', { students, date, existingMap, message: null, error: null });
  } catch (e) {
    res.render('take-attendance', { students: [], date, existingMap: {}, message: null, error: e.message });
  }
});

router.post('/take', async (req, res) => {
  const { date, ...fields } = req.body;
  try {
    const students = await db.getStudents();
    const records = students.map(s => ({
      student_id: s.id,
      date,
      status: fields[`status_${s.id}`] || 'absent'
    }));
    await db.upsertAttendance(records);
    res.redirect(`/attendance/take?date=${date}&saved=1`);
  } catch (e) {
    const students = await db.getStudents().catch(() => []);
    res.render('take-attendance', { students, date, existingMap: {}, message: null, error: e.message });
  }
});

// History page - select student
router.get('/history', async (req, res) => {
  try {
    const students = await db.getStudents();
    const selectedId = req.query.student_id || null;
    let history = [];
    let selectedStudent = null;

    if (selectedId) {
      history = await db.getStudentHistory(selectedId);
      selectedStudent = students.find(s => s.id == selectedId);
    }

    res.render('history', { students, history, selectedId, selectedStudent, error: null });
  } catch (e) {
    res.render('history', { students: [], history: [], selectedId: null, selectedStudent: null, error: e.message });
  }
});

module.exports = router;

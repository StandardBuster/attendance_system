const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const SUPABASE_URL = 'https://xixocgozopjylhxjhkfi.supabase.co/rest/v1';
// Replace with your actual anon key from Supabase dashboard → Settings → API
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

function headers(extra = {}) {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    ...extra
  };
}

async function query(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: headers(options.headers || {})
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase error ${res.status}: ${err}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

// Students
async function getStudents() {
  return query('/students?select=*&order=name.asc');
}

async function addStudent(name, studentId, className) {
  return query('/students', {
    method: 'POST',
    body: JSON.stringify({ name, student_id: studentId, class: className })
  });
}

async function deleteStudent(id) {
  return query(`/students?id=eq.${id}`, { method: 'DELETE' });
}

// Attendance
async function getAttendanceForDate(date) {
  return query(`/attendance?select=*,students(name,student_id,class)&date=eq.${date}`);
}

async function getStudentHistory(studentId) {
  return query(`/attendance?select=*&student_id=eq.${studentId}&order=date.desc`);
}

async function upsertAttendance(records) {
  return query('/attendance', {
    method: 'POST',
    headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(records)
  });
}

async function getAttendanceSummary() {
  return query('/attendance?select=student_id,status');
}

module.exports = {
  getStudents,
  addStudent,
  deleteStudent,
  getAttendanceForDate,
  getStudentHistory,
  upsertAttendance,
  getAttendanceSummary
};

const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const SUPABASE_URL = 'https://xixocgozopjylhxjhkfi.supabase.co/rest/v1';
// Replace with your actual anon key from Supabase dashboard → Settings → API
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpeG9jZ296b3BqeWxoeGpoa2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2OTk5MDcsImV4cCI6MjA4ODI3NTkwN30.AGVmNvMzP6yqx7Hg3uSfJHsA1tMXasL6dz_PQ-LbX0w';

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
  const fetch2 = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
  const promises = records.map(record =>
    fetch2(`${SUPABASE_URL}/attendance?student_id=eq.${record.student_id}&date=eq.${record.date}`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ status: record.status })
    }).then(async res => {
      const text = await res.text();
      // If no row existed yet, insert it
      if (text === '[]' || text === '') {
        return fetch2(`${SUPABASE_URL}/attendance`, {
          method: 'POST',
          headers: headers(),
          body: JSON.stringify(record)
        });
      }
    })
  );l
  return Promise.all(promises);
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

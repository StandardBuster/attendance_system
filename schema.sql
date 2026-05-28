-- Run this in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → paste and run

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  student_id  TEXT,
  class       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id          BIGSERIAL PRIMARY KEY,
  student_id  BIGINT REFERENCES students(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  status      TEXT CHECK (status IN ('present', 'absent')) NOT NULL DEFAULT 'present',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (student_id, date)
);

-- Index for fast history lookups
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date    ON attendance(date);

-- Enable Row Level Security (optional but recommended)
-- ALTER TABLE students  ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- For a simple setup, allow all access with the anon key:
-- CREATE POLICY "allow_all" ON students  FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "allow_all" ON attendance FOR ALL USING (true) WITH CHECK (true);

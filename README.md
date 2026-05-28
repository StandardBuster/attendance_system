# AttendTrack — Attendance System

A clean Node.js + Supabase attendance management system.

## Setup

### 1. Create database tables
Open your Supabase dashboard → **SQL Editor** → paste and run the contents of `schema.sql`.

### 2. Get your API key
In Supabase dashboard → **Settings** → **API** → copy the **anon/public** key.

### 3. Configure the app
Edit `supabase.js` and replace `'YOUR_SUPABASE_ANON_KEY'` with your key.

Or set it as an environment variable:
```bash
export SUPABASE_ANON_KEY=eyJ...your_key...
```

To change the login password (default: `admin123`):
```bash
export ADMIN_PASSWORD=yourpassword
```

### 4. Install & run
```bash
npm install
node index.js
```

Open http://localhost:3000

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Login | `/` | Password-protected entry |
| Students | `/students` | Add/remove students, see stats |
| Take Attendance | `/attendance/take` | Mark present/absent by date |
| History | `/attendance/history` | Per-student attendance record |

## Tech Stack
- **Backend**: Node.js + Express
- **Views**: EJS templates  
- **Database**: Supabase (PostgreSQL)
- **Auth**: Session-based with hardcoded password

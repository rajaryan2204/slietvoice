# CampusVoice

CampusVoice is a student voice, campus news, opinion, and grievance management platform designed for colleges. It features role-based access control, anonymous reporting, verified news boards, interactive polls, and a systematic escalation tracking flow.

## Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Database**: SQLite (via Prisma ORM) for zero-setup local runs
- **Styling**: Tailwind CSS
- **Authentication**: Secure custom session JWT using HTTP-only cookies
- **Charts**: Recharts
- **Icons**: Lucide React

---

## Features

1. **Student Portal**
   - File grievances (optionally anonymous) with priority options and evidence attachments.
   - Live timeline status tracker (`Submitted` → `Under Review` → `Assigned` → `Action Taken` → `Resolved`).
   - Create suggestion posts and support other students' opinions.
   - Vote in official campus polls and view live outcomes.
   
2. **Moderator Portal**
   - Review and verify complaints submitted by students.
   - Assign grievances to the appropriate department.
   - Publish official campus polls.

3. **Faculty Department Admin**
   - Manage complaints assigned to their specific department.
   - Log updates, add responses, and request clarifications.
   - Trigger manual escalations to the HOD/Director.

4. **Director Admin**
   - Full overview analytics dashboard containing category and department charts.
   - Intervene on escalated grievances to take final actions.
   - Publish verified campus news and announcements.

---

## Setup & Local Installation

### 1. Clone the project and install dependencies:
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory (based on `.env.example`):
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="super-secret-campus-voice-key-2026"
PORT=3000
NODE_ENV="development"
```

### 3. Initialize & Seed Database
Synchronize the Prisma schema and run the seed script:
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Running the App
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal.

---

## Demo Accounts Credentials

You can test all user roles using these pre-configured accounts:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Student** | `student@college.edu` | `password123` | Can submit complaints, upvote suggestions, vote on polls. |
| **Moderator** | `moderator@college.edu` | `password123` | Can triage complaints, assign departments, manage polls. |
| **Faculty Admin** | `faculty@college.edu` | `password123` | Manage CS department complaints, post updates. |
| **Director Admin** | `director@college.edu` | `password123` | Full overview charts, resolve escalated issues, post news. |

---

## Production Build & Verification

Verify types and build a production-optimized package:
```bash
npx tsc --noEmit
npm run build
```

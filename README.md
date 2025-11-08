# School Management System (SMS)

A comprehensive full-stack School Management System built with React, TypeScript, Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based auth with refresh tokens, role-based access control
- **Student Management**: Complete student profiles, guardians, enrollment tracking
- **Academic Management**: Classes, subjects, timetables, lesson plans
- **Examination & Grading**: Exam creation, question banks, auto-grading, transcripts
- **Attendance Management**: Manual and QR-based attendance tracking
- **Finance Management**: Fee structures, invoices, payments, refunds
- **Staff Management**: Teacher profiles, roles, leave management
- **Communication**: In-app messaging, email/SMS templates, notifications
- **File Management**: Secure file uploads with virus scanning considerations
- **Reports & Analytics**: Comprehensive reporting and KPI dashboards

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Zustand (state management)
- React Query (server state)
- React Router (routing)
- Tailwind CSS (styling)

### Backend
- Node.js + TypeScript
- Express.js
- MongoDB (database)
- Passport.js + JWT (authentication)
- Zod (validation)
- Multer (file uploads)

## Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- npm or pnpm

## Installation

```bash
# Install all dependencies
npm run install:all

# Or install individually
cd backend && npm install
cd ../frontend && npm install
```

## Development

```bash
# Run both frontend and backend
npm run dev

# Or run separately
npm run dev:backend  # Backend on http://localhost:4000
npm run dev:frontend # Frontend on http://localhost:5173
```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://localhost:27017/sms
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=30d

STORAGE_DRIVER=local
UPLOAD_MAX_MB=50
UPLOAD_DIR=uploads

CORS_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000/api/v1
```

## Build

```bash
# Build both projects
npm run build

# Or build separately
npm run build:backend
npm run build:frontend
```

## Project Structure

```
CMS/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── auth/            # Authentication logic
│   │   ├── middlewares/     # Express middlewares
│   │   ├── modules/         # Feature modules
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript types
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/             # App routes
│   │   ├── components/      # Reusable components
│   │   ├── features/        # Feature modules
│   │   ├── stores/          # Zustand stores
│   │   ├── api/             # API client & React Query
│   │   └── utils/           # Utility functions
│   └── package.json
└── README.md
```

## License

MIT



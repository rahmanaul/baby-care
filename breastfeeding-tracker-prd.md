# Breastfeeding and Baby Care Tracker
## Product Requirements Document (PRD)

### Project Overview
A web application to help nursing mothers track their breast pumping sessions, direct breastfeeding (DBF), and diaper changes for their babies.

### User Persona
- Primary User: Nursing mothers who need to track both pumping and direct breastfeeding
- Secondary Users: Other caregivers who may need to log diaper changes

### Core Features

#### 1. Pumping Session Tracking
- **Requirements:**
  - Minimum 6 regular pump sessions per day
  - 1 power pump session per day
  - Track date, start time, and duration for each session
  - Record volume of milk collected (in ml/oz)
  - Differentiate between regular and power pump sessions
  - Visual indicator for daily goals completion

#### 2. Direct Breastfeeding (DBF) Tracking
- **Requirements:**
  - Track start and end time of each feeding
  - Recommended duration: 15 minutes minimum
  - Allow extended duration as needed
  - Record which breast was used (left/right/both)
  - Notes field for additional observations

#### 3. Diaper Change Tracking
- **Requirements:**
  - Record time of each diaper change
  - Maximum 4-hour interval between changes
  - Type of diaper change (wet/soiled/both)
  - Alert system for approaching 4-hour mark
  - Notes field for any concerns

### Technical Architecture

#### Frontend Stack
- React + Vite
- TanStack Router for routing
- TanStack Query for data fetching
- Tailwind CSS for styling
- shadcn/ui for UI components
- Date-fns for date manipulation
- Zod for form validation

#### Backend Stack (Supabase Option)
- Supabase for:
  - Authentication
  - PostgreSQL database
  - Real-time subscriptions
  - REST API
  - Row Level Security (RLS)

#### Database Schema

```sql
-- Users table (handled by Supabase Auth)
auth.users
  id: uuid
  email: string
  created_at: timestamp

-- Pumping sessions
pumping_sessions
  id: uuid PRIMARY KEY
  user_id: uuid FOREIGN KEY (auth.users.id)
  session_type: enum ('regular', 'power')
  start_time: timestamp
  duration_minutes: integer
  volume_ml: float
  notes: text
  created_at: timestamp
  updated_at: timestamp

-- Direct breastfeeding sessions
dbf_sessions
  id: uuid PRIMARY KEY
  user_id: uuid FOREIGN KEY (auth.users.id)
  start_time: timestamp
  end_time: timestamp
  breast_used: enum ('left', 'right', 'both')
  notes: text
  created_at: timestamp
  updated_at: timestamp

-- Diaper changes
diaper_changes
  id: uuid PRIMARY KEY
  user_id: uuid FOREIGN KEY (auth.users.id)
  change_time: timestamp
  type: enum ('wet', 'soiled', 'both')
  notes: text
  created_at: timestamp
  updated_at: timestamp
```

### Application Routes

```typescript
// Main routes structure
routes/
  ├── index.tsx                    // Dashboard
  ├── auth/
  │   ├── login.tsx
  │   └── register.tsx
  ├── pumping/
  │   ├── index.tsx               // Pumping sessions list
  │   ├── new.tsx                 // New session form
  │   └── $id.tsx                 // Session details/edit
  ├── dbf/
  │   ├── index.tsx               // DBF sessions list
  │   ├── new.tsx                 // New session form
  │   └── $id.tsx                 // Session details/edit
  └── diapers/
      ├── index.tsx               // Diaper changes list
      ├── new.tsx                 // New change form
      └── $id.tsx                 // Change details/edit
```

### UI Components Structure

```
components/
├── layout/
│   ├── MainLayout.tsx
│   ├── Sidebar.tsx
│   └── Navigation.tsx
├── pumping/
│   ├── PumpingForm.tsx
│   ├── PumpingList.tsx
│   ├── PumpingStats.tsx
│   └── PumpingTimer.tsx
├── dbf/
│   ├── DBFForm.tsx
│   ├── DBFList.tsx
│   ├── DBFStats.tsx
│   └── DBFTimer.tsx
├── diapers/
│   ├── DiaperForm.tsx
│   ├── DiaperList.tsx
│   └── DiaperAlert.tsx
└── shared/
    ├── Timer.tsx
    ├── DatePicker.tsx
    └── StatsCard.tsx
```

### Dashboard Layout
```
+------------------+
|    Header Nav    |
+------------------+
| Quick  | Today's |
| Stats  | Schedule|
+--------+---------+
| Recent | Timer   |
| Logs   | Controls|
+--------+---------+
|    Add buttons   |
+------------------+
```

### Implementation Steps

1. **Setup & Configuration (Week 1)**
   - Initialize Vite + React project
   - Set up TanStack Router and Query
   - Configure Supabase project
   - Set up authentication
   - Initialize database schema

2. **Core Features Development (Weeks 2-3)**
   - Implement user authentication
   - Develop pumping session tracking
   - Create DBF session tracking
   - Build diaper change tracking
   - Implement timers and alerts

3. **UI/UX Implementation (Week 4)**
   - Develop responsive layouts
   - Implement dashboard
   - Create data visualization components
   - Add form validation
   - Implement real-time updates

4. **Testing & Refinement (Week 5)**
   - Unit testing
   - Integration testing
   - User acceptance testing
   - Performance optimization
   - Bug fixes

### MVP Features Priority

1. **Must Have**
   - User authentication
   - Pumping session logging
   - DBF session tracking
   - Diaper change logging
   - Basic timer functionality
   - Daily summary view

2. **Should Have**
   - Real-time alerts
   - Statistics dashboard
   - Export functionality
   - Multiple baby support

3. **Nice to Have**
   - Sharing with caregivers
   - Dark mode
   - Progressive Web App (PWA)
   - Push notifications

### Performance Requirements
- Page load time < 2 seconds
- Real-time updates < 500ms
- Offline capability
- Mobile-first responsive design

### Security Requirements
- Secure user authentication
- Data encryption at rest
- Row-level security
- Regular security audits
- GDPR compliance

### Future Considerations
1. Mobile app versions (iOS/Android)
2. Integration with smart pumps
3. Baby growth tracking
4. Feeding schedule recommendations
5. Community features

### Analytics Requirements
- Session duration tracking
- Feature usage metrics
- Error tracking
- User engagement metrics
- Performance monitoring

This PRD serves as a living document and should be updated as requirements evolve during development.

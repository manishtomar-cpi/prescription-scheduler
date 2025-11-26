# Prescription Scheduler

A small full-stack application implementing a **two-stage prescription scheduler**.

The goal is to:

- Collect structured answers about a user’s **availability** and **prescription details** (Stage 1)
- Generate a **14-day dose schedule**, respecting:
  - Stabilisation / increasing / reducing rules
  - User unavailable days
  - UK bank holidays (supplied by backend)
- Demonstrate **clean architecture**, **TypeScript on both sides**, and **tests** (unit + integration).

---

## Stages from the specification

### Stage 1 – Input & Validation

- **Backend**
  - Validates incoming JSON against the expected model:
    - Available days of the week
    - Prescription type
    - Either:
      - Stabilisation: fixed daily dose, or
      - Titration (increasing / reducing): initial dose, change amount, change every N days
  - Enforces a safe dose range and valid prescription types from config.
- **Frontend**
  - Renders a guided form:
    - Availability day checkboxes (driven by `/api/config`)
    - Prescription type toggle
    - Conditional fields for stabilisation vs titration
  - Performs basic client-side validation before calling the backend.

At the end of Stage 1, we have a **validated payload** ready for scheduling but no schedule yet.

### Stage 2 – 14-day Schedule

- **Backend**
  - Pure logic to calculate 14 days of doses based on:
    - Stabilisation dose **or**
    - Initial dose + step (+/–) every N days
  - Applies availability rules:
    - Moves doses from unavailable or bank-holiday days to the **previous available day**
    - Sets **0 ml** on days where no dose should be taken
  - Returns a 14-day array with date, day of week, and dose.
- **Frontend**
  - Submits the Stage 1 payload to `/api/schedule`
  - Shows loading / error states
  - Renders a **14-day schedule table**
  - Shows a small toast for success / error.

---

## Tech stack

**Backend (server/)**

- Node.js, Express
- TypeScript
- Jest + Supertest
- In-memory config for:
  - prescription types
  - valid days
  - UK bank holidays
- Structured logging (request id + logger)

**Frontend (client/)**

- React + TypeScript (Vite)
- Tailwind CSS
- React Testing Library + Vitest + jsdom
- Small custom hook (`useSchedule`) and simple UI primitives (Button, Toast, ErrorBanner, Loader)

No database is used – everything is in memory as requested in the test.

---

## Project structure

```text
prescription-scheduler/
├─ README.md              # This file – overall description
├─ client/                # React + TS + Vite + Tailwind
└─ server/                # Express + TS + Jest
```

High-level server structure:

```text
server/
├─ src/
│  ├─ app.ts              # Express app wiring (middleware + routes)
│  ├─ server.ts           # Server bootstrap
│  ├─ config/
│  │  ├─ appConfig.ts     # Dose ranges, prescription types
│  │  └─ bankHolidays.ts  # In-memory bank holidays
│  ├─ domain/
│  │  ├─ models.ts        # Core domain types
│  │  └─ prescriptionLogic.ts
│  ├─ routes/
│  │  ├─ healthRoute.ts   # GET /api/health
│  │  ├─ configRoute.ts   # GET /api/config
│  │  └─ scheduleRoute.ts # POST /api/schedule
│  ├─ services/
│  │  └─ scheduleService.ts
│  ├─ utils/
│  │  ├─ bankHolidayUtils.ts
│  │  └─ logger.ts
│  ├─ validation/
│  │  └─ scheduleValidation.ts
│  └─ middleware/
│     ├─ requestId.ts
│     ├─ requestLogger.ts
│     └─ errorHandler.ts
└─ tests/
   ├─ unit/
   └─ integration/
```

High-level client structure:

```text
client/
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ api/
│  │  ├─ httpClient.ts
│  │  ├─ healthApi.ts
│  │  ├─ configApi.ts
│  │  └─ scheduleApi.ts
│  ├─ components/
│  │  ├─ layout/PageContainer.tsx
│  │  ├─ form/...
│  │  ├─ schedule/ScheduleTable.tsx
│  │  └─ ui/{Button,Loader,ErrorBanner,Toast}.tsx
│  ├─ hooks/useSchedule.ts
│  ├─ types/schedule.ts
│  ├─ utils/{validation,toastHelpers}.ts
│  └─ tests/...
```

## How to run everything

### Prerequisites

- Node.js (LTS)
- npm

### 1. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Run the backend

```bash
cd server
npm run dev
# Server runs on http://localhost:4000
```

### 3. Run the frontend

```bash
cd client
npm run dev
# Vite dev server on http://localhost:5173
```

The frontend is configured (via httpClient) to talk to `http://localhost:4000/api`.

---

## Running tests

### Backend tests (Jest)

```bash
cd server
npm test
```

Unit tests:

- domain/prescriptionLogic – core dose calculations
- services/scheduleService – 14-day schedule generation
- utils/bankHolidayUtils – detecting and handling bank holidays

Integration tests:

- scheduleRoute – validates payload, returns schedule, covers error paths

### Frontend tests (Vitest)

```bash
cd client
npm test
```

Component tests (e.g. ScheduleTable)

ScheduleFlow integration test:

- Mocks backend APIs
- Simulates filling the form and submitting
- Asserts that the schedule is rendered and success toast appears

---

## Design choices

- **No database** – All configuration (prescription types, valid days, bank holidays) is kept in memory and exposed via `/api/config`.
- **Pure logic where possible** – Prescription logic functions are pure and covered by unit tests.
- **Structured logging** – request id + log lines.
- **Separation of concerns** – domain logic, HTTP routing, and UI state are isolated.


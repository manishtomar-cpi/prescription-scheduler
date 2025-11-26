# Prescription Scheduler – Client

- React + TypeScript (Vite)
- Tailwind CSS
- Vitest + React Testing Library
- Talks to backend at `http://localhost:4000/api`

---

## Scripts

```bash
npm install
npm run dev
npm test
npm run build
```

Vite dev server runs at: **http://localhost:5173**

---

## Main User Flow

1. App loads:
   - GET /api/health
   - GET /api/config
2. Renders Stage 1 form:
   - availability days
   - prescription type selection
   - stabilisation or titration fields
3. Basic client-side validation.
4. Submit → POST /api/schedule.
5. On success:
   - show 14-day schedule
   - show success toast
6. On error:
   - show error banner + toast

---

## Folder structure

```
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
│  │  ├─ form/
│  │  │  ├─ PrescriptionForm.tsx
│  │  │  ├─ AvailabilitySelector.tsx
│  │  │  ├─ PrescriptionTypeSelector.tsx
│  │  │  ├─ StabilisationFields.tsx
│  │  │  └─ TitrationFields.tsx
│  │  ├─ schedule/ScheduleTable.tsx
│  │  └─ ui/{Button,Loader,ErrorBanner,Toast}.tsx
│  ├─ hooks/useSchedule.ts
│  ├─ types/schedule.ts
│  ├─ utils/{validation,toastHelpers}.ts
│  └─ tests/
│     ├─ ScheduleTable.test.tsx
│     └─ ScheduleFlow.test.tsx
```

---

## Tests

Run:
```bash
npm test
```

- ScheduleTable.test.tsx – verifies table rendering  
- ScheduleFlow.test.tsx – mocks backend, simulates full flow, checks UI updates

---

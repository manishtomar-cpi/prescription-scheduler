# Prescription Scheduler – Server

- Node.js + Express
- TypeScript
- Jest + Supertest
- In-memory configuration and bank holidays
- No database

---

## Scripts

```bash
npm install
npm run dev
npm test
npm run build
```

The dev server runs on: **http://localhost:4000**

---

## API Overview

All routes are under `/api`.

### **GET /api/health**
Healthcheck.

**Response 200**
```json
{
  "status": "ok",
  "message": "Server is healthy"
}
```

### **GET /api/config**
Returns configuration needed for Stage 1.

Example:
```json
{
  "prescriptionTypes": ["stabilisation", "increasing", "reducing"],
  "validDays": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "doseRange": { "min": 0, "max": 60 },
  "bankHolidays": ["2025-01-01", "2025-12-25"]
}
```

Driven by:
- `src/config/appConfig.ts`
- `src/config/bankHolidays.ts`

### **POST /api/schedule**
Main endpoint implementing Stage 1 + Stage 2 logic.

Request body (simplified):
```json
{
  "availableDays": ["Mon", "Wed", "Fri"],
  "prescriptionType": "stabilisation",
  "stabilisationDose": 20
}
```

Returns 14-day schedule with applied availability + bank holiday rules.

**Response 200 example**
```json
{
  "requestId": "abc-123",
  "schedule": [
    { "date": "2025-02-10", "day": "Mon", "dose": 20 },
    { "date": "2025-02-11", "day": "Tue", "dose": 0 }
  ]
}
```

---

## Error handling

- **400** – validation errors
- **500** – unexpected failures

---

## Internal Architecture

```
src/
├─ domain/
│  ├─ models.ts
│  └─ prescriptionLogic.ts
├─ services/scheduleService.ts
├─ utils/bankHolidayUtils.ts
├─ validation/scheduleValidation.ts
├─ middleware/
│  ├─ requestId.ts
│  ├─ requestLogger.ts
│  └─ errorHandler.ts
```

Tests located in:
- `tests/unit`
- `tests/integration`


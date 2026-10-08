# VOZX RideCompare - Production-Grade Backend Engine

The backend for **VOZX RideCompare** is built with Node.js, TypeScript, Express.js, Prisma ORM, and PostgreSQL. It delivers real-time ride price comparisons across multiple providers (Uber, Ola, and Rapido) through a normalized provider adapter pattern, automated route calculation, intelligent ride recommendations, and JWT-authenticated user services.

---

## 🚀 Key Features

1. **Provider Adapter Architecture**:
   - Independent provider adapters (`RapidoMockProvider`, `OlaMockProvider`, `UberMockProvider`) implementing `RideProvider`.
   - Standardized quote normalization (price, currency, ETA, rating, status).
   - Fault-tolerant quote aggregation with `Promise.allSettled`. If a provider fails or times out, the search engine still delivers quotes from operational providers while gracefully marking the failed service as `UNAVAILABLE`.
2. **Comparison & Recommendation Engine**:
   - Haversine distance and urban travel duration calculation.
   - Deterministic pricing formulas based on base fare, distance, and traffic time factors.
   - Multi-metric recommendation analysis (composite score weighing price, ETA, and driver rating).
   - Automatic tagging of **Cheapest** and **Fastest** rides.
3. **Database & Dual-Mode Persistence**:
   - Complete Prisma ORM schema with PostgreSQL backing models for Users, Saved Locations, Recent Searches, Ride Searches, Quotes, Ride History, and Notifications.
   - **Resilient Fallback Mode**: If PostgreSQL is temporarily not reachable, the backend automatically runs in in-memory mode without crashing or failing API requests.
4. **Security & Performance**:
   - JWT authentication (`Bearer <token>`) with bcrypt password hashing (10 salt rounds).
   - Helmet HTTP headers and custom CORS policies.
   - Express rate limiting for API protection (`generalLimiter`, `authLimiter`, `compareLimiter`).
   - Zod request validation for bodies, queries, and route parameters.
   - Centralized error handling returning structured error payloads `{ success: false, error: { code, message } }`.

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── env.ts                 # Environment variable validation & defaults
│   │   └── database.ts            # Prisma client & connection resilience handler
│   ├── controllers/
│   │   ├── auth.controller.ts     # User register & login
│   │   ├── user.controller.ts     # Profile retrieval & updates
│   │   ├── ride.controller.ts     # Compare rides, history, & mock bookings
│   │   ├── location.controller.ts # Location search & saved locations CRUD
│   │   ├── quote.controller.ts    # Individual quote retrieval
│   │   └── notification.controller.ts # User notifications & read status
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── ride.routes.ts
│   │   ├── location.routes.ts
│   │   ├── quote.routes.ts
│   │   └── notification.routes.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── ride.service.ts
│   │   ├── location.service.ts
│   │   ├── comparison.service.ts
│   │   ├── recommendation.service.ts
│   │   └── notification.service.ts
│   ├── providers/
│   │   ├── provider.interface.ts  # Common RideProvider interface
│   │   ├── uber/
│   │   │   └── uber.mock.ts       # Uber Bike & Car mock adapter
│   │   ├── ola/
│   │   │   └── ola.mock.ts        # Ola Bike & Auto mock adapter
│   │   └── rapido/
│   │       └── rapido.mock.ts     # Rapido Bike & Auto mock adapter
│   ├── middleware/
│   │   ├── auth.middleware.ts     # requireAuth and optionalAuth
│   │   ├── error.middleware.ts    # Centralized errorHandler & notFoundHandler
│   │   ├── validation.middleware.ts # Zod schema validation
│   │   └── rate-limit.middleware.ts # Express rate limiters
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   ├── ride.schema.ts
│   │   ├── location.schema.ts
│   │   └── user.schema.ts
│   ├── utils/
│   │   ├── jwt.ts                 # Token sign & verify
│   │   ├── errors.ts              # AppError hierarchy
│   │   ├── response.ts            # sendSuccess & sendError helpers
│   │   └── distance.ts            # Haversine distance & ETA estimation
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── ride.types.ts
│   │   └── provider.types.ts
│   ├── app.ts                     # Express application configuration
│   └── server.ts                  # Server bootstrap & graceful shutdown
├── prisma/
│   ├── schema.prisma              # Complete PostgreSQL schema
│   └── seed.ts                    # Demo database seeder
├── tests/
│   ├── auth.test.ts               # Auth & profile integration tests
│   ├── rides.test.ts              # Comparison & history tests
│   ├── locations.test.ts          # Search & saved locations CRUD tests
│   └── providers.test.ts          # Provider architecture & fault-tolerance tests
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js v18+ (Node.js v20 LTS recommended)
- npm v9+
- PostgreSQL (Optional: Server automatically falls back to in-memory store if PostgreSQL is offline)

### 2. Environment Variables
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ridecompare?schema=public"
JWT_SECRET="super-secret-jwt-key-for-development-change-in-production"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="*"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup (When PostgreSQL is running)
```bash
npx prisma db push
npm run prisma:seed
```

### 5. Running the Server
- **Development Mode** (with hot reload):
  ```bash
  npm run dev
  ```
- **Production Build & Run**:
  ```bash
  npm run build
  npm start
  ```
The server will start at `http://localhost:5000`.
Health endpoint: `GET http://localhost:5000/api/health`.

### 6. Running Tests
Run the comprehensive integration test suite with Jest:
```bash
npm test
```
All 4 test suites verify:
- Registration, duplicate checks, login, and profile updating.
- Ride comparison, coordinate range validation, and pagination.
- Provider fault-tolerance (simulating provider failure without breaking quotes).
- Location search and saved places CRUD.

---

## 📡 API Reference

All responses strictly follow the envelope pattern:
- **Success**: `{ "success": true, "data": ... }`
- **Error**: `{ "success": false, "error": { "code": "...", "message": "..." } }`

### 1. Health
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health & database status | None |

### 2. Ride Comparison & Quotes
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/rides/compare` | Compare live fares across providers | Optional |
| `GET` | `/api/quotes/:quoteId` | Retrieve individual quote details | None |
| `GET` | `/api/rides/history` | Paginated ride history (`?page=1&limit=10`) | Required |
| `POST` | `/api/rides/book` | Record a confirmed ride booking | Optional |

#### Example: Compare Rides
**Request**: `POST /api/rides/compare`
```json
{
  "pickup": {
    "address": "Station Road, Kolhapur",
    "latitude": 16.7028,
    "longitude": 74.2405
  },
  "destination": {
    "address": "Sanjay Ghodawat University, Kolhapur",
    "latitude": 16.7450,
    "longitude": 74.3720
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "searchId": "9fa0d3fa-2384-482a-a92c-f6825c3451e9",
    "route": {
      "distanceKm": 18.7,
      "estimatedMinutes": 49
    },
    "rides": [
      {
        "quoteId": "bc34dc55-07be-4618-b587-4b3ea6d31062",
        "provider": "RAPIDO",
        "vehicleType": "BIKE",
        "price": 228,
        "currency": "INR",
        "etaMinutes": 47,
        "rating": 4.2,
        "status": "AVAILABLE",
        "isCheapest": true,
        "isFastest": true
      },
      {
        "quoteId": "523b3889-02b7-42ae-a6ce-2cd4f35c9a63",
        "provider": "OLA",
        "vehicleType": "BIKE",
        "price": 260,
        "currency": "INR",
        "etaMinutes": 54,
        "rating": 4.1,
        "status": "AVAILABLE",
        "isCheapest": false,
        "isFastest": false
      },
      {
        "quoteId": "40a9cf0c-a101-4462-ad4d-6dddda994f6b",
        "provider": "UBER",
        "vehicleType": "BIKE",
        "price": 294,
        "currency": "INR",
        "etaMinutes": 59,
        "rating": 4.4,
        "status": "AVAILABLE",
        "isCheapest": false,
        "isFastest": false
      }
    ],
    "recommendation": {
      "cheapestQuoteId": "bc34dc55-07be-4618-b587-4b3ea6d31062",
      "fastestQuoteId": "bc34dc55-07be-4618-b587-4b3ea6d31062",
      "bestValueQuoteId": "bc34dc55-07be-4618-b587-4b3ea6d31062",
      "provider": "RAPIDO",
      "vehicleType": "BIKE",
      "reason": "Optimal balance of competitive pricing, quick arrival time, and driver rating."
    }
  }
}
```

### 3. Authentication & Profile
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | None |
| `POST` | `/api/auth/login` | Log in with email & password | None |
| `GET` | `/api/user/profile` | Get authenticated user profile | Required |
| `PATCH` | `/api/user/profile` | Update profile (name, phone) | Required |

### 4. Locations & Saved Places
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/locations/search?q=kolhapur` | Autocomplete landmark search | None |
| `GET` | `/api/locations/saved` | List user's saved locations | Required |
| `POST` | `/api/locations/saved` | Save a new location | Required |
| `DELETE` | `/api/locations/saved/:id` | Delete saved location | Required |

### 5. Notifications
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | List user notifications | Required |
| `PATCH` | `/api/notifications/:id/read` | Mark notification as read | Required |

---

## 🔌 Replacing Mock Providers with Official APIs

The provider architecture is decoupled from controllers via `RideProvider`:

```typescript
export interface RideProvider {
  getProviderName(): ProviderName;
  getSupportedVehicleTypes(): VehicleType[];
  getQuotes(request: ProviderQuoteRequest): Promise<NormalizedQuote[]>;
}
```

To integrate official Uber, Ola, or Rapido APIs:
1. Create a new provider adapter implementing `RideProvider` (e.g. `src/providers/uber/uber.official.ts`).
2. Make HTTP requests to the official provider endpoint using authorized OAuth2 tokens.
3. Map their proprietary response to `NormalizedQuote[]`.
4. Register the new provider class in `src/services/comparison.service.ts`.
5. **No changes to routes, controllers, or frontend are required!**

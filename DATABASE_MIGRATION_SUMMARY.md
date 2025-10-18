# Database Migration & Payment System Update Summary# Database Migration & Currency Update Summary



## Changes Completed ✅## Changes Completed ✅



### 1. Payment System Migration: Kapitalbank → Epoint### 1. Currency Change: AZN → USD



The payment integration has been completely migrated from Kapitalbank to Epoint payment gateway.All pricing has been converted from Azerbaijani Manat (AZN) to US Dollars (USD):



**Payment Gateway Changes:****Pricing Plans:**

- Essential Plan: ~~9.90 AZN~~ → **$9.90 USD**

**Old System (Kapitalbank):**- Complete Plan: ~~14.90 AZN~~ → **$14.90 USD**

- API URL: https://txpgtst.kapitalbank.az/api- Ultimate Plan: ~~29.90 AZN~~ → **$29.90 USD**

- Authentication: Basic Auth (username + password)

- Currency: USD (code 840)**Budget Options (Question):**

- Callback Routes: /payment/approve, /payment/cancel, /payment/decline- Under $50 (previously 50 AZN)

- Database Fields: kapital_order_id, kapital_session_id- $50-100 (previously 50-100 AZN)

- $100-150 (previously 100-150 AZN)

**New System (Epoint):**- $150-200 (previously 150-200 AZN)

- Payment API: https://epoint.az/api/1/request- $200+ (previously 200+ AZN)

- Status Check API: https://epoint.az/api/1/get-status

- Authentication: Public/Private key pair**Payment Integration:**

- Currency: AZN (Azerbaijani Manat)- Currency code updated from `944` (AZN) to `840` (USD)

- Callback Routes: /payment/success, /payment/error

- Database Field: epoint_transaction_id**Files Updated:**

- `public/static/app.js` - 3 pricing card displays

**Pricing Plans (in AZN):**- `src/index.tsx` - Budget options and payment currency code

- Essential Plan: **9.90 AZN**- `migrations/0001_initial_schema.sql` - Default currency in orders table

- Complete Plan: **14.90 AZN**

- Ultimate Plan: **29.90 AZN**---



**Budget Options (Question):**### 2. Database Connection: In-Memory → D1 Database

- Under 50 AZN

- 50-100 AZNReplaced all in-memory storage with proper **Cloudflare D1 database** connections.

- 100-150 AZN

- 150-200 AZN#### Database Configuration

- 200+ AZN

**File: `wrangler.jsonc`**

**Files Updated:**```json

- `.env` / `.dev.vars` - Replaced all Kapitalbank environment variables with Epoint{

- `src/index.tsx` - Complete payment integration rewrite  "d1_databases": [

- `migrations/0001_initial_schema.sql` - Updated for Epoint fields    {

- `migrations/0002_epoint_migration.sql` - Migration for existing databases      "binding": "DB",

- `public/static/app.js` - Updated UI text      "database_name": "fitgenius-db",

      "database_id": "local-db"

---    }

  ]

### 2. Database Connection: In-Memory → D1 Database}

```

Replaced all in-memory storage with proper **Cloudflare D1 database** connections.

#### Database Schema Applied

#### Database Configuration

**Tables Created:**

**File: `wrangler.jsonc`**1. **users** - Stores user profile and questionnaire data

```json2. **orders** - Tracks payment transactions and plan purchases

{3. **questionnaire_sessions** - Temporary session storage (24-hour expiry)

  "d1_databases": [

    {**Migration Status:** ✅ Applied successfully

      "binding": "DB",- 7 SQL commands executed

      "database_name": "fitgenius-db",- Local database initialized at `.wrangler/state/v3/d1`

      "database_id": "local-db"

    }---

  ]

}### 3. API Endpoints Migrated to D1

```

All API endpoints now use D1 database instead of in-memory storage:

#### Database Schema Applied

#### `/api/questionnaire/start` (POST)

**Tables Created:**- Creates new session in `questionnaire_sessions` table

1. **users** - Stores user profile and questionnaire data- Returns unique session ID and first question

2. **orders** - Tracks payment transactions and plan purchases

3. **questionnaire_sessions** - Temporary session storage (24-hour expiry)#### `/api/questionnaire/answer` (POST)

- Stores responses in database

**Migration Status:** ✅ Applied successfully- Updates current step and user path

- 7 SQL commands executed- Returns next question or completion status

- Local database initialized at `.wrangler/state/v3/d1`

#### `/api/generate-plan` (POST)

---- Retrieves session data from D1

- Creates/updates user record in `users` table

### 3. API Endpoints Migrated to D1- Generates AI plan

- Creates order record in `orders` table with USD pricing

All API endpoints now use D1 database instead of in-memory storage:- Returns order ID and preview



#### `/api/questionnaire/start` (POST)#### `/api/payment/create` (POST)

- Creates new session in `questionnaire_sessions` table- Fetches order and user data from database

- Returns unique session ID and first question- Creates Kapital Bank payment session

- Updates order with payment tracking info

#### `/api/questionnaire/answer` (POST)

- Stores responses in database#### `/api/payment/:orderId` (GET)

- Updates current step and user path- Retrieves order details with user info via JOIN query

- Returns next question or completion status

#### `/api/generate-pdf/:orderId` (POST)

#### `/api/generate-plan` (POST)- Fetches paid order data

- Retrieves session data from D1- Generates PDF content

- Creates/updates user record in `users` table- Updates order with PDF URL

- Generates AI plan

- Creates order record in `orders` table with AZN pricing#### `/payment/approve` (GET)

- Returns order ID and preview- Verifies Kapital Bank payment

- Updates order status to 'paid' in database

#### `/api/payment/create` (POST)- Records payment timestamp

- Fetches order and user data from database

- Creates Epoint payment session---

- Updates order with payment tracking info

### 4. Data Persistence Features

#### `/api/payment/:orderId` (GET)

- Retrieves order details with user info via JOIN query**User Data Stored:**

- Email (unique identifier)

#### `/api/generate-pdf/:orderId` (POST)- Name, age, gender

- Fetches paid order data- Physical measurements (height, current_weight, target_weight)

- Generates PDF content- Activity level

- Updates order with PDF URL- Dietary preferences

- Complete questionnaire responses (JSON)

#### `/payment/success` (GET)- User path (beginner/intermediate/advanced)

- Verifies Epoint payment

- Updates order status to 'paid' in database**Order Data Stored:**

- Records payment timestamp- User ID reference

- Plan type (basic/premium/complete)

#### `/payment/error` (GET)- Amount in USD

- Handles failed payment attempts- Payment status (pending/paid/failed/refunded)

- Redirects user with error message- Kapital Bank order ID and session ID

- AI-generated plan content (JSON)

---- PDF URL (when generated)

- Timestamps (created_at, paid_at)

### 4. Data Persistence Features

**Session Management:**

**User Data Stored:**- 24-hour auto-expiry for questionnaire sessions

- Email (unique identifier)- Indexed for efficient querying

- Name, age, gender- JSON storage for flexible response data

- Physical measurements (height, current_weight, target_weight)

- Activity level---

- Dietary preferences

- Complete questionnaire responses (JSON)### 5. Benefits of D1 Integration

- User path (beginner/intermediate/advanced)

✅ **Persistent Storage** - Data survives across deployments and restarts

**Order Data Stored:**✅ **Scalable** - Handles multiple concurrent users efficiently

- User ID reference✅ **Indexed Queries** - Fast lookup by email, user_id, status

- Plan type (basic/premium/complete)✅ **Relational Data** - Proper foreign keys between users and orders

- Amount in AZN✅ **Session Cleanup** - Auto-expiry prevents database bloat

- Payment status (pending/paid/failed/refunded)✅ **Transaction Safety** - ACID compliance for payment operations

- Epoint transaction ID✅ **Audit Trail** - Complete order history with timestamps

- AI-generated plan content (JSON)

- PDF URL (when generated)---

- Timestamps (created_at, paid_at)

## Testing Instructions

**Session Management:**

- 24-hour auto-expiry for questionnaire sessions### Local Development

- Indexed for efficient querying```bash

- JSON storage for flexible response data# Start dev server with D1 database

npm run dev

---

# Database is automatically created at:

### 5. Benefits of D1 Integration# .wrangler/state/v3/d1/miniflare-D1DatabaseObject/

```

✅ **Persistent Storage** - Data survives across deployments and restarts

✅ **Scalable** - Handles multiple concurrent users efficiently### Verify Database Connection

✅ **Indexed Queries** - Fast lookup by email, user_id, status```bash

✅ **Relational Data** - Proper foreign keys between users and orders# Check database tables

✅ **Session Cleanup** - Auto-expiry prevents database bloatnpx wrangler d1 execute DB --local --command "SELECT name FROM sqlite_master WHERE type='table';"

✅ **Transaction Safety** - ACID compliance for payment operations

✅ **Audit Trail** - Complete order history with timestamps# View users

npx wrangler d1 execute DB --local --command "SELECT * FROM users LIMIT 10;"

---

# View orders

## Testing Instructionsnpx wrangler d1 execute DB --local --command "SELECT * FROM orders LIMIT 10;"



### Local Development# View sessions

```bashnpx wrangler d1 execute DB --local --command "SELECT * FROM questionnaire_sessions LIMIT 10;"

# Start dev server with D1 database```

npm run dev

---

# Database is automatically created at:

# .wrangler/state/v3/d1/miniflare-D1DatabaseObject/## Production Deployment

```

### Create Production Database

### Verify Database Connection```bash

```bash# Create D1 database in Cloudflare

# Check database tablesnpx wrangler d1 create fitgenius-db

npx wrangler d1 execute DB --local --command "SELECT name FROM sqlite_master WHERE type='table';"

# Copy the database_id from output and update wrangler.jsonc

# View users# Replace "local-db" with actual production database ID

npx wrangler d1 execute DB --local --command "SELECT * FROM users LIMIT 10;"

# Apply migration to production

# View ordersnpx wrangler d1 execute DB --remote --file=migrations/0001_initial_schema.sql

npx wrangler d1 execute DB --local --command "SELECT * FROM orders LIMIT 10;"```



# View sessions### Deploy to Cloudflare Pages

npx wrangler d1 execute DB --local --command "SELECT * FROM questionnaire_sessions LIMIT 10;"```bash

```npm run build

npx wrangler pages deploy dist

---```



## Production Deployment---



### Apply Database Migration## Environment Variables Required



If you have an existing database, apply the migration to add Epoint fields:Make sure these are set in Cloudflare Pages settings:



```bash```bash

# Apply migration to local databaseOPENROUTER_API_KEY=<your-api-key>

npx wrangler d1 execute DB --local --file=migrations/0002_epoint_migration.sqlKAPITAL_MERCHANT_ID=<your-merchant-id>

KAPITAL_APPROVE_URL=https://your-domain.com/payment/approve

# Apply migration to production databaseKAPITAL_CANCEL_URL=https://your-domain.com/payment/cancel

npx wrangler d1 execute DB --remote --file=migrations/0002_epoint_migration.sqlKAPITAL_DECLINE_URL=https://your-domain.com/payment/decline

``````



### Create New Production Database---



If starting fresh:## Migration Rollback (If Needed)



```bashIf you need to revert changes:

# Create D1 database in Cloudflare

npx wrangler d1 create fitgenius-db```bash

# Drop all tables

# Copy the database_id from output and update wrangler.jsoncnpx wrangler d1 execute DB --local --command "

# Replace "local-db" with actual production database IDDROP TABLE IF EXISTS questionnaire_sessions;

DROP TABLE IF EXISTS orders;

# Apply initial schema to productionDROP TABLE IF EXISTS users;

npx wrangler d1 execute DB --remote --file=migrations/0001_initial_schema.sql"

```

# Re-apply migration

### Deploy to Cloudflare Pagesnpx wrangler d1 execute DB --local --file=migrations/0001_initial_schema.sql

```bash```

npm run build

npx wrangler pages deploy dist---

```

## Summary

---

✅ **Currency updated** from AZN to USD across all pricing

## Environment Variables Required✅ **Database migrated** from in-memory to Cloudflare D1

✅ **All API endpoints** now use persistent database storage

Make sure these are set in **Cloudflare Pages Settings → Environment Variables**:✅ **User data** is properly saved and retrievable

✅ **Orders** are tracked with payment status

```bash✅ **Sessions** auto-expire after 24 hours

# Epoint Payment Gateway✅ **Local testing** ready with initialized database

EPOINT_API_URL=https://epoint.az/api/1/request✅ **Production ready** with proper database schema

EPOINT_CHECK_URL=https://epoint.az/api/1/get-status

EPOINT_PUBLIC_KEY=<your-epoint-public-key>The application now has a robust, scalable database backend that properly stores user information, questionnaire responses, and order data!

EPOINT_PRIVATE_KEY=<your-epoint-private-key>
EPOINT_SUCCESS_URL=https://your-domain.com/payment/success
EPOINT_ERROR_URL=https://your-domain.com/payment/error

# AI API Keys
OPENROUTER_API_KEY=<your-openrouter-key>
GEMINI_API_KEY=<your-gemini-key>
```

---

## Migration Rollback (If Needed)

If you need to revert the Epoint migration:

```bash
# Remove Epoint column and restore Kapitalbank columns
npx wrangler d1 execute DB --local --command "
ALTER TABLE orders DROP COLUMN epoint_transaction_id;
ALTER TABLE orders ADD COLUMN kapital_order_id TEXT;
ALTER TABLE orders ADD COLUMN kapital_session_id TEXT;
CREATE INDEX idx_orders_kapital ON orders(kapital_order_id, kapital_session_id);
"
```

---

## Summary

✅ **Payment system migrated** from Kapitalbank to Epoint
✅ **Currency updated** to AZN (Azerbaijani Manat)
✅ **Database migrated** from in-memory to Cloudflare D1
✅ **All API endpoints** now use persistent database storage
✅ **User data** is properly saved and retrievable
✅ **Orders** are tracked with payment status
✅ **Sessions** auto-expire after 24 hours
✅ **Local testing** ready with initialized database
✅ **Production ready** with proper database schema
✅ **Migration file** created for existing databases (0002_epoint_migration.sql)

The application now has:
- A robust, scalable database backend
- Modern Epoint payment integration
- Proper data persistence across deployments
- Simplified payment callback flow
- Complete audit trail for transactions

**Next Steps:**
1. Obtain Epoint API credentials (public key and private key)
2. Update environment variables with actual credentials
3. Run database migration if upgrading existing installation
4. Test payment flow with real transactions
5. Deploy to production

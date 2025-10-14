# Database Migration & Currency Update Summary

## Changes Completed ✅

### 1. Currency Change: AZN → USD

All pricing has been converted from Azerbaijani Manat (AZN) to US Dollars (USD):

**Pricing Plans:**
- Essential Plan: ~~9.90 AZN~~ → **$9.90 USD**
- Complete Plan: ~~14.90 AZN~~ → **$14.90 USD**
- Ultimate Plan: ~~29.90 AZN~~ → **$29.90 USD**

**Budget Options (Question):**
- Under $50 (previously 50 AZN)
- $50-100 (previously 50-100 AZN)
- $100-150 (previously 100-150 AZN)
- $150-200 (previously 150-200 AZN)
- $200+ (previously 200+ AZN)

**Payment Integration:**
- Currency code updated from `944` (AZN) to `840` (USD)

**Files Updated:**
- `public/static/app.js` - 3 pricing card displays
- `src/index.tsx` - Budget options and payment currency code
- `migrations/0001_initial_schema.sql` - Default currency in orders table

---

### 2. Database Connection: In-Memory → D1 Database

Replaced all in-memory storage with proper **Cloudflare D1 database** connections.

#### Database Configuration

**File: `wrangler.jsonc`**
```json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "fitgenius-db",
      "database_id": "local-db"
    }
  ]
}
```

#### Database Schema Applied

**Tables Created:**
1. **users** - Stores user profile and questionnaire data
2. **orders** - Tracks payment transactions and plan purchases
3. **questionnaire_sessions** - Temporary session storage (24-hour expiry)

**Migration Status:** ✅ Applied successfully
- 7 SQL commands executed
- Local database initialized at `.wrangler/state/v3/d1`

---

### 3. API Endpoints Migrated to D1

All API endpoints now use D1 database instead of in-memory storage:

#### `/api/questionnaire/start` (POST)
- Creates new session in `questionnaire_sessions` table
- Returns unique session ID and first question

#### `/api/questionnaire/answer` (POST)
- Stores responses in database
- Updates current step and user path
- Returns next question or completion status

#### `/api/generate-plan` (POST)
- Retrieves session data from D1
- Creates/updates user record in `users` table
- Generates AI plan
- Creates order record in `orders` table with USD pricing
- Returns order ID and preview

#### `/api/payment/create` (POST)
- Fetches order and user data from database
- Creates Kapital Bank payment session
- Updates order with payment tracking info

#### `/api/payment/:orderId` (GET)
- Retrieves order details with user info via JOIN query

#### `/api/generate-pdf/:orderId` (POST)
- Fetches paid order data
- Generates PDF content
- Updates order with PDF URL

#### `/payment/approve` (GET)
- Verifies Kapital Bank payment
- Updates order status to 'paid' in database
- Records payment timestamp

---

### 4. Data Persistence Features

**User Data Stored:**
- Email (unique identifier)
- Name, age, gender
- Physical measurements (height, current_weight, target_weight)
- Activity level
- Dietary preferences
- Complete questionnaire responses (JSON)
- User path (beginner/intermediate/advanced)

**Order Data Stored:**
- User ID reference
- Plan type (basic/premium/complete)
- Amount in USD
- Payment status (pending/paid/failed/refunded)
- Kapital Bank order ID and session ID
- AI-generated plan content (JSON)
- PDF URL (when generated)
- Timestamps (created_at, paid_at)

**Session Management:**
- 24-hour auto-expiry for questionnaire sessions
- Indexed for efficient querying
- JSON storage for flexible response data

---

### 5. Benefits of D1 Integration

✅ **Persistent Storage** - Data survives across deployments and restarts
✅ **Scalable** - Handles multiple concurrent users efficiently
✅ **Indexed Queries** - Fast lookup by email, user_id, status
✅ **Relational Data** - Proper foreign keys between users and orders
✅ **Session Cleanup** - Auto-expiry prevents database bloat
✅ **Transaction Safety** - ACID compliance for payment operations
✅ **Audit Trail** - Complete order history with timestamps

---

## Testing Instructions

### Local Development
```bash
# Start dev server with D1 database
npm run dev

# Database is automatically created at:
# .wrangler/state/v3/d1/miniflare-D1DatabaseObject/
```

### Verify Database Connection
```bash
# Check database tables
npx wrangler d1 execute DB --local --command "SELECT name FROM sqlite_master WHERE type='table';"

# View users
npx wrangler d1 execute DB --local --command "SELECT * FROM users LIMIT 10;"

# View orders
npx wrangler d1 execute DB --local --command "SELECT * FROM orders LIMIT 10;"

# View sessions
npx wrangler d1 execute DB --local --command "SELECT * FROM questionnaire_sessions LIMIT 10;"
```

---

## Production Deployment

### Create Production Database
```bash
# Create D1 database in Cloudflare
npx wrangler d1 create fitgenius-db

# Copy the database_id from output and update wrangler.jsonc
# Replace "local-db" with actual production database ID

# Apply migration to production
npx wrangler d1 execute DB --remote --file=migrations/0001_initial_schema.sql
```

### Deploy to Cloudflare Pages
```bash
npm run build
npx wrangler pages deploy dist
```

---

## Environment Variables Required

Make sure these are set in Cloudflare Pages settings:

```bash
OPENROUTER_API_KEY=<your-api-key>
KAPITAL_MERCHANT_ID=<your-merchant-id>
KAPITAL_APPROVE_URL=https://your-domain.com/payment/approve
KAPITAL_CANCEL_URL=https://your-domain.com/payment/cancel
KAPITAL_DECLINE_URL=https://your-domain.com/payment/decline
```

---

## Migration Rollback (If Needed)

If you need to revert changes:

```bash
# Drop all tables
npx wrangler d1 execute DB --local --command "
DROP TABLE IF EXISTS questionnaire_sessions;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;
"

# Re-apply migration
npx wrangler d1 execute DB --local --file=migrations/0001_initial_schema.sql
```

---

## Summary

✅ **Currency updated** from AZN to USD across all pricing
✅ **Database migrated** from in-memory to Cloudflare D1
✅ **All API endpoints** now use persistent database storage
✅ **User data** is properly saved and retrievable
✅ **Orders** are tracked with payment status
✅ **Sessions** auto-expire after 24 hours
✅ **Local testing** ready with initialized database
✅ **Production ready** with proper database schema

The application now has a robust, scalable database backend that properly stores user information, questionnaire responses, and order data!

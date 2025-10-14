# Production Database Setup Guide

## Current Status ✅

Your **local development database is working perfectly**:
- ✅ D1 database initialized
- ✅ Schema applied (4 tables created)
- ✅ Local database ready at `.wrangler/state/v3/d1`

## Production Deployment Steps

### Option 1: Manual Setup via Cloudflare Dashboard (Recommended)

#### Step 1: Create D1 Database
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **D1**
3. Click **"Create database"**
4. Name it: `fitgenius-db`
5. Click **"Create"**
6. Copy the **Database ID** (looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

#### Step 2: Update wrangler.jsonc
Replace `"database_id": "local-db"` with your actual production database ID:

```json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "fitgenius-db",
      "database_id": "YOUR-ACTUAL-DATABASE-ID-HERE"
    }
  ]
}
```

#### Step 3: Apply Migration to Production
Open your terminal and run:

```bash
npx wrangler d1 execute DB --remote --file=migrations/0001_initial_schema.sql
```

Or manually execute via Cloudflare Dashboard:
1. Go to your D1 database in Cloudflare Dashboard
2. Click on **"Console"** tab
3. Copy and paste the contents of `migrations/0001_initial_schema.sql`
4. Click **"Execute"**

#### Step 4: Deploy to Cloudflare Pages
```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist
```

---

### Option 2: Command Line Setup (If OAuth Works)

If you can login via CLI:

```bash
# Login to Cloudflare
npx wrangler login

# Create production database
npx wrangler d1 create fitgenius-db

# Note the database_id from output and update wrangler.jsonc

# Apply migration to production
npx wrangler d1 execute DB --remote --file=migrations/0001_initial_schema.sql

# Deploy
npm run build
npx wrangler pages deploy dist
```

---

### Option 3: Keep Using Local Development

For now, you can continue using the **local database** which is already working:

```bash
# Start dev server (uses local D1 database)
npm run dev
```

Your local database is fully functional and will persist data across restarts!

---

## Verify Production Database

After applying the migration, verify tables were created:

```bash
# Check tables
npx wrangler d1 execute DB --remote --command "SELECT name FROM sqlite_master WHERE type='table';"
```

Expected output:
```
users
orders
questionnaire_sessions
```

---

## Environment Variables for Production

Once deployed, set these in **Cloudflare Pages Settings**:

1. Go to your Pages project
2. Navigate to **Settings** → **Environment variables**
3. Add the following:

```
OPENROUTER_API_KEY=your-openrouter-api-key-here
KAPITAL_MERCHANT_ID=your-kapital-merchant-id
KAPITAL_APPROVE_URL=https://your-domain.com/payment/approve
KAPITAL_CANCEL_URL=https://your-domain.com/payment/cancel
KAPITAL_DECLINE_URL=https://your-domain.com/payment/decline
```

---

## Testing Checklist

### Local Testing (Working Now ✅)
- [x] Database connected
- [x] Tables created
- [x] Schema applied
- [ ] Start questionnaire
- [ ] Submit answers
- [ ] Verify data saved in database

### Verify Local Data Persistence
```bash
# View saved sessions
npx wrangler d1 execute DB --local --command "SELECT id, current_step, user_path FROM questionnaire_sessions;"

# View users
npx wrangler d1 execute DB --local --command "SELECT id, email, name FROM users;"

# View orders
npx wrangler d1 execute DB --local --command "SELECT id, plan_type, amount, currency, status FROM orders;"
```

---

## Common Issues & Solutions

### Issue: OAuth Login Fails
**Solution:** Use Cloudflare Dashboard to create database manually (Option 1 above)

### Issue: "Database not found"
**Solution:** Verify `wrangler.jsonc` has correct database_id

### Issue: "Table doesn't exist"
**Solution:** Re-run migration:
```bash
npx wrangler d1 execute DB --local --file=migrations/0001_initial_schema.sql
```

### Issue: Can't see data in database
**Solution:** Check that environment binding is correct:
```bash
# For local development
npm run dev

# Database should be accessible at c.env.DB
```

---

## Quick Start Commands

### Local Development (Ready Now!)
```bash
npm run dev
# Access at http://localhost:8788
```

### Check Local Database
```bash
# View all tables
npx wrangler d1 execute DB --local --command "SELECT name FROM sqlite_master WHERE type='table';"

# Check for data
npx wrangler d1 execute DB --local --command "SELECT COUNT(*) as count FROM questionnaire_sessions;"
```

### Build for Production
```bash
npm run build
```

---

## Your Next Steps

1. ✅ **Local database is working** - You can start testing now!
2. ⏳ **Test the application locally** - Start questionnaire, submit data
3. ⏳ **Create production database** - Use Cloudflare Dashboard (Option 1)
4. ⏳ **Deploy to production** - When ready for live users

---

## Support

If you encounter any issues:

1. Check database connection:
   ```bash
   npx wrangler d1 info DB
   ```

2. View logs:
   ```bash
   npm run dev
   # Watch terminal for errors
   ```

3. Reset local database (if needed):
   ```bash
   npx wrangler d1 execute DB --local --command "DROP TABLE IF EXISTS questionnaire_sessions; DROP TABLE IF EXISTS orders; DROP TABLE IF EXISTS users;"
   npx wrangler d1 execute DB --local --file=migrations/0001_initial_schema.sql
   ```

---

## Summary

✅ **Your local development environment is ready!**
- Database connected
- Schema applied
- USD currency configured
- All API endpoints using D1

You can start developing and testing immediately with `npm run dev`. Production deployment can be done later when you're ready to go live!

# Manual Authentication & Database Migration

## Issue
The OAuth login window is not opening automatically when running wrangler commands.

## ✅ Fixed Database ID
Your `wrangler.jsonc` has been corrected:
- **Removed duplicate** database ID
- **Current database_id**: `b8882878-32ea-43dc-802d-b5a1b7793553`

---

## Option 1: Manual Browser Login (Recommended)

### Step 1: Copy the OAuth URL
When you see "Failed to open", wrangler shows a long URL. Copy this URL from your terminal.

The URL looks like:
```
https://dash.cloudflare.com/oauth2/auth?response_type=code&client_id=...
```

### Step 2: Open the URL Manually
1. Copy the entire OAuth URL from the terminal
2. Paste it into your browser (Chrome, Edge, Firefox, etc.)
3. Login to Cloudflare if prompted
4. Authorize the application
5. You'll be redirected to localhost:8976 (wrangler will catch this)

### Step 3: Re-run the Command
After successful authentication, run:
```bash
npx wrangler d1 execute DB --remote --file=migrations/0001_initial_schema.sql
```

---

## Option 2: Use Cloudflare Dashboard (Easiest)

Skip the CLI authentication and apply migration manually:

### Step 1: Login to Cloudflare Dashboard
Go to: https://dash.cloudflare.com

### Step 2: Navigate to Your D1 Database
1. Click **Workers & Pages** in the left sidebar
2. Click **D1**
3. Find your database: **fitgenius-db**
4. Click on it to open

### Step 3: Open Database Console
1. Click the **"Console"** tab at the top
2. You'll see a SQL query editor

### Step 4: Copy & Paste Migration SQL
1. Open the file: `migrations/0001_initial_schema.sql`
2. Copy ALL the SQL content
3. Paste it into the Cloudflare D1 Console
4. Click **"Execute"**

### Step 5: Verify Tables Created
In the console, run:
```sql
SELECT name FROM sqlite_master WHERE type='table';
```

You should see:
- users
- orders
- questionnaire_sessions

---

## Option 3: Alternative CLI Login

### Try Browser-Specific Login
```bash
# Set default browser environment variable
set BROWSER=chrome
npx wrangler login

# Or manually specify browser
npx wrangler login --browser=chrome
```

### Use API Token Instead
1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Create a new API token with these permissions:
   - Account - D1 - Edit
   - Account - Workers Scripts - Edit
   - Zone - Workers Routes - Edit
3. Copy the token
4. Set it as environment variable:
```bash
set CLOUDFLARE_API_TOKEN=your-token-here
npx wrangler d1 execute DB --remote --file=migrations/0001_initial_schema.sql
```

---

## Verify Migration Success

After applying the migration (any method), verify:

```bash
# Check tables exist
npx wrangler d1 execute DB --remote --command "SELECT name FROM sqlite_master WHERE type='table';"

# Expected output:
# - users
# - orders
# - questionnaire_sessions
```

---

## Current OAuth URL

If you want to try the manual browser method, here's the URL from your terminal:

```
https://dash.cloudflare.com/oauth2/auth?response_type=code&client_id=54d11594-84e4-41aa-b438-e81b8fa78ee7&redirect_uri=http%3A%2F%2Flocalhost%3A8976%2Foauth%2Fcallback&scope=account%3Aread%20user%3Aread%20workers%3Awrite%20workers_kv%3Awrite%20workers_routes%3Awrite%20workers_scripts%3Awrite%20workers_tail%3Aread%20d1%3Awrite%20pages%3Awrite%20zone%3Aread%20ssl_certs%3Awrite%20ai%3Awrite%20queues%3Awrite%20pipelines%3Awrite%20secrets_store%3Awrite%20containers%3Awrite%20cloudchamber%3Awrite%20connectivity%3Aadmin%20offline_access&state=Qmgc1m7R6N74qzYdFkwqeaGNFHKNXFm9&code_challenge=e08gGZs0HkRxuoao9E2rUO3qF5LIvH1e8R3BqmIL_DM&code_challenge_method=S256
```

**Important:** This URL expires after a few minutes. If it doesn't work, re-run the wrangler command to generate a fresh one.

---

## Troubleshooting

### Issue: "Database not found"
**Solution:** The database_id in `wrangler.jsonc` has been fixed. If you still see this error:
1. Go to Cloudflare Dashboard → D1
2. Find your database
3. Verify the ID matches: `b8882878-32ea-43dc-802d-b5a1b7793553`

### Issue: "Authentication timeout"
**Solution:** The OAuth URL expires. Generate a new one:
```bash
npx wrangler d1 execute DB --remote --file=migrations/0001_initial_schema.sql
```
Then immediately copy and paste the URL into your browser.

### Issue: "Port 8976 already in use"
**Solution:** Close any other wrangler processes:
```bash
# Kill all node processes (be careful!)
taskkill /F /IM node.exe

# Or just close terminals running wrangler
```

---

## Recommended Approach

**For fastest setup, use Option 2 (Cloudflare Dashboard):**

1. ✅ Go to https://dash.cloudflare.com
2. ✅ Navigate to Workers & Pages → D1 → fitgenius-db
3. ✅ Click "Console" tab
4. ✅ Copy content from `migrations/0001_initial_schema.sql`
5. ✅ Paste and execute
6. ✅ Done! No authentication issues.

---

## After Migration Success

Once your tables are created, you can:

1. **Deploy your application:**
   ```bash
   npm run build
   npx wrangler pages deploy dist
   ```

2. **Test locally with production database:**
   Your local dev server can still use local database, or you can test against production.

3. **Set environment variables:**
   - Go to Cloudflare Pages project settings
   - Add OPENROUTER_API_KEY and payment credentials

---

## Summary

✅ **Database ID fixed** in wrangler.jsonc
🔄 **Three options** to apply migration:
   1. Copy OAuth URL manually to browser
   2. Use Cloudflare Dashboard (easiest)
   3. Use API token instead of OAuth

Choose the method that works best for you!

# 🚀 Quick Reference - Supabase Setup

## ⚡ 5-Minute Setup Guide

### 1️⃣ Create Supabase Project (2 min)

```
1. Go to https://supabase.com → Sign up
2. Create new project
3. Wait for provisioning
```

### 2️⃣ Run Database Schema (1 min)

```
1. Open Supabase → SQL Editor
2. Copy content from supabase-schema.sql
3. Paste and click "Run"
```

### 3️⃣ Get Credentials (1 min)

```
1. Settings → API
2. Copy:
   - Project URL
   - anon public key
```

### 4️⃣ Configure Locally (1 min)

```bash
# Create .env file
cp .env.example .env

# Edit .env - paste your credentials
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciO...

# Restart dev server
bun dev
```

### 5️⃣ Test (1 min)

```
1. Open http://localhost:3000
2. Add a bookmark
3. Check Supabase → Table Editor → bookmarks
4. Should see your bookmark! ✅
```

---

## 🎯 Deploy to Netlify

### Add Environment Variables

```
Netlify Dashboard → Site Settings → Environment Variables

Add:
- VITE_SUPABASE_URL = your-url
- VITE_SUPABASE_ANON_KEY = your-key

Then: Redeploy
```

---

## 📁 Files You Need to Know

| File                  | What to Do                    |
| --------------------- | ----------------------------- |
| `supabase-schema.sql` | Run in Supabase SQL Editor    |
| `.env.example`        | Copy to `.env` and fill in    |
| `.env`                | Add your Supabase credentials |
| `SUPABASE_SETUP.md`   | Full detailed guide           |

---

## 🐛 Quick Troubleshooting

### "Could not load your bookmarks"

```bash
# Check .env file exists and has correct values
cat .env

# Restart dev server
bun dev
```

### Build fails

```bash
# Already tested - should work ✅
bun run build
```

### No bookmarks after deploy

```
→ Add env vars to Netlify dashboard
→ Redeploy
```

---

## ✅ Checklist

Before deploying:

- [ ] Created Supabase project
- [ ] Ran `supabase-schema.sql`
- [ ] Created `.env` with credentials
- [ ] Tested locally (added a bookmark)
- [ ] Verified in Supabase Table Editor
- [ ] Added env vars to Netlify
- [ ] Deployed to production
- [ ] Tested in production

---

## 📚 Full Docs

- **Complete Setup**: `SUPABASE_SETUP.md`
- **Architecture**: `ARCHITECTURE.md`
- **Integration Details**: `SUPABASE_INTEGRATION.md`
- **Summary**: `SUPABASE_SUMMARY.md`

---

**That's it! Your bookmarks are now in the cloud!** ☁️✨

# 🚀 Supabase Setup Guide for Markit

This guide will help you set up Supabase as the cloud database for your Markit bookmarks app.

## 📋 Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Your Markit project code

## 🔧 Step-by-Step Setup

### 1. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click **"New project"**
3. Fill in the details:
   - **Name**: `markit-bookmarks` (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose the closest region to your users
4. Click **"Create new project"**
5. Wait for the project to be provisioned (takes ~2 minutes)

### 2. Set Up the Database Schema

1. In your Supabase project dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy and paste the entire content from `supabase-schema.sql` in this project
4. Click **"Run"** (or press `Ctrl+Enter`)
5. You should see a success message

This creates:

- ✅ `bookmarks` table with all necessary columns
- ✅ Indexes for fast queries
- ✅ Row Level Security (RLS) policies
- ✅ Automatic timestamp updates

### 3. Get Your API Credentials

1. In your Supabase project, click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** in the settings menu
3. You'll see two important values:

   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)

4. Keep this page open or copy these values

### 4. Configure Your Local Environment

1. In your project root, create a `.env` file:

   ```bash
   # Copy from .env.example
   cp .env.example .env
   ```

2. Edit the `.env` file and add your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

   Replace the values with the ones from Step 3.

3. **Important**: The `.env` file is already in `.gitignore`, so it won't be committed to Git.

### 5. Test Locally

1. Restart your development server:

   ```bash
   bun dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)
3. Try adding a bookmark
4. Check if it appears in the Supabase dashboard:
   - Go to **Table Editor** → **bookmarks**
   - You should see your bookmark!

### 6. Deploy to Netlify

1. In your Netlify dashboard, go to your site settings
2. Navigate to **Site configuration** → **Environment variables**
3. Add the same environment variables:

   | Key                      | Value                                 |
   | ------------------------ | ------------------------------------- |
   | `VITE_SUPABASE_URL`      | `https://your-project-id.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `your-anon-key-here`                  |

4. Redeploy your site (or push a new commit to trigger auto-deploy)

## 🔒 Security Notes

### Anonymous Users

This setup uses **anonymous authentication** via a unique user ID stored in localStorage. This means:

- ✅ No login required
- ✅ Each browser gets a unique ID
- ✅ Bookmarks are private to each browser
- ⚠️ Clearing browser data will create a new ID (bookmarks won't sync)

### Row Level Security (RLS)

RLS policies ensure:

- Users can only see their own bookmarks
- Users can only modify their own bookmarks
- Data is isolated per user

### Upgrading to Real Authentication (Optional)

If you want to add proper user accounts later:

1. Enable Supabase Auth (Email/Password, Google, GitHub, etc.)
2. Update RLS policies to use `auth.uid()` instead of `app.user_id`
3. Update the `bookmarkService.ts` to use Supabase Auth

## 🎯 What Happens to Old LocalStorage Data?

When you first load the app with Supabase configured:

1. The app detects existing localStorage bookmarks
2. Automatically migrates them to Supabase
3. Shows a toast notification: "Migrating your local bookmarks to cloud storage..."
4. Clears localStorage after successful migration

Your data is safe! ✅

## 📊 Verify Your Setup

Check if everything is working:

1. **Add a bookmark** in the app
2. **Go to Supabase** → Table Editor → bookmarks
3. **Refresh the page** → Your bookmark should still be there
4. **Open the app on another device** → Won't see bookmarks (different user_id)
5. **Clear browser data and revisit** → New user_id created

## 🐛 Troubleshooting

### "Could not load your bookmarks" error

**Cause**: Missing or incorrect Supabase credentials

**Fix**:

1. Check your `.env` file has correct values
2. Restart the dev server: `bun dev`
3. Check browser console for specific errors

### Bookmarks not saving

**Cause**: RLS policies blocking writes

**Fix**:

1. Re-run the SQL schema from `supabase-schema.sql`
2. Check Supabase logs: **Logs** → **Database**

### Different bookmarks on different devices

**Expected behavior**: Each device has a unique `user_id` stored in localStorage.

**Solution**: To share bookmarks across devices, you need to implement proper authentication (see "Upgrading to Real Authentication" above).

### Connection errors in production

**Cause**: Environment variables not set in Netlify

**Fix**:

1. Go to Netlify → Site settings → Environment variables
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Redeploy

## 🎉 You're Done!

Your Markit app is now powered by Supabase! Your bookmarks will:

- ✅ Persist across browser sessions
- ✅ Survive computer restarts
- ✅ Load from the cloud
- ✅ Be backed up automatically

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Need help?** Check the Supabase logs or open an issue in the repository.

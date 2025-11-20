# Cloud Sync - Quick Start Guide

## What's New?
Your DailyDime app now supports **Cloud Sync**! This means:
- ✅ Your data is backed up in the cloud (Supabase)
- ✅ Access your finances from any device
- ✅ Never lose data even if you clear your browser

## How to Use

### 1. First Time Setup
1. Open the app - you'll see a **Login** button in the header
2. Click **Sign Up** to create an account
3. Enter your email and password (minimum 6 characters)
4. You're done! Your data will now sync automatically

### 2. Logging In
- Click the **Login** button in the header
- Enter your credentials
- Your cloud data will load automatically

### 3. Logging Out
- Click the **Logout** button in the header (visible when logged in)

## Database Setup (Already Done!)
The SQL schema has been created in `supabase_schema.sql`. To activate it:
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase_schema.sql`
4. Paste and run it

This creates:
- `profiles` table (user preferences)
- `transactions` table (income/expenses)
- `loans` table ("To Take" feature)
- Row Level Security policies (your data is private!)

## How It Works
- **Offline Mode**: If you're not logged in, data saves to your browser (LocalStorage)
- **Online Mode**: When logged in, every action (add/delete transaction, etc.) syncs to Supabase instantly
- **Auto-Sync**: On login, your cloud data replaces local data

## Next Steps
- Test by creating an account
- Add some transactions
- Log out and log back in to verify sync works
- Try accessing from a different browser/device!

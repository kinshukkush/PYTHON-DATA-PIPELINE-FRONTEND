# 🔧 Fix Vercel API Error

## Problem
Your deployed app at https://python-frontend-iota.vercel.app/ shows:
```
Error Occurred
Failed to load analytics data. Please try again.
```

## Root Cause
The environment variable `VITE_API_BASE_URL` is **NOT set in Vercel**.

## Solution: Add Environment Variable in Vercel

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Click on your project: **python-frontend-iota**

### Step 2: Navigate to Settings
1. Click on **"Settings"** tab at the top
2. Click on **"Environment Variables"** in the left sidebar

### Step 3: Add the Environment Variable
1. Click **"Add New"** button
2. Fill in:
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `https://python-data-pipelinee.onrender.com`
   - **Environments:** Check all three boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development

3. Click **"Save"**

### Step 4: Redeploy
After adding the environment variable, you MUST redeploy:

1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click the **three dots (...)** on the right
4. Click **"Redeploy"**
5. Confirm by clicking **"Redeploy"** again

### Step 5: Wait & Test
1. Wait 1-2 minutes for deployment to complete
2. Visit: https://python-frontend-iota.vercel.app/
3. The dashboard should now load with data! ✅

## Why This Happens
- In production, the app uses `VITE_API_BASE_URL` from environment variables
- Without it, the app doesn't know where to fetch data from
- Local development works because it uses the proxy in `vite.config.ts`

## Verification
After redeployment, you should see:
- ✅ Dashboard with total orders and revenue
- ✅ Products page with product list
- ✅ Orders page with order data
- ✅ No "API Offline" or "Failed to load" errors

---

**If you still see errors after this:**
1. Check browser console (F12) for specific error messages
2. Verify the environment variable is spelled correctly: `VITE_API_BASE_URL`
3. Ensure the backend URL is correct: `https://python-data-pipelinee.onrender.com`
4. Make sure you redeployed after adding the variable

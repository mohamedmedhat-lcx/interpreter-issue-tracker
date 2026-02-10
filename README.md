# Interpreter Issue Tracker

A centralized system for tracking interpreter issues including missed calls and account problems.

## 🚀 Quick Deploy to Railway (Recommended - 24/7 Free Hosting)

### Step 1: Create Railway Account
1. Go to https://railway.app/
2. Sign up with GitHub (it's free)

### Step 2: Deploy Your App
1. Install Railway CLI (optional but easier):
   ```
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```
   railway login
   ```

3. Initialize and deploy:
   ```
   railway init
   railway up
   ```

4. Get your public URL:
   ```
   railway domain
   ```

### Alternative: Deploy via Railway Dashboard (No CLI needed)
1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Connect your GitHub account
4. Push this code to a GitHub repository
5. Select the repository in Railway
6. Railway will auto-detect and deploy
7. Click "Generate Domain" to get your public URL

### Step 3: Share with Your Team
Once deployed, you'll get a URL like: `https://your-app.railway.app`

Share this URL with your team - it works 24/7 from anywhere!

---

## 🔄 Alternative: Deploy to Render (Also Free)

1. Go to https://render.com/
2. Sign up (free)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Click "Create Web Service"
7. Get your URL: `https://your-app.onrender.com`

---

## 💻 Local Development (Testing Only)

### 1. Install Dependencies
```
npm install
```

### 2. Start the Server
```
npm start
```

The server will start on port 3000.

## Usage

### For Team Members (Interpreters)
1. Open the shared URL
2. Click "Report Issue"
3. Fill in the details
4. Submit

### For Supervisor (You)
1. Open the same URL
2. Click "View Issues" tab
3. See all reported issues in real-time
4. Filter by type, status, or search
5. Export to CSV for daily reports
6. Edit or update issue statuses

## Data Storage
All issues are stored in `issues.json` file on the server. This file is automatically created when the server starts.

## Tips
- Keep the server running during work hours
- Export to CSV at end of day for records
- Update issue statuses as they're resolved

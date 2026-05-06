# 🚀 Quick Start Guide

## Step 1: Open Terminal

Press **Ctrl + `** in VS Code or open PowerShell

## Step 2: Install Dependencies

```powershell
npm install
```

Wait for installation to complete (takes ~30-60 seconds)

## Step 3: Start the Server

```powershell
npm start
```

You should see:
```
🎨 Portfolio Gallery Server
📍 Running on http://localhost:3000
✅ Press Ctrl+C to stop
```

## Step 4: Access the Gallery

Open your browser and go to:

### 🏠 Homepage (Auth Modal)
`http://localhost:3000`

### 👥 Admin Gallery (Full Control)
`http://localhost:3000/admin/`
- Password: `0000`

### 👤 Guest Gallery (View Only)
`http://localhost:3000/guest/`

## ✅ Test the Features

### Admin Upload:
1. Go to `/admin/`
2. Click **📤 Upload Image**
3. Select image file
4. Image appears instantly
5. Delete with **✖** button

### Guest View:
1. Go to `/guest/`
2. See images
3. Download with **⬇️** on hover
4. Upload button hidden
5. Delete button hidden

### Dark Mode:
1. Click **🌙** button (top-right)
2. Toggles to **☀️** in dark mode
3. Preference saved

## 🎯 What's Created

- ✅ `gallery.db` - SQLite database
- ✅ `uploads/` folder - Image storage
- ✅ API running on port 3000
- ✅ Frontend connected to backend

## 🛑 Stop Server

Press **Ctrl + C** in terminal

## ❓ Need Help?

See `SETUP.md` for detailed docs and troubleshooting.

---

**Ready?** Run `npm start` and visit `http://localhost:3000` 🎨

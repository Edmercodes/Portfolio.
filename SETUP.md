# 🎨 Portfolio Gallery with Backend

A full-featured image gallery system with persistent storage, admin uploads, and guest access.

## ✨ Features

✅ **Permanent Image Storage** - Images persist in SQLite database + `/uploads` folder
✅ **Admin Controls** - Upload & delete images (Admin only)
✅ **Guest Access** - View & download images (no upload/delete)
✅ **Dark Mode Toggle** - Theme preference saved to localStorage
✅ **Image Zoom & Pan** - Click to zoom, scroll to pan, drag to move
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Role-Based Access** - localStorage-based simple auth system

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Setup Steps

1. **Install Dependencies**
   ```bash
   cd c:\Users\HRMO\git-portfolio
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:3000`

3. **Access the Gallery**
   - Homepage: `http://localhost:3000`
   - Admin Gallery: `http://localhost:3000/admin/`
   - Guest Gallery: `http://localhost:3000/guest/`

## 🔐 Authentication

### Default Credentials
- **Admin Password**: `0000`
- **Admin Role**: Via homepage modal or direct `/admin/` link
- **Guest Role**: Default or via `/guest/` link

### How It Works
1. Visit homepage (`index.html`)
2. Click "Admin" and enter password `0000`
3. Redirects to `/admin/` with full control
4. Guests can visit `/guest/` for view/download only

Role is stored in `localStorage.userRole` and persists across sessions.

## 📁 Project Structure

```
git-portfolio/
├── index.html           # Homepage with auth modal
├── artworks.html        # Main gallery (shared UI)
├── admin/
│   └── index.html       # Admin wrapper (redirects to artworks with ?view=admin)
├── guest/
│   └── index.html       # Guest wrapper (redirects to artworks with ?view=guest)
├── server.js            # Express server + API routes
├── script.js            # Frontend logic (zoom, upload, dark mode)
├── style.css            # Global styles
├── package.json         # Dependencies
├── uploads/             # ⬅️ Image files stored here (created auto)
└── gallery.db           # SQLite database (created auto)
```

## 🔌 API Endpoints

### GET /api/images
Fetch all images with metadata

**Response:**
```json
[
  {
    "id": 1,
    "filename": "1234567890-abc123.jpg",
    "original_name": "my-artwork.jpg",
    "upload_date": "2026-05-06T10:30:00.000Z"
  }
]
```

### POST /api/upload
Upload a new image (multipart/form-data)

**Request:**
- Form field: `image` (file)

**Response:**
```json
{
  "id": 1,
  "filename": "1234567890-abc123.jpg",
  "original_name": "my-artwork.jpg",
  "upload_date": "2026-05-06T10:30:00.000Z"
}
```

### DELETE /api/images/:id
Delete an image by ID

**Response:**
```json
{
  "success": true,
  "message": "Image deleted"
}
```

## 🎨 Dark Mode

- Toggle button: `🌙` / `☀️` (top-right)
- Preference saved in `localStorage.theme`
- Loads automatically on page refresh

## 🎯 Admin Features

- ✅ Upload single or multiple images
- ✅ Delete any image (with confirmation)
- ✅ View & download all images
- ✅ Upload button visible only when logged as Admin
- ✅ Delete buttons visible only on images (hover/always for admin)

## 👤 Guest Features

- ✅ View all images
- ✅ Download images
- ✅ Zoom & pan images
- ❌ Cannot upload
- ❌ Cannot delete
- ❌ Upload/delete buttons hidden

## 🛠️ Customization

### Change Admin Password
Edit `server.js` line 14:
```javascript
const ADMIN_PASSWORD = '0000'; // Change this
```

### Change Upload Folder
Edit `server.js` line 27:
```javascript
destination: (req, file, cb) => {
  cb(null, 'uploads/'); // Change folder path
}
```

### Change Server Port
Edit `server.js` line 9:
```javascript
const PORT = 3000; // Change port number
```

Update `script.js` line with same port:
```javascript
const API_BASE = 'http://localhost:3000'; // Update port
```

## 📝 Database Schema

### images table
```sql
CREATE TABLE images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT UNIQUE NOT NULL,
  original_name TEXT NOT NULL,
  upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 🐛 Troubleshooting

### "Cannot GET /admin/"
- Ensure server is running (`npm start`)
- Check if port 3000 is in use

### Images not uploading
- Check `/uploads` folder exists (created auto)
- Verify file is an image (jpg, png, gif, webp)
- Check browser console for errors

### Dark mode not working
- Clear browser cache
- Check `localStorage` in DevTools

### Permission denied errors
- Run terminal as Administrator (Windows)
- Or change upload folder to a writable location

## 🚦 Stopping the Server

Press `Ctrl + C` in the terminal

## 📚 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js + Express
- **Database**: SQLite3
- **File Upload**: Multer
- **CORS**: Enabled for flexibility

## 🎓 Learning Resources

- Express Docs: https://expressjs.com
- Multer: https://github.com/expressjs/multer
- SQLite3: https://www.sqlite.org
- Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

## 📄 License

MIT - Feel free to modify and use for your projects

---

**Happy coding!** 🚀

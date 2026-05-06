const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads folder if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.random().toString(36).substr(2, 9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Initialize Database
const db = new sqlite3.Database('gallery.db', (err) => {
  if (err) {
    console.error('Database error:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT UNIQUE NOT NULL,
      original_name TEXT NOT NULL,
      upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Table creation error:', err);
    else console.log('Images table ready');
  });
}

// ===== API ROUTES =====

// GET all images
app.get('/api/images', (req, res) => {
  db.all('SELECT id, filename, original_name, upload_date FROM images ORDER BY upload_date DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// POST upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const filename = req.file.filename;
  const originalName = req.file.originalname;

  db.run(
    'INSERT INTO images (filename, original_name) VALUES (?, ?)',
    [filename, originalName],
    function(err) {
      if (err) {
        fs.unlink(req.file.path, () => {}); // Delete file if DB insert fails
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        id: this.lastID,
        filename: filename,
        original_name: originalName,
        upload_date: new Date().toISOString()
      });
    }
  );
});

// DELETE image
app.delete('/api/images/:id', (req, res) => {
  const id = req.params.id;

  db.get('SELECT filename FROM images WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!row) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }

    // Delete file from uploads folder
    const filePath = path.join(__dirname, 'uploads', row.filename);
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) console.error('File deletion error:', unlinkErr);

      // Delete from database
      db.run('DELETE FROM images WHERE id = ?', [id], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ success: true, message: 'Image deleted' });
      });
    });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🎨 Portfolio Gallery Server`);
  console.log(`📍 Running on http://localhost:${PORT}`);
  console.log(`✅ Press Ctrl+C to stop\n`);
});

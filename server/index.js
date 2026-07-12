import express from 'express';
import cors from 'cors';
import { initDb, runQuery, allQuery, getQuery } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Map front-end resource name to SQL table name
const tableMap = {
  departments: 'departments',
  categories: 'categories',
  employees: 'employees',
  assets: 'assets',
  bookings: 'bookings',
  maintenance: 'maintenance_requests',
  audits: 'audit_cycles',
  notifications: 'notifications',
  logs: 'activity_logs',
  transfers: 'transfer_requests'
};

// Start DB initialization
initDb().then(() => {
  console.log('Database initialized.');
}).catch(err => {
  console.error('Database initialization failed:', err);
});

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getQuery(`SELECT * FROM users WHERE email = ?`, [email]);
    if (user && user.password === password) {
      // Find matching employee details
      const emp = await getQuery(`SELECT * FROM employees WHERE email = ?`, [email]);
      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: emp?.role || user.role,
        avatar: emp?.avatar || '',
        phone: emp?.phone || '',
        department: emp?.department || '',
        token: `mock-token-${user.id}`
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name, phone, department, avatar, role } = req.body;
  const userId = `u_${Date.now()}`;
  const empId = `e_${Date.now()}`;
  const employeeCode = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
  const userRole = role === 'admin' ? 'admin' : 'employee';

  try {
    // 1. Create user account
    await runQuery(
      `INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)`,
      [userId, email, password, name, userRole]
    );

    // 2. Create matching employee profile
    await runQuery(
      `INSERT INTO employees (id, employeeId, name, email, phone, department, role, status, joinDate, avatar)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [empId, employeeCode, name, email, phone || '', department || '', userRole, 'active', new Date().toISOString().split('T')[0], avatar || '']
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer mock-token-')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = authHeader.replace('Bearer mock-token-', '');
  try {
    const user = await getQuery(`SELECT * FROM users WHERE id = ?`, [userId]);
    if (user) {
      const emp = await getQuery(`SELECT * FROM employees WHERE email = ?`, [user.email]);
      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: emp?.role || user.role,
        avatar: emp?.avatar || '',
        phone: emp?.phone || '',
        department: emp?.department || ''
      });
    } else {
      res.status(401).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/auth/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer mock-token-')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = authHeader.replace('Bearer mock-token-', '');
  const { name, phone, department, avatar } = req.body;

  try {
    const user = await getQuery(`SELECT * FROM users WHERE id = ?`, [userId]);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update users table
    await runQuery(`UPDATE users SET name = ? WHERE id = ?`, [name || user.name, userId]);

    // Update employees table matching user's email
    await runQuery(
      `UPDATE employees SET name = ?, phone = ?, department = ?, avatar = ? WHERE email = ?`,
      [name || user.name, phone || '', department || '', avatar || '', user.email]
    );

    // Fetch the updated user and employee info
    const updatedUser = await getQuery(`SELECT * FROM users WHERE id = ?`, [userId]);
    const emp = await getQuery(`SELECT * FROM employees WHERE email = ?`, [updatedUser.email]);

    res.json({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: emp?.role || updatedUser.role,
      avatar: emp?.avatar || '',
      phone: emp?.phone || '',
      department: emp?.department || ''
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dynamic CRUD routes for all standard entities
app.get('/api/:resource', async (req, res) => {
  const table = tableMap[req.params.resource];
  if (!table) return res.status(404).json({ message: 'Resource not found' });

  try {
    const rows = await allQuery(`SELECT * FROM ${table}`);
    
    // Parse JSON lists/objects if needed
    const parsed = rows.map(row => {
      const copy = { ...row };
      // Parse list fields if stored as JSON strings
      if (copy.fields && typeof copy.fields === 'string') {
        try { copy.fields = JSON.parse(copy.fields); } catch {}
      }
      if (copy.documents && typeof copy.documents === 'string') {
        try { copy.documents = JSON.parse(copy.documents); } catch {}
      }
      // SQLite stores boolean as 1/0, convert to true/false
      if (copy.isBookable !== undefined) {
        copy.isBookable = copy.isBookable === 1;
      }
      if (copy.read !== undefined) {
        copy.read = copy.read === 1;
      }
      if (copy.locked !== undefined) {
        copy.locked = copy.locked === 1;
      }
      return copy;
    });

    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/:resource', async (req, res) => {
  const table = tableMap[req.params.resource];
  if (!table) return res.status(404).json({ message: 'Resource not found' });

  const data = req.body;
  const id = data.id || `${req.params.resource.slice(0, 3)}_${Date.now()}`;

  // Handle boolean/JSON columns for SQLite storage
  const cleanedData = { ...data, id };
  if (cleanedData.fields && typeof cleanedData.fields !== 'string') {
    cleanedData.fields = JSON.stringify(cleanedData.fields);
  }
  if (cleanedData.documents && typeof cleanedData.documents !== 'string') {
    cleanedData.documents = JSON.stringify(cleanedData.documents);
  }
  if (cleanedData.isBookable !== undefined) {
    cleanedData.isBookable = cleanedData.isBookable ? 1 : 0;
  }
  if (cleanedData.read !== undefined) {
    cleanedData.read = cleanedData.read ? 1 : 0;
  }
  if (cleanedData.locked !== undefined) {
    cleanedData.locked = cleanedData.locked ? 1 : 0;
  }

  const columns = Object.keys(cleanedData);
  const placeholders = columns.map(() => '?').join(', ');
  const values = Object.values(cleanedData);

  const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;

  try {
    await runQuery(sql, values);
    // Return standard object format
    const row = await getQuery(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/:resource/:id', async (req, res) => {
  const table = tableMap[req.params.resource];
  if (!table) return res.status(404).json({ message: 'Resource not found' });

  const data = req.body;
  const { id } = req.params;

  const cleanedData = { ...data };
  delete cleanedData.id; // Keep primary key immutable

  if (cleanedData.fields && typeof cleanedData.fields !== 'string') {
    cleanedData.fields = JSON.stringify(cleanedData.fields);
  }
  if (cleanedData.documents && typeof cleanedData.documents !== 'string') {
    cleanedData.documents = JSON.stringify(cleanedData.documents);
  }
  if (cleanedData.isBookable !== undefined) {
    cleanedData.isBookable = cleanedData.isBookable ? 1 : 0;
  }
  if (cleanedData.read !== undefined) {
    cleanedData.read = cleanedData.read ? 1 : 0;
  }
  if (cleanedData.locked !== undefined) {
    cleanedData.locked = cleanedData.locked ? 1 : 0;
  }

  const columns = Object.keys(cleanedData);
  const setClause = columns.map(col => `${col} = ?`).join(', ');
  const values = [...Object.values(cleanedData), id];

  const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;

  try {
    await runQuery(sql, values);
    const row = await getQuery(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/:resource/:id', async (req, res) => {
  const table = tableMap[req.params.resource];
  if (!table) return res.status(404).json({ message: 'Resource not found' });

  const { id } = req.params;
  try {
    await runQuery(`DELETE FROM ${table} WHERE id = ?`, [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

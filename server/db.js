import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Helper to run query in a promise
export const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

// Helper to get all records
export const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Helper to get one record
export const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const initDb = async () => {
  // Create tables
  await runQuery(`
    CREATE TABLE IF NOT EXISTS departments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      head TEXT,
      parent TEXT,
      status TEXT,
      employeeCount INTEGER DEFAULT 0,
      code TEXT
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      fields TEXT,
      count INTEGER DEFAULT 0,
      description TEXT
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      employeeId TEXT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      department TEXT,
      role TEXT,
      status TEXT,
      joinDate TEXT,
      avatar TEXT
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      assetTag TEXT UNIQUE,
      serialNumber TEXT,
      acquisitionDate TEXT,
      acquisitionCost REAL,
      condition TEXT,
      location TEXT,
      status TEXT,
      department TEXT,
      allocatedTo TEXT,
      isBookable INTEGER DEFAULT 0,
      photo TEXT,
      documents TEXT
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      resource TEXT,
      bookedBy TEXT,
      date TEXT,
      startTime TEXT,
      endTime TEXT,
      duration TEXT,
      purpose TEXT,
      status TEXT
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS maintenance_requests (
      id TEXT PRIMARY KEY,
      asset TEXT,
      reportedBy TEXT,
      issue TEXT,
      priority TEXT,
      status TEXT,
      technician TEXT,
      createdDate TEXT,
      resolvedDate TEXT,
      notes TEXT
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS audit_cycles (
      id TEXT PRIMARY KEY,
      name TEXT,
      department TEXT,
      location TEXT,
      startDate TEXT,
      endDate TEXT,
      status TEXT,
      auditor TEXT,
      totalAssets INTEGER,
      verified INTEGER,
      missing INTEGER,
      damaged INTEGER,
      progress REAL,
      locked INTEGER
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      userId TEXT,
      type TEXT,
      message TEXT,
      read INTEGER DEFAULT 0,
      timestamp TEXT,
      relatedId TEXT
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      userId TEXT,
      action TEXT,
      module TEXT,
      details TEXT,
      timestamp TEXT
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS transfer_requests (
      id TEXT PRIMARY KEY,
      asset TEXT,
      fromEmployee TEXT,
      toEmployee TEXT,
      status TEXT,
      requestDate TEXT,
      notes TEXT
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'employee'
    )
  `);

  // Seed default admin user if not exists
  const adminExists = await getQuery(`SELECT * FROM users WHERE email = 'admin@assetflow.com'`);
  if (!adminExists) {
    await runQuery(
      `INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)`,
      ['u_admin', 'admin@assetflow.com', 'admin123', 'System Admin', 'admin']
    );
    console.log('Seeded default admin user');
  }
};

export default db;

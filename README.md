# 🚀 AssetFlow – Enterprise Asset & Resource Management System

An Enterprise Asset & Resource Management System built for the **Odoo Hackathon 2026**.

AssetFlow helps organizations efficiently manage physical assets, shared resources, maintenance workflows, audits, and employee allocations through a centralized ERP platform.

---

## 📖 Overview

Organizations often rely on spreadsheets or manual records to manage company assets, resulting in misplaced equipment, booking conflicts, maintenance delays, and poor visibility.

AssetFlow digitizes the complete asset lifecycle by providing a secure, role-based ERP system for managing:

- Asset Registration
- Asset Allocation & Transfers
- Shared Resource Booking
- Maintenance Management
- Asset Audits
- Notifications
- Reports & Analytics

---

## ✨ Features

### 🔐 Authentication & Role-Based Access

- Secure Login
- Employee Signup
- Role-Based Access Control
- Admin-controlled role assignment
- Session Management

### 🏢 Organization Management

- Department Management
- Employee Directory
- Asset Categories
- Department Hierarchy

### 💻 Asset Management

- Register Assets
- Asset Tag Generation
- Asset Lifecycle Tracking
- Asset Search & Filters
- Asset History
- QR/Serial Tracking

### 👥 Asset Allocation

- Allocate Assets
- Transfer Requests
- Return Workflow
- Conflict Prevention
- Overdue Return Detection

### 📅 Resource Booking

- Meeting Room Booking
- Equipment Booking
- Calendar View
- Booking Validation
- Overlap Prevention
- Booking Reminders

### 🛠 Maintenance

- Raise Maintenance Requests
- Approval Workflow
- Technician Assignment
- Repair Tracking
- Maintenance History

### 📋 Asset Audit

- Audit Cycle Management
- Auditor Assignment
- Verification Process
- Discrepancy Reports
- Audit History

### 📊 Dashboard & Analytics

- Organization KPIs
- Asset Utilization
- Maintenance Trends
- Department Reports
- Booking Analytics
- Exportable Reports

### 🔔 Notifications

- Asset Assigned
- Booking Confirmed
- Maintenance Updates
- Transfer Approval
- Overdue Alerts
- Audit Notifications

---

## 👥 User Roles

### Admin

- Manage Departments
- Manage Employees
- Assign Roles
- View Reports
- Configure Organization

### Asset Manager

- Register Assets
- Allocate Assets
- Approve Transfers
- Manage Maintenance
- Manage Audits

### Department Head

- View Department Assets
- Approve Requests
- Book Resources
- Department Reports

### Employee

- View Assigned Assets
- Book Shared Resources
- Raise Maintenance Requests
- Request Asset Transfers
- View Notifications

---

## 📊 Asset Lifecycle

```
Available
    │
    ├────────► Allocated
    │              │
    │              ▼
    │         Returned
    │              │
    ▼              ▼
Under Maintenance ◄──
    │
    ▼
Available

Additional States

Reserved
Lost
Retired
Disposed
```

---

## 🛠 Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS

### Backend

- Supabase
- PostgreSQL
- Authentication

### UI

- shadcn/ui
- Lucide Icons

### Charts

- Recharts

---

## 📂 Project Structure

```
src/
│
├── components/
├── pages/
├── hooks/
├── services/
├── utils/
├── assets/
├── layouts/
└── App.tsx
```

---

## 🚀 Getting Started

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build Production Version

```bash
npm run build
```

---

## 🎯 Core Business Rules

- One asset cannot be allocated to multiple employees.
- Resource bookings cannot overlap.
- Maintenance requires approval before work begins.
- Asset history is maintained throughout its lifecycle.
- Overdue returns are automatically highlighted.
- Audit discrepancies are tracked and reported.
- Role assignment is controlled by Admin only.

---

## 📈 Future Enhancements

- QR Code Scanning
- Mobile Application
- AI Predictive Maintenance
- Barcode Integration
- Email Notifications
- Multi-Organization Support
- IoT Asset Tracking

---

## 👨‍💻 Team

Developed for **Odoo Hackathon 2026**

Project: **AssetFlow – Enterprise Asset & Resource Management System**

---

## 📄 License

This project was developed for educational and hackathon purposes.

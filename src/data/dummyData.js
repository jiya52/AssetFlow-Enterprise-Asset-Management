// AssetFlow Dummy Data Generator

// Departments
export const departments = [
  { id: 'd1', name: 'Information Technology', head: 'e1', parent: null, status: 'active', employeeCount: 18, code: 'IT' },
  { id: 'd2', name: 'Human Resources', head: 'e2', parent: null, status: 'active', employeeCount: 12, code: 'HR' },
  { id: 'd3', name: 'Finance & Accounting', head: 'e3', parent: null, status: 'active', employeeCount: 14, code: 'FIN' },
  { id: 'd4', name: 'Operations', head: 'e4', parent: null, status: 'active', employeeCount: 22, code: 'OPS' },
  { id: 'd5', name: 'Marketing', head: 'e5', parent: null, status: 'active', employeeCount: 10, code: 'MKT' },
  { id: 'd6', name: 'Sales', head: 'e6', parent: null, status: 'active', employeeCount: 16, code: 'SLS' },
  { id: 'd7', name: 'Research & Development', head: 'e7', parent: null, status: 'active', employeeCount: 8, code: 'R&D' },
  { id: 'd8', name: 'Quality Assurance', head: 'e8', parent: 'd7', status: 'active', employeeCount: 6, code: 'QA' },
  { id: 'd9', name: 'Customer Support', head: 'e9', parent: 'd6', status: 'active', employeeCount: 14, code: 'CS' },
  { id: 'd10', name: 'Legal & Compliance', head: 'e10', parent: null, status: 'active', employeeCount: 5, code: 'LGL' },
  { id: 'd11', name: 'Procurement', head: 'e11', parent: 'd4', status: 'active', employeeCount: 7, code: 'PRC' },
  { id: 'd12', name: 'Facilities Management', head: 'e12', parent: 'd4', status: 'active', employeeCount: 9, code: 'FAC' },
  { id: 'd13', name: 'Administration', head: 'e13', parent: null, status: 'active', employeeCount: 6, code: 'ADM' },
  { id: 'd14', name: 'Training & Development', head: 'e14', parent: 'd2', status: 'active', employeeCount: 4, code: 'T&D' },
  { id: 'd15', name: 'Security', head: 'e15', parent: 'd4', status: 'inactive', employeeCount: 3, code: 'SEC' },
];

// Asset Categories
export const assetCategories = [
  { id: 'c1', name: 'Electronics', icon: '💻', fields: ['Warranty Period', 'Voltage'], count: 85, description: 'Laptops, monitors, phones, tablets' },
  { id: 'c2', name: 'Furniture', icon: '🪑', fields: ['Material', 'Dimensions'], count: 65, description: 'Desks, chairs, cabinets, shelves' },
  { id: 'c3', name: 'Vehicles', icon: '🚗', fields: ['License Plate', 'Fuel Type', 'Mileage'], count: 20, description: 'Cars, vans, trucks' },
  { id: 'c4', name: 'Machinery', icon: '⚙️', fields: ['Power Rating', 'Warranty Period'], count: 30, description: 'Industrial and office machinery' },
  { id: 'c5', name: 'Office Equipment', icon: '🖨️', fields: ['Warranty Period', 'Model Number'], count: 60, description: 'Printers, scanners, projectors' },
  { id: 'c6', name: 'Medical Equipment', icon: '🏥', fields: ['Calibration Date', 'Certification'], count: 40, description: 'Medical devices and instruments' },
];

const roles = ['employee', 'department_head', 'asset_manager', 'admin'];
const statuses = ['active', 'inactive'];
const firstNames = ['James','Mary','Robert','Patricia','John','Jennifer','Michael','Linda','David','Elizabeth','William','Barbara','Richard','Susan','Joseph','Jessica','Thomas','Sarah','Christopher','Karen','Charles','Lisa','Daniel','Nancy','Matthew','Betty','Anthony','Margaret','Mark','Sandra','Donald','Ashley','Steven','Kimberly','Paul','Emily','Andrew','Donna','Joshua','Michelle','Kenneth','Carol','Kevin','Amanda','Brian','Dorothy','George','Melissa','Timothy','Deborah','Ronald','Stephanie','Edward','Rebecca','Jason','Sharon','Jeffrey','Laura','Ryan','Cynthia','Jacob','Kathleen','Gary','Amy','Nicholas','Angela','Eric','Shirley','Jonathan','Anna','Stephen','Brenda','Larry','Pamela','Justin','Emma','Scott','Nicole','Brandon','Helen','Benjamin','Samantha','Samuel','Katherine','Raymond','Christine','Gregory','Debra','Frank','Rachel','Alexander','Carolyn','Patrick','Janet','Jack','Catherine','Dennis','Maria','Jerry','Heather','Tyler','Diane','Aaron','Ruth','Jose','Julie','Adam','Olivia','Nathan','Joyce','Henry','Virginia','Peter','Victoria','Zachary','Kelly','Douglas','Lauren','Harold','Christina','Carl','Joan','Arthur','Evelyn','Gerald','Judith','Roger','Megan','Keith','Andrea','Jeremy','Cheryl','Terry','Hannah','Sean','Jacqueline','Albert','Martha','Austin','Gloria'];
const lastNames = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores','Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts'];

export const employees = Array.from({ length: 120 }, (_, i) => {
  const fn = firstNames[i % firstNames.length];
  const ln = lastNames[i % lastNames.length];
  const deptIdx = i % 15;
  let role = 'employee';
  if (i < 1) role = 'admin';
  else if (i < 16) role = 'department_head';
  else if (i < 20) role = 'asset_manager';
  return {
    id: `e${i + 1}`,
    employeeId: `EMP-${String(1000 + i).padStart(4, '0')}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@assetflow.com`,
    phone: `+1 (${500 + (i % 500)}) ${String(1000000 + Math.floor(Math.random() * 9000000)).slice(1)}`,
    department: departments[deptIdx].id,
    departmentName: departments[deptIdx].name,
    role,
    status: i < 115 ? 'active' : 'inactive',
    joinDate: `202${Math.floor(i / 40)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    avatar: null,
  };
});

const assetStatuses = ['available', 'allocated', 'reserved', 'under_maintenance', 'lost', 'retired', 'disposed'];
const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];
const locations = ['HQ - Floor 1', 'HQ - Floor 2', 'HQ - Floor 3', 'HQ - Floor 4', 'Branch A', 'Branch B', 'Warehouse 1', 'Warehouse 2', 'Server Room', 'Lab 1', 'Lab 2', 'Parking Lot', 'Medical Wing', 'Training Center', 'Reception'];

const assetNames = {
  c1: ['MacBook Pro 16"', 'Dell XPS 15', 'HP EliteBook 840', 'ThinkPad X1 Carbon', 'iMac 27"', 'Dell Monitor 27"', 'iPhone 15 Pro', 'iPad Air', 'Samsung Galaxy Tab', 'Surface Pro 9', 'Dell Latitude 5540', 'MacBook Air M2', 'HP ProBook 450', 'Lenovo IdeaPad', 'Acer Aspire'],
  c2: ['Standing Desk', 'Ergonomic Chair', 'Filing Cabinet', 'Bookshelf', 'Conference Table', 'Visitor Chair', 'Storage Locker', 'Whiteboard', 'Reception Desk', 'Executive Desk'],
  c3: ['Toyota Camry 2023', 'Ford Transit Van', 'Honda CR-V', 'Chevrolet Express', 'Tesla Model 3'],
  c4: ['CNC Machine', 'Industrial Printer', 'Laser Cutter', 'Assembly Robot', '3D Printer', 'Forklift', 'Air Compressor'],
  c5: ['HP LaserJet Pro', 'Epson Projector', 'Canon Scanner', 'Brother Printer', 'Xerox Copier', 'Shredder', 'Binding Machine', 'Laminator'],
  c6: ['Blood Pressure Monitor', 'Defibrillator', 'ECG Machine', 'Ultrasound Scanner', 'Pulse Oximeter', 'Stethoscope', 'Wheelchair', 'Hospital Bed'],
};

export const assets = Array.from({ length: 300 }, (_, i) => {
  const catIdx = i % 6;
  const cat = assetCategories[catIdx];
  const names = assetNames[cat.id];
  const name = names[i % names.length];
  const statusIdx = i < 140 ? 0 : i < 220 ? 1 : i < 240 ? 2 : i < 260 ? 3 : i < 275 ? 4 : i < 290 ? 5 : 6;
  return {
    id: `a${i + 1}`,
    name: `${name}${i > names.length ? ` #${Math.floor(i / names.length)}` : ''}`,
    category: cat.id,
    categoryName: cat.name,
    assetTag: `AF-${String(10000 + i).padStart(6, '0')}`,
    serialNumber: `SN-${Math.random().toString(36).substr(2, 10).toUpperCase()}`,
    acquisitionDate: `202${Math.floor(i / 100)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    acquisitionCost: Math.floor(200 + Math.random() * 9800),
    condition: conditions[i % 4],
    location: locations[i % locations.length],
    status: assetStatuses[statusIdx],
    department: departments[i % 15].id,
    departmentName: departments[i % 15].name,
    allocatedTo: statusIdx === 1 ? `e${(i % 120) + 1}` : null,
    allocatedToName: statusIdx === 1 ? employees[(i % 120)].name : null,
    isBookable: catIdx === 4 || catIdx === 2 || (i % 5 === 0),
    photo: null,
    documents: [],
  };
});

// Bookings
const bookingStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];
const purposes = ['Team Meeting', 'Client Presentation', 'Training Session', 'Workshop', 'Interview', 'Board Meeting', 'Sprint Planning', 'Product Demo', 'Quarterly Review', 'Site Visit'];
const bookableAssets = assets.filter(a => a.isBookable).slice(0, 30);

export const bookings = Array.from({ length: 150 }, (_, i) => {
  const asset = bookableAssets[i % bookableAssets.length];
  const emp = employees[i % 120];
  const day = (i % 28) + 1;
  const month = (i % 12) + 1;
  const statusIdx = i < 40 ? 0 : i < 60 ? 1 : i < 120 ? 2 : 3;
  return {
    id: `b${i + 1}`,
    resource: asset.id,
    resourceName: asset.name,
    resourceCategory: asset.categoryName,
    bookedBy: emp.id,
    bookedByName: emp.name,
    department: emp.department,
    departmentName: emp.departmentName,
    date: `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    startTime: `${String(8 + (i % 10)).padStart(2, '0')}:00`,
    endTime: `${String(9 + (i % 10)).padStart(2, '0')}:00`,
    duration: 1 + (i % 3),
    purpose: purposes[i % purposes.length],
    status: bookingStatuses[statusIdx],
  };
});

// Maintenance Requests
const maintenanceStatuses = ['pending', 'approved', 'rejected', 'technician_assigned', 'in_progress', 'resolved'];
const priorities = ['low', 'medium', 'high', 'critical'];
const issues = ['Screen flickering', 'Keyboard malfunction', 'Battery not charging', 'Wheel broken', 'Engine noise', 'Paper jam', 'Overheating', 'Software crash', 'Physical damage', 'Calibration needed', 'Hydraulic leak', 'Motor failure', 'Display crack', 'USB port broken', 'Network card failure'];

export const maintenanceRequests = Array.from({ length: 80 }, (_, i) => {
  const asset = assets[i % 300];
  const emp = employees[i % 120];
  const statusIdx = i % 6;
  return {
    id: `m${i + 1}`,
    asset: asset.id,
    assetName: asset.name,
    assetTag: asset.assetTag,
    reportedBy: emp.id,
    reportedByName: emp.name,
    issue: issues[i % issues.length],
    priority: priorities[i % 4],
    status: maintenanceStatuses[statusIdx],
    technician: statusIdx >= 3 ? employees[20 + (i % 10)].name : null,
    createdDate: `2026-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    resolvedDate: statusIdx === 5 ? `2026-${String((i % 12) + 1).padStart(2, '0')}-${String(Math.min((i % 28) + 5, 28)).padStart(2, '0')}` : null,
    notes: '',
  };
});

// Audit Cycles
const auditStatuses = ['planned', 'in_progress', 'completed', 'closed'];
export const auditCycles = Array.from({ length: 25 }, (_, i) => {
  const statusIdx = i < 5 ? 0 : i < 12 ? 1 : i < 20 ? 2 : 3;
  const dept = departments[i % 15];
  return {
    id: `au${i + 1}`,
    name: `${dept.name} Audit Q${(i % 4) + 1} 2026`,
    department: dept.id,
    departmentName: dept.name,
    location: locations[i % locations.length],
    startDate: `2026-${String((i % 12) + 1).padStart(2, '0')}-01`,
    endDate: `2026-${String((i % 12) + 1).padStart(2, '0')}-28`,
    status: auditStatuses[statusIdx],
    auditor: employees[16 + (i % 4)].name,
    auditorId: employees[16 + (i % 4)].id,
    totalAssets: 10 + (i % 20),
    verified: statusIdx >= 2 ? 8 + (i % 15) : Math.floor((10 + (i % 20)) * 0.4),
    missing: statusIdx >= 2 ? i % 3 : 0,
    damaged: statusIdx >= 2 ? i % 2 : 0,
    progress: statusIdx === 0 ? 0 : statusIdx === 1 ? 30 + (i % 50) : 100,
    locked: statusIdx >= 3,
  };
});

// Notifications
const notifTypes = ['asset_assigned', 'transfer_approved', 'maintenance_approved', 'maintenance_rejected', 'booking_confirmed', 'booking_cancelled', 'booking_reminder', 'overdue_return', 'audit_discrepancy'];
const notifMessages = {
  asset_assigned: 'has been assigned to you',
  transfer_approved: 'Transfer request approved',
  maintenance_approved: 'Maintenance request approved',
  maintenance_rejected: 'Maintenance request rejected',
  booking_confirmed: 'Booking confirmed',
  booking_cancelled: 'Booking has been cancelled',
  booking_reminder: 'Upcoming booking reminder',
  overdue_return: 'Asset return is overdue',
  audit_discrepancy: 'Audit discrepancy found',
};

export const notifications = Array.from({ length: 250 }, (_, i) => {
  const type = notifTypes[i % notifTypes.length];
  const hoursAgo = i * 2;
  const now = new Date('2026-07-12T10:00:00');
  const date = new Date(now.getTime() - hoursAgo * 3600000);
  return {
    id: `n${i + 1}`,
    type,
    message: `${assets[i % 300].name} — ${notifMessages[type]}`,
    read: i > 15,
    timestamp: date.toISOString(),
    relatedId: assets[i % 300].id,
  };
});

// Activity Logs
const actions = ['Created', 'Updated', 'Allocated', 'Returned', 'Transferred', 'Booked', 'Cancelled', 'Approved', 'Rejected', 'Resolved', 'Deactivated', 'Activated', 'Audited', 'Registered'];
const modules = ['Asset', 'Booking', 'Maintenance', 'Audit', 'Employee', 'Department', 'Transfer'];

export const activityLogs = Array.from({ length: 500 }, (_, i) => {
  const emp = employees[i % 120];
  const hoursAgo = i;
  const now = new Date('2026-07-12T10:00:00');
  const date = new Date(now.getTime() - hoursAgo * 3600000);
  return {
    id: `log${i + 1}`,
    user: emp.name,
    userId: emp.id,
    action: actions[i % actions.length],
    module: modules[i % modules.length],
    details: `${actions[i % actions.length]} ${modules[i % modules.length].toLowerCase()} record`,
    timestamp: date.toISOString(),
  };
});

// Transfer Requests
export const transferRequests = Array.from({ length: 30 }, (_, i) => {
  const asset = assets[140 + (i % 80)];
  return {
    id: `tr${i + 1}`,
    asset: asset.id,
    assetName: asset.name,
    assetTag: asset.assetTag,
    fromEmployee: employees[i % 60].name,
    fromDepartment: departments[i % 15].name,
    toEmployee: employees[60 + (i % 60)].name,
    toDepartment: departments[(i + 5) % 15].name,
    status: i < 10 ? 'requested' : i < 20 ? 'approved' : 'reallocated',
    requestDate: `2026-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    notes: '',
  };
});

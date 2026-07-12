import React from 'react';

const statusStyles = {
  available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  allocated: 'bg-blue-50 text-blue-700 border-blue-200',
  reserved: 'bg-amber-50 text-amber-700 border-amber-200',
  under_maintenance: 'bg-orange-50 text-orange-700 border-orange-200',
  lost: 'bg-red-50 text-red-700 border-red-200',
  retired: 'bg-gray-50 text-gray-600 border-gray-200',
  disposed: 'bg-gray-100 text-gray-500 border-gray-300',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-gray-50 text-gray-500 border-gray-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  technician_assigned: 'bg-blue-50 text-blue-700 border-blue-200',
  in_progress: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
  ongoing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-gray-50 text-gray-500 border-gray-200',
  planned: 'bg-blue-50 text-blue-700 border-blue-200',
  closed: 'bg-gray-100 text-gray-600 border-gray-300',
  requested: 'bg-amber-50 text-amber-700 border-amber-200',
  reallocated: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  low: 'bg-gray-50 text-gray-600 border-gray-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
  verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  missing: 'bg-red-50 text-red-700 border-red-200',
  damaged: 'bg-orange-50 text-orange-700 border-orange-200',
};

export default function StatusBadge({ status, className = '' }) {
  const label = (status || '').replace(/_/g, ' ');
  const style = statusStyles[status] || 'bg-gray-50 text-gray-600 border-gray-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${style} ${className}`}>
      {label}
    </span>
  );
}

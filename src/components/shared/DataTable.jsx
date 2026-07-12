import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';

export default function DataTable({
  data = [],
  columns = [],
  searchable = true,
  searchPlaceholder = 'Search...',
  pageSize = 10,
  onRowClick,
  filters,
}) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(row =>
        columns.some(col => {
          const val = col.accessor ? (typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor]) : '';
          return String(val || '').toLowerCase().includes(q);
        })
      );
    }
    if (sortCol !== null) {
      const col = columns[sortCol];
      result = [...result].sort((a, b) => {
        const aVal = typeof col.accessor === 'function' ? col.accessor(a) : a[col.accessor];
        const bVal = typeof col.accessor === 'function' ? col.accessor(b) : b[col.accessor];
        const cmp = String(aVal || '').localeCompare(String(bVal || ''), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  }, [data, search, sortCol, sortDir, columns]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="bg-white rounded-2xl border border-[#DCE5EA] overflow-hidden">
      {(searchable || filters) && (
        <div className="p-4 border-b border-[#DCE5EA] flex flex-col sm:flex-row gap-3">
          {searchable && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0); }}
                className="w-full pl-9 pr-4 py-2 bg-[#F4F7F9] rounded-xl text-sm border border-transparent focus:border-[#0F766E] focus:bg-white focus:outline-none transition-all"
              />
            </div>
          )}
          {filters}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#DCE5EA]">
              {columns.map((col, i) => (
                <th
                  key={i}
                  onClick={() => {
                    if (sortCol === i) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
                    else { setSortCol(i); setSortDir('asc'); }
                  }}
                  className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider cursor-pointer hover:text-[#0F172A] select-none"
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-[#64748B]">
                  No records found
                </td>
              </tr>
            ) : (
              paged.map((row, ri) => (
                <motion.tr
                  key={row.id || ri}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: ri * 0.02 }}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-[#F4F7F9] hover:bg-[#F8FAFB] transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col, ci) => (
                    <td key={ci} className="px-4 py-3 text-[#0F172A]">
                      {col.cell ? col.cell(row) : (typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor])}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-[#DCE5EA] flex items-center justify-between text-sm text-[#64748B]">
          <span>
            Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg hover:bg-[#F4F7F9] disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i;
              else if (page < 3) pageNum = i;
              else if (page > totalPages - 4) pageNum = totalPages - 5 + i;
              else pageNum = page - 2 + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium ${page === pageNum ? 'bg-[#0F766E] text-white' : 'hover:bg-[#F4F7F9]'}`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-1.5 rounded-lg hover:bg-[#F4F7F9] disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  Edit, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Trash2,
  Calendar,
  CalendarDays,
  Crown,
  Lock,
  Clock,
  Check
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { DataTableContainer } from '../../../components/composite/DataTableContainer';
import { Pagination } from '../../../components/composite/Pagination';
import { financialYearsApi } from '../../../api/apiservice';
import { FinancialYearDetailModal, FY_STATUS_MAP } from './FinancialYearDetailModal';
import { FinancialYearFormModal } from './FinancialYearFormModal';
import { toast } from '../../../components/composite/Toast';

function extractList(response) {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.financial_years)) return response.financial_years;
  if (Array.isArray(response.years)) return response.years;
  if (Array.isArray(response.data?.financial_years)) return response.data.financial_years;
  if (Array.isArray(response.data?.data)) return response.data.data;
  if (response.data && typeof response.data === 'object' && (response.data.id || response.data.year_code || response.data.year_name)) {
    return [response.data];
  }
  if (response && typeof response === 'object' && (response.id || response.year_code || response.year_name)) {
    return [response];
  }
  return [];
}

const DEFAULT_FINANCIAL_YEARS = [
  {
    id: 1,
    company_id: 1,
    year_code: 'FY 2024-25',
    year_name: 'Financial Year 2024-2025',
    start_date: '2024-04-01',
    end_date: '2025-03-31',
    status_id: 1,
    is_current: 1,
    is_active: 1
  },
  {
    id: 2,
    company_id: 1,
    year_code: 'FY 2023-24',
    year_name: 'Financial Year 2023-2024',
    start_date: '2023-04-01',
    end_date: '2024-03-31',
    status_id: 2,
    is_current: 0,
    is_active: 1,
    closed_at: '2024-04-15 11:30:00'
  },
  {
    id: 3,
    company_id: 1,
    year_code: 'FY 2022-23',
    year_name: 'Financial Year 2022-2023',
    start_date: '2022-04-01',
    end_date: '2023-03-31',
    status_id: 2,
    is_current: 0,
    is_active: 1,
    closed_at: '2023-04-20 16:45:00'
  },
  {
    id: 4,
    company_id: 1,
    year_code: 'FY 2025-26',
    year_name: 'Financial Year 2025-2026',
    start_date: '2025-04-01',
    end_date: '2026-03-31',
    status_id: 4,
    is_current: 0,
    is_active: 1
  }
];

export function FinancialYearsTable({ 
  searchQuery = '', 
  statusFilter = 'all', 
  currentFilter = 'all',
  isAddOpen = false,
  setIsAddOpen = () => {}
}) {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);
  const [editingYear, setEditingYear] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const menuRef = useRef(null);

  const fetchYears = async () => {
    try {
      setLoading(true);
      const response = await financialYearsApi.list();
      const list = extractList(response);
      if (Array.isArray(list) && list.length > 0) {
        setYears(list);
      } else {
        setYears(DEFAULT_FINANCIAL_YEARS);
      }
    } catch (error) {
      console.error('[FinancialYearsTable] Failed to fetch financial years:', error);
      setYears(DEFAULT_FINANCIAL_YEARS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  // Close actions menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteYear = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete financial year "${name}"?`)) return;
    try {
      await financialYearsApi.remove(id);
      toast.success('Financial year deleted successfully');
      fetchYears();
    } catch (err) {
      setYears(prev => prev.filter(y => y.id !== id));
      toast.success('Financial year deleted');
    }
    setOpenMenuId(null);
  };

  const handleSetCurrent = async (year) => {
    try {
      await financialYearsApi.update(year.id, { is_current: 1, current_year_marker: 1 });
      toast.success(`${year.year_code || year.name} set as current financial year`);
      fetchYears();
    } catch (err) {
      setYears(prev => prev.map(y => ({ ...y, is_current: y.id === year.id ? 1 : 0 })));
      toast.success(`${year.year_code || year.name} set as current financial year`);
    }
    setOpenMenuId(null);
  };

  const handleToggleStatus = async (year) => {
    const nextStatus = (year.is_active === 1 || year.is_active === '1' || year.is_active === true) ? 0 : 1;
    try {
      await financialYearsApi.update(year.id, { is_active: nextStatus });
      toast.success(`Financial year set to ${nextStatus === 1 ? 'Active' : 'Inactive'}`);
      fetchYears();
    } catch (err) {
      setYears(prev => prev.map(y => y.id === year.id ? { ...y, is_active: nextStatus } : y));
      toast.success(`Financial year set to ${nextStatus === 1 ? 'Active' : 'Inactive'}`);
    }
    setOpenMenuId(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === '—') return '—';
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const filteredYears = years.filter((year) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const code = (year.year_code || year.code || '').toLowerCase();
      const name = (year.year_name || year.name || '').toLowerCase();
      const start = (year.start_date || '').toLowerCase();
      const end = (year.end_date || '').toLowerCase();
      if (!code.includes(q) && !name.includes(q) && !start.includes(q) && !end.includes(q)) return false;
    }

    if (statusFilter !== 'all') {
      const sId = String(year.status_id || year.status || '1');
      if (sId !== String(statusFilter)) return false;
    }

    if (currentFilter !== 'all') {
      const isCurrent = year.is_current === 1 || year.is_current === '1' || year.is_current === true || year.current_year_marker === 1;
      if (currentFilter === 'current' && !isCurrent) return false;
      if (currentFilter === 'other' && isCurrent) return false;
    }

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredYears.length / itemsPerPage));
  const paginatedYears = filteredYears.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderPagination = () => (
    <Pagination 
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={filteredYears.length}
      itemsPerPage={itemsPerPage}
      onPageChange={setCurrentPage}
      onItemsPerPageChange={setItemsPerPage}
    />
  );

  return (
    <>
      <DataTableContainer pagination={renderPagination()}>
        <table className="w-full text-left text-[12px] whitespace-nowrap table-fixed">
          <thead className="bg-surface-muted text-text-secondary text-[11px] uppercase font-semibold border-b border-border tracking-wider">
            <tr>
              <th className="px-2 py-1.5 w-10 text-center">#</th>
              <th className="px-2 py-1.5 w-28">FY Code</th>
              <th className="px-2 py-1.5 w-60">Financial Year Name</th>
              <th className="px-2 py-1.5 w-52">Period (Start - End)</th>
              <th className="px-2 py-1.5 w-32 text-center">Current Marker</th>
              <th className="px-2 py-1.5 w-36 text-center">Accounting Status</th>
              <th className="px-2 py-1.5 w-24 text-center">Active</th>
              <th className="px-2 py-1.5 text-center w-20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-text-muted text-[12px]">
                  Loading financial years from database...
                </td>
              </tr>
            ) : filteredYears.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-text-muted text-[12px]">
                  No financial years found matching the criteria.
                </td>
              </tr>
            ) : (
              paginatedYears.map((year, index) => {
                const code = year.year_code || year.code || '—';
                const name = year.year_name || year.name || '—';
                const startDate = year.start_date ? String(year.start_date).split('T')[0] : '—';
                const endDate = year.end_date ? String(year.end_date).split('T')[0] : '—';
                const isCurrent = year.is_current === 1 || year.is_current === '1' || year.is_current === true || year.current_year_marker === 1;
                const statusId = year.status_id || year.status || 1;
                const statusConfig = FY_STATUS_MAP[statusId] || { label: 'Open', variant: 'success', icon: CheckCircle2 };
                const StatusIcon = statusConfig.icon;
                const isActive = year.is_active === 1 || year.is_active === '1' || year.is_active === true || year.is_active === undefined;
                const isMenuOpen = openMenuId === year.id;

                return (
                  <tr key={year.id || index} className="hover:bg-surface-muted/30 transition-colors group relative">
                    <td className="px-2 py-1.5 text-center font-medium text-text-primary text-[11px]">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-2 py-1.5 font-mono font-semibold text-text-primary text-[11px]">
                      <div className="flex items-center gap-1.5">
                        {isCurrent && <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" title="Active Financial Year" />}
                        <span>{code}</span>
                      </div>
                    </td>
                    <td className="px-2 py-1.5 font-medium text-text-primary truncate" title={name}>
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                        <span className="truncate">{name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-1.5 text-text-secondary text-[11px]">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Calendar className="w-3 h-3 text-text-muted shrink-0" />
                        <span>{formatDate(startDate)}</span>
                        <span className="text-text-muted">to</span>
                        <span>{formatDate(endDate)}</span>
                      </div>
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          <Crown className="w-2.5 h-2.5" />
                          Current FY
                        </span>
                      ) : (
                        <span className="text-[11px] text-text-muted">—</span>
                      )}
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <Badge 
                        variant={statusConfig.variant}
                        className="text-[9px] font-bold uppercase tracking-wider h-5 px-1.5 inline-flex items-center gap-1 leading-none font-sans"
                      >
                        <StatusIcon className="w-3 h-3" />
                        <span>{statusConfig.label}</span>
                      </Badge>
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <Badge 
                        variant={isActive ? 'success' : 'neutral'}
                        className="text-[9px] font-bold uppercase tracking-wider h-5 px-1.5 inline-flex items-center gap-1 leading-none font-sans"
                      >
                        {isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{isActive ? 'Active' : 'Inactive'}</span>
                      </Badge>
                    </td>
                    <td className="px-2 py-1.5">
                      <div className="flex items-center justify-center gap-0.5">
                        {/* View Button */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedYear(year)}
                          className="h-6 w-6 p-0" 
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-text-secondary hover:text-primary" />
                        </Button>

                        {/* Edit Button */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setEditingYear(year)}
                          className="h-6 w-6 p-0" 
                          title="Edit Financial Year"
                        >
                          <Edit className="w-3.5 h-3.5 text-text-secondary hover:text-primary" />
                        </Button>

                        {/* More Menu */}
                        <div className="relative">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0" 
                            onClick={() => setOpenMenuId(isMenuOpen ? null : year.id)}
                            title="More Actions"
                          >
                            <MoreVertical className="w-3.5 h-3.5 text-text-secondary" />
                          </Button>

                          {isMenuOpen && (
                            <div 
                              ref={menuRef}
                              className="absolute right-0 top-full mt-1 z-50 bg-surface border border-border rounded shadow-level-2 py-1 min-w-[170px] text-[11px] animate-in fade-in zoom-in-95 duration-100"
                            >
                              {!isCurrent && (
                                <button
                                  type="button"
                                  className="w-full px-3 py-1.5 text-left text-text-primary hover:bg-surface-muted flex items-center gap-2"
                                  onClick={() => handleSetCurrent(year)}
                                >
                                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                                  <span>Set as Current FY</span>
                                </button>
                              )}

                              <button
                                type="button"
                                className="w-full px-3 py-1.5 text-left text-text-primary hover:bg-surface-muted flex items-center gap-2"
                                onClick={() => handleToggleStatus(year)}
                              >
                                {isActive ? (
                                  <>
                                    <XCircle className="w-3.5 h-3.5 text-amber-500" />
                                    <span>Set Inactive</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                                    <span>Set Active</span>
                                  </>
                                )}
                              </button>

                              <div className="h-px bg-border my-1" />

                              <button
                                type="button"
                                className="w-full px-3 py-1.5 text-left text-error hover:bg-error/10 flex items-center gap-2"
                                onClick={() => handleDeleteYear(year.id, name)}
                              >
                                <Trash2 className="w-3.5 h-3.5 text-error" />
                                <span>Delete Year</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </DataTableContainer>

      {/* Detail Modal */}
      <FinancialYearDetailModal
        year={selectedYear}
        isOpen={Boolean(selectedYear)}
        onClose={() => setSelectedYear(null)}
        onEdit={(y) => {
          setSelectedYear(null);
          setEditingYear(y);
        }}
      />

      {/* Form Modal (Add / Edit) */}
      <FinancialYearFormModal
        year={editingYear}
        isOpen={Boolean(editingYear) || isAddOpen}
        onClose={() => {
          setEditingYear(null);
          setIsAddOpen(false);
        }}
        onSaveSuccess={(updatedItem) => {
          if (updatedItem && editingYear?.id) {
            setYears(prev => prev.map(y => y.id === editingYear.id ? { ...y, ...updatedItem } : y));
          }
          fetchYears();
        }}
      />
    </>
  );
}

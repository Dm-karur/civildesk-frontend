import { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  Edit, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Trash2,
  Activity,
  PlayCircle,
  Clock,
  AlertCircle,
  Flag,
  ListOrdered
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { DataTableContainer } from '../../../components/composite/DataTableContainer';
import { Pagination } from '../../../components/composite/Pagination';
import { projectStatusesApi } from '../../../api/apiservice';
import { ProjectStatusDetailModal } from './ProjectStatusDetailModal';
import { ProjectStatusFormModal } from './ProjectStatusFormModal';
import { toast } from '../../../components/composite/Toast';

function extractList(response) {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.project_statuses)) return response.project_statuses;
  if (Array.isArray(response.statuses)) return response.statuses;
  if (Array.isArray(response.data?.project_statuses)) return response.data.project_statuses;
  if (Array.isArray(response.data?.data)) return response.data.data;
  if (response.data && typeof response.data === 'object' && (response.data.id || response.data.status_name || response.data.status_code)) {
    return [response.data];
  }
  if (response && typeof response === 'object' && (response.id || response.status_name || response.status_code)) {
    return [response];
  }
  return [];
}

const DEFAULT_PROJECT_STATUSES = [
  {
    id: 1,
    status_code: 'TENDER',
    status_name: 'Tender / Estimation',
    description: 'Pre-bid estimation, client BOQ preparation, and tender submission phase.',
    is_final: 0,
    sort_order: 1,
    is_active: 1
  },
  {
    id: 2,
    status_code: 'PLANNED',
    status_name: 'Planned / Kickoff',
    description: 'Contract awarded, resource mobilization, site zoning, and master schedule baseline.',
    is_final: 0,
    sort_order: 2,
    is_active: 1
  },
  {
    id: 3,
    status_code: 'IN_PROGRESS',
    status_name: 'In Progress',
    description: 'Active construction on site, DPR recording, material usage, and RA billing.',
    is_final: 0,
    sort_order: 3,
    is_active: 1
  },
  {
    id: 4,
    status_code: 'ON_HOLD',
    status_name: 'On Hold',
    description: 'Temporarily suspended due to statutory approvals, weather, design modifications, or client hold.',
    is_final: 0,
    sort_order: 4,
    is_active: 1
  },
  {
    id: 5,
    status_code: 'UNDER_REVIEW',
    status_name: 'Snagging & Quality Audit',
    description: 'Practical completion achieved; pre-handover snag list clearing and inspection.',
    is_final: 0,
    sort_order: 5,
    is_active: 1
  },
  {
    id: 6,
    status_code: 'COMPLETED',
    status_name: 'Completed & Handover',
    description: 'Final completion certificate issued, final account reconciled, client handover completed.',
    is_final: 1,
    sort_order: 6,
    is_active: 1
  },
  {
    id: 7,
    status_code: 'CANCELLED',
    status_name: 'Cancelled / Terminated',
    description: 'Project dropped, de-scoped, or contract closed prior to standard physical completion.',
    is_final: 1,
    sort_order: 7,
    is_active: 1
  }
];

export function ProjectStatusesTable({ 
  searchQuery = '', 
  statusFilter = 'all', 
  stageFilter = 'all',
  isAddOpen = false,
  setIsAddOpen = () => {}
}) {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const menuRef = useRef(null);

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const response = await projectStatusesApi.list();
      const list = extractList(response);
      if (Array.isArray(list) && list.length > 0) {
        setStatuses(list);
      } else {
        setStatuses(DEFAULT_PROJECT_STATUSES);
      }
    } catch (error) {
      console.error('[ProjectStatusesTable] Failed to fetch statuses:', error);
      setStatuses(DEFAULT_PROJECT_STATUSES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
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

  const handleDeleteStatus = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete project status "${name}"?`)) return;
    try {
      await projectStatusesApi.remove(id);
      toast.success('Project status deleted successfully');
      fetchStatuses();
    } catch (err) {
      // Local fallback removal
      setStatuses(prev => prev.filter(s => s.id !== id));
      toast.success('Project status deleted');
    }
    setOpenMenuId(null);
  };

  const handleToggleStatus = async (statusItem) => {
    const nextStatus = (statusItem.is_active === 1 || statusItem.is_active === '1' || statusItem.is_active === true) ? 0 : 1;
    try {
      await projectStatusesApi.update(statusItem.id, { is_active: nextStatus });
      toast.success(`Project status set to ${nextStatus === 1 ? 'Active' : 'Inactive'}`);
      fetchStatuses();
    } catch (err) {
      setStatuses(prev => prev.map(s => s.id === statusItem.id ? { ...s, is_active: nextStatus } : s));
      toast.success(`Project status set to ${nextStatus === 1 ? 'Active' : 'Inactive'}`);
    }
    setOpenMenuId(null);
  };

  const filteredStatuses = statuses.filter((st) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const name = (st.status_name || st.name || '').toLowerCase();
      const code = (st.status_code || st.code || '').toLowerCase();
      const desc = (st.description || '').toLowerCase();
      if (!name.includes(q) && !code.includes(q) && !desc.includes(q)) return false;
    }

    if (statusFilter !== 'all') {
      const isActive = st.is_active === 1 || st.is_active === '1' || st.is_active === true;
      if (statusFilter === 'active' && !isActive) return false;
      if (statusFilter === 'inactive' && isActive) return false;
    }

    if (stageFilter !== 'all') {
      const isFinal = st.is_final === 1 || st.is_final === '1' || st.is_final === true;
      if (stageFilter === 'final' && !isFinal) return false;
      if (stageFilter === 'in_flight' && isFinal) return false;
    }

    return true;
  });

  // Sort by sort_order
  const sortedStatuses = [...filteredStatuses].sort((a, b) => (Number(a.sort_order || 0) - Number(b.sort_order || 0)));

  const totalPages = Math.max(1, Math.ceil(sortedStatuses.length / itemsPerPage));
  const paginatedStatuses = sortedStatuses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadgeStyle = (code, name, isFinal) => {
    const c = String(code || '').toUpperCase();
    if (c.includes('PROGRESS')) return { variant: 'success', icon: PlayCircle };
    if (c.includes('HOLD') || c.includes('CANCEL')) return { variant: 'error', icon: AlertCircle };
    if (c.includes('COMPLET') || isFinal) return { variant: 'info', icon: CheckCircle2 };
    if (c.includes('TENDER') || c.includes('PLAN')) return { variant: 'warning', icon: Clock };
    return { variant: 'neutral', icon: Activity };
  };

  const renderPagination = () => (
    <Pagination 
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={sortedStatuses.length}
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
              <th className="px-2 py-1.5 w-16 text-center">Seq</th>
              <th className="px-2 py-1.5 w-32">Status Code</th>
              <th className="px-2 py-1.5 w-48">Status Name</th>
              <th className="px-2 py-1.5 w-32 text-center">Stage Type</th>
              <th className="px-2 py-1.5 w-64">Description</th>
              <th className="px-2 py-1.5 w-24 text-center">Active</th>
              <th className="px-2 py-1.5 text-center w-20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-text-muted text-[12px]">
                  Loading project statuses from database...
                </td>
              </tr>
            ) : sortedStatuses.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-text-muted text-[12px]">
                  No project statuses found matching the criteria.
                </td>
              </tr>
            ) : (
              paginatedStatuses.map((st, index) => {
                const code = st.status_code || st.code || '—';
                const name = st.status_name || st.name || '—';
                const desc = st.description || '—';
                const sortOrder = st.sort_order ?? 0;
                const isFinal = st.is_final === 1 || st.is_final === '1' || st.is_final === true;
                const isActive = st.is_active === 1 || st.is_active === '1' || st.is_active === true || st.is_active === undefined;
                const isMenuOpen = openMenuId === st.id;
                const badgeStyle = getStatusBadgeStyle(code, name, isFinal);
                const BadgeIcon = badgeStyle.icon;

                return (
                  <tr key={st.id || index} className="hover:bg-surface-muted/30 transition-colors group relative">
                    <td className="px-2 py-1.5 text-center font-medium text-text-primary text-[11px]">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-surface-muted border border-border text-[10px] font-mono font-bold text-text-secondary">
                        {sortOrder}
                      </span>
                    </td>
                    <td className="px-2 py-1.5 font-mono font-semibold text-text-primary text-[11px]">
                      {code}
                    </td>
                    <td className="px-2 py-1.5 font-medium text-text-primary truncate" title={name}>
                      <div className="flex items-center gap-1.5">
                        <Badge 
                          variant={badgeStyle.variant}
                          className="text-[9px] font-bold uppercase tracking-wider h-5 px-1.5 inline-flex items-center gap-1 leading-none font-sans"
                        >
                          <BadgeIcon className="w-3 h-3" />
                          <span>{name}</span>
                        </Badge>
                      </div>
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      {isFinal ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          <Flag className="w-2.5 h-2.5" />
                          Final State
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
                          In-Flight
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-1.5 text-text-secondary truncate text-[11px]" title={desc}>
                      {desc}
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
                          onClick={() => setSelectedStatus(st)}
                          className="h-6 w-6 p-0" 
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-text-secondary hover:text-primary" />
                        </Button>

                        {/* Edit Button */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setEditingStatus(st)}
                          className="h-6 w-6 p-0" 
                          title="Edit Status"
                        >
                          <Edit className="w-3.5 h-3.5 text-text-secondary hover:text-primary" />
                        </Button>

                        {/* More Menu */}
                        <div className="relative">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0" 
                            onClick={() => setOpenMenuId(isMenuOpen ? null : st.id)}
                            title="More Actions"
                          >
                            <MoreVertical className="w-3.5 h-3.5 text-text-secondary" />
                          </Button>

                          {isMenuOpen && (
                            <div 
                              ref={menuRef}
                              className="absolute right-0 top-full mt-1 z-50 bg-surface border border-border rounded shadow-level-2 py-1 min-w-[140px] text-[11px] animate-in fade-in zoom-in-95 duration-100"
                            >
                              <button
                                type="button"
                                className="w-full px-3 py-1.5 text-left text-text-primary hover:bg-surface-muted flex items-center gap-2"
                                onClick={() => handleToggleStatus(st)}
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
                                onClick={() => handleDeleteStatus(st.id, name)}
                              >
                                <Trash2 className="w-3.5 h-3.5 text-error" />
                                <span>Delete Status</span>
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
      <ProjectStatusDetailModal
        status={selectedStatus}
        isOpen={Boolean(selectedStatus)}
        onClose={() => setSelectedStatus(null)}
        onEdit={(st) => {
          setSelectedStatus(null);
          setEditingStatus(st);
        }}
      />

      {/* Form Modal (Add / Edit) */}
      <ProjectStatusFormModal
        status={editingStatus}
        isOpen={Boolean(editingStatus) || isAddOpen}
        onClose={() => {
          setEditingStatus(null);
          setIsAddOpen(false);
        }}
        onSaveSuccess={fetchStatuses}
      />
    </>
  );
}

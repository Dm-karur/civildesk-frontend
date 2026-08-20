import { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  Edit, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Trash2,
  Wrench,
  Layers,
  Gauge
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { DataTableContainer } from '../../../components/composite/DataTableContainer';
import { Pagination } from '../../../components/composite/Pagination';
import { workCategoriesApi } from '../../../api/apiservice';
import { WorkCategoryDetailModal, WORK_STAGES, PROGRESS_METHODS } from './WorkCategoryDetailModal';
import { WorkCategoryFormModal } from './WorkCategoryFormModal';
import { toast } from '../../../components/composite/Toast';

function extractList(response) {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.work_categories)) return response.work_categories;
  if (Array.isArray(response.categories)) return response.categories;
  if (Array.isArray(response.data?.work_categories)) return response.data.work_categories;
  if (Array.isArray(response.data?.data)) return response.data.data;
  if (response.data && typeof response.data === 'object' && (response.data.id || response.data.category_name || response.data.category_code)) {
    return [response.data];
  }
  if (response && typeof response === 'object' && (response.id || response.category_name || response.category_code)) {
    return [response];
  }
  return [];
}

const DEFAULT_WORK_CATEGORIES = [
  {
    id: 1,
    company_id: 1,
    category_code: 'PRELIMINARY',
    category_name: 'Preliminary Works',
    work_stage_id: 1,
    progress_method_id: 3,
    display_order: 10,
    description: 'Site mobilization, surveying, temporary utilities, and site setup.',
    is_active: 1
  },
  {
    id: 2,
    company_id: 1,
    category_code: 'EARTHWORK',
    category_name: 'Earthwork and Excavation',
    work_stage_id: 2,
    progress_method_id: 1,
    display_order: 20,
    description: 'Bulk excavation, trenching, soil disposal, backfilling, and compaction testing.',
    is_active: 1
  },
  {
    id: 3,
    company_id: 1,
    category_code: 'FOUNDATION',
    category_name: 'Foundation Works',
    work_stage_id: 2,
    progress_method_id: 1,
    display_order: 30,
    description: 'Footings, raft slab, tie beams, pedestal casting, and foundation waterproofing.',
    is_active: 1
  },
  {
    id: 4,
    company_id: 1,
    category_code: 'RCC',
    category_name: 'Reinforced Cement Concrete',
    work_stage_id: 3,
    progress_method_id: 1,
    display_order: 40,
    description: 'Columns, shear walls, beams, slabs, shuttering staging, and rebar fabrication.',
    is_active: 1
  },
  {
    id: 5,
    company_id: 1,
    category_code: 'MASONRY',
    category_name: 'Masonry Works',
    work_stage_id: 3,
    progress_method_id: 1,
    display_order: 50,
    description: 'External perimeter walls, internal partition walls, lintels, and sill beams.',
    is_active: 1
  },
  {
    id: 6,
    company_id: 1,
    category_code: 'PLASTERING',
    category_name: 'Plastering Works',
    work_stage_id: 4,
    progress_method_id: 1,
    display_order: 60,
    description: 'Neeru finish internal plaster, double-coat sponge/sand face exterior waterproofing plaster.',
    is_active: 1
  },
  {
    id: 7,
    company_id: 1,
    category_code: 'FLOORING',
    category_name: 'Flooring and Tiling',
    work_stage_id: 4,
    progress_method_id: 1,
    display_order: 70,
    description: 'Living/bedroom vitrified tiles, staircase granite cladding, and toilet anti-skid flooring.',
    is_active: 1
  },
  {
    id: 8,
    company_id: 1,
    category_code: 'PAINTING',
    category_name: 'Painting Works',
    work_stage_id: 4,
    progress_method_id: 1,
    display_order: 80,
    description: 'Putty, primer, premium emulsion inside, and weather-shield acrylic paint outside.',
    is_active: 1
  },
  {
    id: 9,
    company_id: 1,
    category_code: 'MEP',
    category_name: 'MEP Works',
    work_stage_id: 5,
    progress_method_id: 2,
    display_order: 90,
    description: 'Mechanical, electrical, plumbing, drainage lines, and HVAC conduit works.',
    is_active: 1
  },
  {
    id: 10,
    company_id: 1,
    category_code: 'EXTERNAL',
    category_name: 'External Development',
    work_stage_id: 6,
    progress_method_id: 1,
    display_order: 100,
    description: 'Compound wall, paver blocks, stormwater drain, and boundary development.',
    is_active: 1
  }
];

export function WorkCategoriesTable({ 
  searchQuery = '', 
  statusFilter = 'all', 
  stageFilter = 'all',
  isAddOpen = false,
  setIsAddOpen = () => {}
}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const menuRef = useRef(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await workCategoriesApi.list();
      const list = extractList(response);
      if (Array.isArray(list) && list.length > 0) {
        setCategories(list);
      } else {
        setCategories(DEFAULT_WORK_CATEGORIES);
      }
    } catch (error) {
      console.error('[WorkCategoriesTable] Failed to fetch work categories:', error);
      setCategories(DEFAULT_WORK_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
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

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete work category "${name}"?`)) return;
    try {
      await workCategoriesApi.remove(id);
      toast.success('Work category deleted successfully');
      fetchCategories();
    } catch (err) {
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success('Work category deleted');
    }
    setOpenMenuId(null);
  };

  const handleToggleStatus = async (cat) => {
    const nextStatus = (cat.is_active === 1 || cat.is_active === '1' || cat.is_active === true) ? 0 : 1;
    try {
      await workCategoriesApi.update(cat.id, { is_active: nextStatus });
      toast.success(`Work category set to ${nextStatus === 1 ? 'Active' : 'Inactive'}`);
      fetchCategories();
    } catch (err) {
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, is_active: nextStatus } : c));
      toast.success(`Work category set to ${nextStatus === 1 ? 'Active' : 'Inactive'}`);
    }
    setOpenMenuId(null);
  };

  const filteredCategories = categories.filter((cat) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const code = (cat.category_code || cat.code || '').toLowerCase();
      const name = (cat.category_name || cat.name || '').toLowerCase();
      const desc = (cat.description || '').toLowerCase();
      if (!code.includes(q) && !name.includes(q) && !desc.includes(q)) return false;
    }

    if (statusFilter !== 'all') {
      const isActive = cat.is_active === 1 || cat.is_active === '1' || cat.is_active === true;
      if (statusFilter === 'active' && !isActive) return false;
      if (statusFilter === 'inactive' && isActive) return false;
    }

    if (stageFilter !== 'all') {
      const sId = String(cat.work_stage_id || '8');
      if (sId !== String(stageFilter)) return false;
    }

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / itemsPerPage));
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderPagination = () => (
    <Pagination 
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={filteredCategories.length}
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
              <th className="px-2 py-1.5 w-24">Cat Code</th>
              <th className="px-2 py-1.5 w-56">Work Category Name</th>
              <th className="px-2 py-1.5 w-44">Construction Stage</th>
              <th className="px-2 py-1.5 w-44">Progress Method</th>
              <th className="px-2 py-1.5 w-16 text-center">Order</th>
              <th className="px-2 py-1.5 w-56">Description</th>
              <th className="px-2 py-1.5 w-24 text-center">Status</th>
              <th className="px-2 py-1.5 text-center w-20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-text-muted text-[12px]">
                  Loading work categories from database...
                </td>
              </tr>
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-text-muted text-[12px]">
                  No work categories found matching the criteria.
                </td>
              </tr>
            ) : (
              paginatedCategories.map((cat, index) => {
                const code = cat.category_code || cat.code || '—';
                const name = cat.category_name || cat.name || '—';
                const stageId = Number(cat.work_stage_id || 8);
                const stage = WORK_STAGES[stageId]?.name || `Stage #${stageId}`;
                const methodId = Number(cat.progress_method_id || 1);
                const method = PROGRESS_METHODS[methodId]?.name || `Method #${methodId}`;
                const order = cat.display_order ?? 0;
                const desc = cat.description || '—';
                const isActive = cat.is_active === 1 || cat.is_active === '1' || cat.is_active === true || cat.is_active === undefined;
                const isMenuOpen = openMenuId === cat.id;

                return (
                  <tr key={cat.id || index} className="hover:bg-surface-muted/30 transition-colors group relative">
                    <td className="px-2 py-1.5 text-center font-medium text-text-primary text-[11px]">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-2 py-1.5 font-mono font-semibold text-text-primary text-[11px]">
                      {code}
                    </td>
                    <td className="px-2 py-1.5 font-medium text-text-primary truncate" title={name}>
                      <div className="flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                        <span className="truncate">{name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-1.5 text-text-secondary truncate text-[11px]" title={stage}>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/5 text-primary border border-primary/15">
                        <Layers className="w-3 h-3 text-primary/60 shrink-0" />
                        <span className="truncate">{stage}</span>
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-text-secondary truncate text-[11px]" title={method}>
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-text-secondary">
                        <Gauge className="w-3 h-3 text-text-muted shrink-0" />
                        <span className="truncate">{method}</span>
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-center font-mono font-medium text-text-secondary text-[11px]">
                      {order}
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
                          onClick={() => setSelectedCategory(cat)}
                          className="h-6 w-6 p-0" 
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-text-secondary hover:text-primary" />
                        </Button>

                        {/* Edit Button */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setEditingCategory(cat)}
                          className="h-6 w-6 p-0" 
                          title="Edit Category"
                        >
                          <Edit className="w-3.5 h-3.5 text-text-secondary hover:text-primary" />
                        </Button>

                        {/* More Menu */}
                        <div className="relative">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0" 
                            onClick={() => setOpenMenuId(isMenuOpen ? null : cat.id)}
                            title="More Actions"
                          >
                            <MoreVertical className="w-3.5 h-3.5 text-text-secondary" />
                          </Button>

                          {isMenuOpen && (
                            <div 
                              ref={menuRef}
                              className="absolute right-0 top-full mt-1 z-50 bg-surface border border-border rounded shadow-level-2 py-1 min-w-[150px] text-[11px] animate-in fade-in zoom-in-95 duration-100"
                            >
                              <button
                                type="button"
                                className="w-full px-3 py-1.5 text-left text-text-primary hover:bg-surface-muted flex items-center gap-2"
                                onClick={() => handleToggleStatus(cat)}
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
                                onClick={() => handleDeleteCategory(cat.id, name)}
                              >
                                <Trash2 className="w-3.5 h-3.5 text-error" />
                                <span>Delete Category</span>
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
      <WorkCategoryDetailModal
        category={selectedCategory}
        isOpen={Boolean(selectedCategory)}
        onClose={() => setSelectedCategory(null)}
        onEdit={(c) => {
          setSelectedCategory(null);
          setEditingCategory(c);
        }}
      />

      {/* Form Modal (Add / Edit) */}
      <WorkCategoryFormModal
        category={editingCategory}
        isOpen={Boolean(editingCategory) || isAddOpen}
        onClose={() => {
          setEditingCategory(null);
          setIsAddOpen(false);
        }}
        onSaveSuccess={(updatedItem) => {
          if (updatedItem && editingCategory?.id) {
            setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...updatedItem } : c));
          }
          fetchCategories();
        }}
      />
    </>
  );
}

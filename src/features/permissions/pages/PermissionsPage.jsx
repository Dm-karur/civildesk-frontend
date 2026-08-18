import { useState, useEffect } from 'react';
import { 
  Shield, 
  Plus, 
  Search, 
  CheckCircle2, 
  Trash2, 
  Edit, 
  Users, 
  Key,
  Crown
} from 'lucide-react';
import { PageContainer, PageHeader } from '../../../components/layout';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { rolesApi } from '../../../api/apiservice';
import { PermissionsMatrix } from '../components/PermissionsMatrix';
import { RoleFormModal } from '../components/RoleFormModal';
import { toast } from '../../../components/composite/Toast';

const DEFAULT_ROLES = [
  { id: 1, role_name: 'Administrator', role_code: 'ADMIN', description: 'Full root administrative access across all modules', is_active: 1 },
  { id: 2, role_name: 'Project Manager', role_code: 'PM', description: 'Project planning, budgeting, site management, BOQ oversight', is_active: 1 },
  { id: 3, role_name: 'Site Engineer', role_code: 'SITE_ENG', description: 'Day-to-day work progress, labour attendance, site materials', is_active: 1 },
  { id: 4, role_name: 'Accountant / Billing', role_code: 'ACCOUNTANT', description: 'Billing invoices, client payment terms, financial reports', is_active: 1 },
  { id: 5, role_name: 'Quantity Surveyor', role_code: 'QS', description: 'BOQ rate estimations, item measurement verifications', is_active: 1 },
  { id: 6, role_name: 'General Staff', role_code: 'STAFF', description: 'Standard view-only and basic record entry access', is_active: 1 },
];

export function PermissionsPage() {
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await rolesApi.list();
      const list = Array.isArray(res) ? res : (res?.data || res?.roles || []);
      if (Array.isArray(list) && list.length > 0) {
        setRoles(list);
        if (!list.some(r => r.id === selectedRoleId)) {
          setSelectedRoleId(list[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load roles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const selectedRole = roles.find(r => r.id === selectedRoleId) || roles[0];

  const filteredRoles = roles.filter(r => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const name = (r.role_name || r.name || '').toLowerCase();
    const code = (r.role_code || r.code || '').toLowerCase();
    return name.includes(q) || code.includes(q);
  });

  const handleDeleteRole = async (roleId, roleName) => {
    if (roleId === 1) {
      toast.error('Cannot delete the primary Administrator role');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete role "${roleName}"?`)) return;

    try {
      await rolesApi.delete(roleId);
      toast.success('Role deleted successfully');
      fetchRoles();
    } catch (err) {
      toast.error(err?.message || 'Failed to delete role');
    }
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Roles & Permissions" 
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Settings', to: '/settings/company-branch' },
          { label: 'Roles & Permissions' }
        ]}
      />

      {/* Main 2-Column Dense Fit Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-full overflow-hidden">
        {/* Left Column: Role Selector (4 cols) */}
        <div className="lg:col-span-4 flex flex-col bg-surface border border-border rounded-sm overflow-hidden h-full">
          {/* Role Header & Search */}
          <div className="p-3 border-b border-border bg-surface-muted/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-primary" />
                <h3 className="text-[13px] font-bold text-text-primary">System Roles</h3>
              </div>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => {
                  setEditingRole(null);
                  setIsRoleModalOpen(true);
                }}
                className="h-7 text-[11px] px-2 gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Role</span>
              </Button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-text-secondary" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search roles..."
                className="w-full h-7 pl-7 pr-2 text-[11px] bg-background border border-border rounded-xs focus:outline-none focus:border-focus"
              />
            </div>
          </div>

          {/* Roles List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredRoles.map(role => {
              const isSelected = role.id === selectedRole?.id;
              const isSuper = role.id === 1 || role.role_code === 'ADMIN';

              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`p-2.5 rounded-xs border transition-all cursor-pointer group ${
                    isSelected 
                      ? 'bg-primary/5 border-primary shadow-2xs' 
                      : 'bg-background border-border/70 hover:border-border hover:bg-surface-muted/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {isSuper ? (
                        <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      ) : (
                        <Key className="w-3.5 h-3.5 text-text-secondary shrink-0" />
                      )}
                      <span className={`text-[12px] font-semibold ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                        {role.role_name || role.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-surface border border-border text-text-secondary">
                        {role.role_code || `ROLE-${role.id}`}
                      </span>

                      {/* Action icons */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingRole(role);
                          setIsRoleModalOpen(true);
                        }}
                        className="p-1 text-text-secondary hover:text-primary rounded-xs"
                        title="Edit Role"
                      >
                        <Edit className="w-3 h-3" />
                      </button>

                      {!isSuper && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRole(role.id, role.role_name || role.name);
                          }}
                          className="p-1 text-text-secondary hover:text-error rounded-xs"
                          title="Delete Role"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {role.description && (
                    <p className="text-[10px] text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                      {role.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Granular Permissions Matrix (8 cols) */}
        <div className="lg:col-span-8 h-full overflow-hidden">
          <PermissionsMatrix 
            selectedRole={selectedRole}
            onRoleUpdated={fetchRoles}
          />
        </div>
      </div>

      {/* Role Create / Edit Modal */}
      {isRoleModalOpen && (
        <RoleFormModal
          isOpen={isRoleModalOpen}
          role={editingRole}
          onClose={() => {
            setIsRoleModalOpen(false);
            setEditingRole(null);
          }}
          onSaveSuccess={fetchRoles}
        />
      )}
    </PageContainer>
  );
}

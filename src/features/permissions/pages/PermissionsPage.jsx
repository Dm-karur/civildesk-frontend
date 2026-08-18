import { useState, useEffect } from 'react';
import { 
  Shield, 
  Plus, 
  Search, 
  Settings2, 
  List, 
  SlidersHorizontal,
  Crown
} from 'lucide-react';
import { PageContainer, PageHeader } from '../../../components/layout';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { rolesApi } from '../../../api/apiservice';
import { PermissionsTable } from '../components/PermissionsTable';
import { RolesListTable } from '../components/RolesListTable';
import { RoleFormModal } from '../components/RoleFormModal';
import { toast } from '../../../components/composite/Toast';

export function PermissionsPage() {
  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix' | 'roles'
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await rolesApi.list();
      const list = Array.isArray(res) ? res : (res?.data || res?.roles || []);
      if (Array.isArray(list) && list.length > 0) {
        setRoles(list);
        if (!selectedRoleId || !list.some(r => String(r.id) === String(selectedRoleId))) {
          setSelectedRoleId(String(list[0].id));
        }
      } else {
        setRoles([]);
      }
    } catch (err) {
      console.error('Failed to load roles from database:', err);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const selectedRole = roles.find(r => String(r.id) === String(selectedRoleId)) || roles[0];

  const handleDeleteRole = async (roleId, roleName) => {
    if (String(roleId) === '1') {
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

  const handleSelectRoleFromTable = (role) => {
    setSelectedRoleId(String(role.id));
    setActiveTab('matrix');
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

      <div className="flex flex-col gap-3">
        {/* Navigation & Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-surface border border-border rounded-sm">
          {/* Tab buttons */}
          <div className="flex items-center gap-1 bg-surface-muted p-0.5 rounded-xs border border-border">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-xs transition-colors cursor-pointer ${
                activeTab === 'matrix' 
                  ? 'bg-surface text-primary shadow-2xs' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Permissions Matrix</span>
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-xs transition-colors cursor-pointer ${
                activeTab === 'roles' 
                  ? 'bg-surface text-primary shadow-2xs' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>System Roles ({roles.length})</span>
            </button>
          </div>

          {/* Right Action / Role Quick Selector */}
          <div className="flex items-center gap-2">
            {activeTab === 'matrix' && roles.length > 0 && (
              <div className="flex items-center gap-1.5">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Active Role:</label>
                <select
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  className="h-7 px-2 border border-border rounded-xs bg-background text-[11px] font-semibold text-text-primary focus:outline-none focus:border-focus cursor-pointer"
                >
                  {roles.map(r => (
                    <option key={r.id} value={String(r.id)}>
                      {r.role_name || r.name} ({r.role_code || `ROLE-${r.id}`})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingRole(null);
                setIsRoleModalOpen(true);
              }}
              className="h-7 text-[11px] px-2.5 gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Role</span>
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'matrix' ? (
          <PermissionsTable 
            selectedRole={selectedRole}
            onSaveSuccess={fetchRoles}
          />
        ) : (
          <RolesListTable
            roles={roles}
            loading={loading}
            onSelectRoleForPermissions={handleSelectRoleFromTable}
            onEditRole={(role) => {
              setEditingRole(role);
              setIsRoleModalOpen(true);
            }}
            onDeleteRole={handleDeleteRole}
          />
        )}
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

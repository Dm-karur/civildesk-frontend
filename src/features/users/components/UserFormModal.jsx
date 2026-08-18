import { useState, useEffect } from 'react';
import { User, Save, X, Loader2, Key, Shield, ShieldCheck, Building2, UserCheck } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { 
  usersApi, 
  branchesApi, 
  rolesApi,
  userTypeMastersApi, 
  accessLevelMastersApi, 
  userRolesApi, 
  userStatusesApi 
} from '../../../api/apiservice';
import { toast } from '../../../components/composite/Toast';

function extractBranchList(response) {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.branches)) return response.branches;
  if (Array.isArray(response.data?.branches)) return response.data.branches;
  if (Array.isArray(response.data?.data)) return response.data.data;
  if (response.data && typeof response.data === 'object') {
    for (const key in response.data) {
      if (Array.isArray(response.data[key])) return response.data[key];
    }
  }
  if (response && typeof response === 'object') {
    for (const key in response) {
      if (Array.isArray(response[key])) return response[key];
    }
  }
  return [];
}

export function UserFormModal({ user, isOpen, onClose, onSaveSuccess }) {
  const isEditing = Boolean(user?.id);
  const [saving, setSaving] = useState(false);

  // Master lists fetched from database tables
  const [branches, setBranches] = useState([]);
  const [userTypes, setUserTypes] = useState([
    { id: 1, type_name: 'Internal Management' },
    { id: 2, type_name: 'Regular Employee / Staff' },
    { id: 3, type_name: 'Site Engineer / Contractor' },
    { id: 4, type_name: 'External Consultant' }
  ]);
  const [accessLevels, setAccessLevels] = useState([
    { id: 1, level_name: 'Level 1 - Super Administrator' },
    { id: 2, level_name: 'Level 2 - Company Admin' },
    { id: 3, level_name: 'Level 3 - Branch / Project Manager' },
    { id: 4, level_name: 'Level 4 - Site Engineer / Staff' }
  ]);
  const [roles, setRoles] = useState([
    { id: 1, role_name: 'Super Admin / Administrator' },
    { id: 2, role_name: 'Project Manager' },
    { id: 3, role_name: 'Site Engineer' },
    { id: 4, role_name: 'Accountant / Billing' },
    { id: 5, role_name: 'General Staff' }
  ]);
  const [statuses, setStatuses] = useState([
    { id: 1, status_name: 'Active' },
    { id: 2, status_name: 'Inactive' },
    { id: 3, status_name: 'Suspended' },
    { id: 4, status_name: 'Pending Activation' }
  ]);

  const [formData, setFormData] = useState({
    employee_code: '',
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    designation: 'Site Engineer',
    user_type_id: '2',
    access_level_id: '2',
    role_id: '1',
    user_status_id: '1',
    default_branch_id: '',
    is_super_admin: 0,
    is_active: 1,
    must_change_password: 0,
    company_id: '1'
  });

  useEffect(() => {
    // Fetch live database tables cleanly
    branchesApi.list()
      .then(res => {
        const list = extractBranchList(res);
        if (Array.isArray(list) && list.length > 0) setBranches(list);
      })
      .catch(() => {});

    rolesApi.list()
      .then(res => {
        const list = res?.data || res || [];
        if (Array.isArray(list) && list.length > 0) setRoles(list);
      })
      .catch(() => {});

    userTypeMastersApi.list()
      .then(list => {
        if (Array.isArray(list) && list.length > 0) setUserTypes(list);
      })
      .catch(() => {});

    accessLevelMastersApi.list()
      .then(list => {
        if (Array.isArray(list) && list.length > 0) setAccessLevels(list);
      })
      .catch(() => {});

    userStatusesApi.list()
      .then(list => {
        if (Array.isArray(list) && list.length > 0) setStatuses(list);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        employee_code: user.employee_code || '',
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        designation: user.designation || 'Site Engineer',
        user_type_id: String(user.user_type_id || '2'),
        access_level_id: String(user.access_level_id || (user.is_super_admin ? '1' : '2')),
        role_id: String(user.role_id || user.roles?.[0]?.id || user.role_ids?.[0] || '1'),
        user_status_id: String(user.user_status_id || '1'),
        default_branch_id: user.default_branch_id || '',
        is_super_admin: user.is_super_admin ? 1 : 0,
        is_active: user.is_active !== undefined ? Number(user.is_active) : 1,
        must_change_password: user.must_change_password ? 1 : 0,
        company_id: user.company_id || '1'
      });
    } else {
      setFormData({
        employee_code: '',
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        designation: 'Site Engineer',
        user_type_id: '2',
        access_level_id: '2',
        role_id: '1',
        user_status_id: '1',
        default_branch_id: '',
        is_super_admin: 0,
        is_active: 1,
        must_change_password: 0,
        company_id: '1'
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'is_super_admin') {
      const isSuper = checked ? 1 : 0;
      setFormData(prev => ({
        ...prev,
        is_super_admin: isSuper,
        access_level_id: isSuper ? '1' : prev.access_level_id,
        role_id: isSuper ? '1' : prev.role_id
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const selectedRoleId = Number(formData.role_id) || 1;
      const selectedAccessLevel = Number(formData.access_level_id) || (formData.is_super_admin ? 1 : 2);
      const selectedUserType = Number(formData.user_type_id) || 2;
      const selectedUserStatus = Number(formData.user_status_id) || 1;

      // Build complete payload matching all 6 MySQL tables
      const payload = {
        ...formData,
        role_id: selectedRoleId,
        role_ids: [selectedRoleId],
        roles: [selectedRoleId],
        access_level_id: selectedAccessLevel,
        user_type_id: selectedUserType,
        user_status_id: selectedUserStatus,
        company_id: Number(formData.company_id) || 1,
        default_branch_id: formData.default_branch_id ? Number(formData.default_branch_id) : null,
        is_super_admin: formData.is_super_admin ? 1 : 0,
        is_active: Number(formData.is_active),
        active: Number(formData.is_active),
        must_change_password: Number(formData.must_change_password)
      };

      // Don't send empty password when editing existing user
      if (isEditing && !payload.password) {
        delete payload.password;
      }

      if (isEditing) {
        await usersApi.update(user.id, payload);
        toast.success('User updated successfully');
      } else {
        await usersApi.create(payload);
        toast.success('User created successfully');
      }
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to save user:', err);
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to save user. Check required fields.';
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-sm shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-muted/60">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <h3 className="text-[13px] font-bold text-text-primary">
              {isEditing ? `Edit User: ${user.first_name || user.username}` : 'Add New User'}
            </h3>
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 text-[11px] space-y-3.5 max-h-[80vh] overflow-y-auto">
          {/* Section 1: User Account & Identity */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1">
              <User className="w-3 h-3 text-primary" />
              <span>1. User Account & Identity</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">Employee Code</label>
                <input 
                  type="text"
                  name="employee_code"
                  value={formData.employee_code}
                  onChange={handleChange}
                  placeholder="e.g. EMP-001"
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] font-mono focus:outline-none focus:border-focus"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">Username *</label>
                <input 
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. john.doe"
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] font-mono focus:outline-none focus:border-focus"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">First Name *</label>
                <input 
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="e.g. John"
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">Last Name</label>
                <input 
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="e.g. Doe"
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact, Designation & Type */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-primary" />
              <span>2. Contact & Classification</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">Email Address *</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@company.com"
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">Phone Number</label>
                <input 
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91-9876543210"
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">Designation</label>
                <input 
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g. Project Manager, Site Engineer"
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">User Type</label>
                <select
                  name="user_type_id"
                  value={formData.user_type_id}
                  onChange={handleChange}
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                >
                  {userTypes.map(ut => {
                    const label = ut.type_name || ut.user_type_name || ut.name || ut.type_code || ut.user_type || ut.title || `Type #${ut.id}`;
                    return (
                      <option key={ut.id} value={ut.id}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Branch Access & Level */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-primary" />
              <span>3. Branch & Access Level</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">Default Branch</label>
                <select
                  name="default_branch_id"
                  value={formData.default_branch_id}
                  onChange={handleChange}
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                >
                  <option value="">All Branches / Head Office</option>
                  {branches.map(br => (
                    <option key={br.id} value={br.id}>
                      {br.branch_name || br.name} ({br.branch_code || br.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">
                  Access Level *
                </label>
                <select
                  name="access_level_id"
                  value={formData.access_level_id}
                  onChange={handleChange}
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] font-medium focus:outline-none focus:border-focus"
                  required
                >
                  {accessLevels.map(al => (
                    <option key={al.id} value={al.id}>
                      {al.level_name || al.name || `Access Level #${al.id}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Role & Status */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1">
              <Shield className="w-3 h-3 text-primary" />
              <span>4. Role & Status</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">
                  Assigned User Role *
                </label>
                <select
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleChange}
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] font-medium focus:outline-none focus:border-focus"
                  required
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.role_name || r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">
                  User Status *
                </label>
                <select
                  name="user_status_id"
                  value={formData.user_status_id}
                  onChange={handleChange}
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] font-medium focus:outline-none focus:border-focus"
                  required
                >
                  {statuses.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.status_name || st.name || `Status #${st.id}`}
                    </option>
                  ))}
                </select>
              </div>

              {!isEditing ? (
                <div className="sm:col-span-2">
                  <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">Password *</label>
                  <input 
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter secure password..."
                    className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                    required
                  />
                </div>
              ) : (
                <div className="sm:col-span-2">
                  <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">New Password (optional)</label>
                  <input 
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep existing password"
                    className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                  />
                </div>
              )}

              <div className="flex items-center gap-4 sm:col-span-2 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    name="is_super_admin"
                    checked={formData.is_super_admin === 1}
                    onChange={handleChange}
                    className="rounded-xs text-primary"
                  />
                  <span className="text-[10px] font-medium text-text-primary">Super Administrator Access</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active === 1}
                    onChange={handleChange}
                    className="rounded-xs text-primary"
                  />
                  <span className="text-[10px] font-medium text-text-primary">Account Active</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} className="h-7 text-[11px]">
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={saving} className="h-7 text-[11px] gap-1">
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              <span>{isEditing ? 'Update User' : 'Create User'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  X, 
  Building2, 
  GitBranch, 
  Clock, 
  Key, 
  Lock, 
  Activity, 
  AlertTriangle,
  Crown
} from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export function UserDetailModal({ user, onClose }) {
  if (!user) return null;

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.name || user.username || 'User Details';
  const username = user.username || '—';
  const empCode = user.employee_code || '—';
  const email = user.email || '—';
  const phone = user.phone || '—';
  const designation = user.designation || '—';
  const isSuperAdmin = user.is_super_admin === 1 || user.is_super_admin === '1' || user.is_super_admin === true;
  const isActive = user.is_active === 1 || user.is_active === '1' || user.active === 1 || user.active === '1' || user.status === 'Active' || user.is_active === true;
  const isLocked = Boolean(user.locked_until && new Date(user.locked_until) > new Date());
  const mustChangePass = user.must_change_password === 1 || user.must_change_password === '1' || user.must_change_password === true;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-sm shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-muted/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-primary/10 flex items-center justify-center text-primary">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-bold text-text-primary">
                  {fullName}
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-surface border border-border rounded text-text-secondary font-semibold">
                  {empCode !== '—' ? empCode : `@${username}`}
                </span>
                {isSuperAdmin && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1">
                    <Crown className="w-2.5 h-2.5" />
                    Super Admin
                  </span>
                )}
              </div>
              <p className="text-[10px] text-text-secondary mt-0.5">
                User ID: #{user.id} • Designation: {designation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLocked ? (
              <Badge variant="error" className="text-[9px] font-bold uppercase tracking-wider h-5 px-2 inline-flex items-center gap-1 leading-none font-sans">
                <AlertTriangle className="w-3 h-3" />
                <span>Locked</span>
              </Badge>
            ) : (
              <Badge 
                variant={isActive ? 'success' : 'neutral'}
                className="text-[9px] font-bold uppercase tracking-wider h-5 px-2 inline-flex items-center gap-1 leading-none font-sans"
              >
                {isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                <span>{isActive ? 'Active' : 'Inactive'}</span>
              </Badge>
            )}
            <button 
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary p-1 rounded-xs hover:bg-surface"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Inactive Account Warning Banner */}
        {!isActive && (
          <div className="bg-rose-500/10 border-b border-rose-500/20 px-4 py-2 text-[11px] text-rose-700 dark:text-rose-400">
            ⚠️ <strong>Account Inactive:</strong> This user profile is inactive. System access, branch operations, and authentication are suspended.
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 text-[11px] space-y-3 max-h-[82vh] overflow-y-auto">
          {/* Section 1: User Identity & Role */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1">
              <User className="w-3 h-3 text-primary" />
              <span>User Identity & Role</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-surface-muted/30 p-2.5 rounded-xs border border-border/70">
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Employee Code</span>
                <span className="font-mono font-semibold text-text-primary text-[11px]">{empCode}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Username</span>
                <span className="font-mono font-semibold text-text-primary text-[11px]">@{username}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">First Name</span>
                <span className="font-medium text-text-primary text-[11px]">{user.first_name || '—'}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Last Name</span>
                <span className="font-medium text-text-primary text-[11px]">{user.last_name || '—'}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Designation</span>
                <span className="font-medium text-text-primary text-[11px]">{designation}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">User Type</span>
                <span className="font-medium text-text-primary text-[11px]">{user.user_type_name || user.type_name || (user.user_type_id ? `Type #${user.user_type_id}` : '—')}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">User Status</span>
                <span className="font-medium text-text-primary text-[11px]">{user.status_name || (user.user_status_id ? `Status #${user.user_status_id}` : '—')}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Role Privilege</span>
                <span className="font-semibold text-text-primary text-[11px]">{isSuperAdmin ? 'Super Administrator' : 'Standard User'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1">
              <Mail className="w-3 h-3 text-primary" />
              <span>Contact Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-surface-muted/30 p-2.5 rounded-xs border border-border/70">
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Email Address</span>
                <span className="font-medium text-text-primary text-[11px] break-all">{email}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Phone Number</span>
                <span className="font-medium text-text-primary text-[11px]">{phone}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Email Verified At</span>
                <span className="font-mono text-text-secondary text-[11px]">{user.email_verified_at || 'Not Verified'}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Organization & Branch Affiliation */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-primary" />
              <span>Organization & Branch Affiliation</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-surface-muted/30 p-2.5 rounded-xs border border-border/70">
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Company ID</span>
                <span className="font-mono font-medium text-text-primary text-[11px]">#{user.company_id || '1'}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Assigned Branch</span>
                <span className="font-medium text-text-primary text-[11px]">{user.branch_name || user.default_branch_name || (user.default_branch_id ? `Branch #${user.default_branch_id}` : 'All Branches / Head Office')}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Status Message</span>
                <span className="font-medium text-text-primary text-[11px]">{user.status_message || 'Active User'}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Security & Authentication State */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1">
              <Shield className="w-3 h-3 text-primary" />
              <span>Security & Access Control</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-surface-muted/30 p-2.5 rounded-xs border border-border/70">
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Must Change Password</span>
                <span className={`font-semibold text-[11px] ${mustChangePass ? 'text-amber-600' : 'text-text-primary'}`}>
                  {mustChangePass ? 'Yes (Pending)' : 'No'}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Failed Login Attempts</span>
                <span className="font-mono font-semibold text-text-primary text-[11px]">{user.failed_login_attempts || 0}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Account Lockout</span>
                <span className="font-medium text-text-primary text-[11px]">{user.locked_until || 'None'}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Password Changed At</span>
                <span className="font-mono text-text-secondary text-[11px]">{user.password_changed_at || '—'}</span>
              </div>
            </div>
          </div>

          {/* Section 5: Activity Log & Audit Metadata */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1">
              <Activity className="w-3 h-3 text-primary" />
              <span>Activity Log & Audit Trail</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-surface-muted/30 p-2 rounded-xs border border-border/70 text-[10px]">
              <div>
                <span className="text-[8px] uppercase font-bold text-text-secondary block">Last Active</span>
                <span className="font-mono text-text-secondary">{user.last_active || '—'}</span>
              </div>
              <div>
                <span className="text-[8px] uppercase font-bold text-text-secondary block">Last Login At</span>
                <span className="font-mono text-text-secondary">{user.last_login_at || '—'}</span>
              </div>
              <div>
                <span className="text-[8px] uppercase font-bold text-text-secondary block">Last Login IP</span>
                <span className="font-mono text-text-secondary">{user.last_login_ip || '—'}</span>
              </div>
              <div>
                <span className="text-[8px] uppercase font-bold text-text-secondary block">Created At</span>
                <span className="font-mono text-text-secondary">{user.created_at || '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end items-center gap-2 px-4 py-2.5 border-t border-border bg-surface-muted/40">
          <Button size="sm" variant="outline" className="h-7 text-[11px] px-3" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

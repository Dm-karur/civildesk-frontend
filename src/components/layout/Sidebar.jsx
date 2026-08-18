import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  ClipboardList,
  Users,
  Package,
  Activity,
  Handshake,
  Wallet,
  CheckSquare,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  Crown
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../features/auth/context/AuthContext';
import { Button } from '../ui/Button';

const NAVIGATION = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  {
    name: 'Projects',
    icon: Briefcase,
    submenus: [
      { name: 'Project Master', to: '/projects' },
      { name: 'Clients', to: '/project-masters/clients' },
      { name: 'Project Types', to: '/project-masters/types' },
      { name: 'Project Status', to: '/project-masters/status' },
      { name: 'Project Team', to: '/project-masters/team' },
      { name: 'Financial Year', to: '/project-masters/financial-year' },
      { name: 'Units', to: '/project-masters/units' },
      { name: 'Work Categories', to: '/project-masters/work-categories' }
    ]
  },
  {
    name: 'Site Master',
    icon: Building2,
    submenus: [
      { name: 'Site List', to: '/sites/list' },
      { name: 'Site Assignment', to: '/sites/assignment' }
    ]
  },
  {
    name: 'BOQ & Budget',
    icon: ClipboardList,
    submenus: [
      { name: 'BOQ List', to: '/boq/list' },
      { name: 'Budget Allocation', to: '/boq/budget' }
    ]
  },
  {
    name: 'Labour & Attendance',
    icon: Users,
    submenus: [
      { name: 'Daily Attendance', to: '/labour/attendance' },
      { name: 'Labour Payments', to: '/labour/payments' }
    ]
  },
  {
    name: 'Material Management',
    icon: Package,
    submenus: [
      { name: 'Inventory', to: '/materials/inventory' },
      { name: 'Purchase Orders', to: '/materials/po' }
    ]
  },
  {
    name: 'Daily Operations',
    icon: Activity,
    submenus: [
      { name: 'DPR', to: '/operations/dpr' },
      { name: 'Site Notes', to: '/operations/notes' }
    ]
  },
  {
    name: 'Subcontract Management',
    icon: Handshake,
    submenus: [
      { name: 'Contracts', to: '/subcontracts/list' },
      { name: 'Billing', to: '/subcontracts/billing' }
    ]
  },
  {
    name: 'Project Expenses',
    icon: Wallet,
    submenus: [
      { name: 'Petty Cash', to: '/expenses/petty-cash' },
      { name: 'Invoices', to: '/expenses/invoices' }
    ]
  },
  {
    name: 'Approvals',
    icon: CheckSquare,
    submenus: [
      { name: 'Pending', to: '/approvals/pending' },
      { name: 'History', to: '/approvals/history' }
    ]
  },
  {
    name: 'Report',
    icon: FileText,
    submenus: [
      { name: 'Financial', to: '/reports/financial' },
      { name: 'Progress', to: '/reports/progress' }
    ]
  },
  {
    name: 'Settings',
    icon: Settings,
    submenus: [
      { name: 'Company & Branch', to: '/settings/company-branch' },
      { name: 'User Master', to: '/settings/users' },
      { name: 'Roles & Permissions', to: '/settings/permissions' }
    ]
  },
];

function NavItem({ item }) {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const hasSubmenu = item.submenus && item.submenus.length > 0;

  // Check if any submenu is active to keep the parent highlighted/expanded
  const isSubmenuActive = hasSubmenu && item.submenus.some(sub => location.pathname.startsWith(sub.to));
  const isActive = location.pathname === item.to || isSubmenuActive;

  if (!hasSubmenu) {
    return (
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          clsx(
            'flex items-center gap-3 px-2 h-10 rounded-sm font-medium transition-colors text-[13px] flex-shrink-0',
            isActive
              ? 'bg-primary text-white'
              : 'text-[#C8D1DC] hover:bg-white/5 hover:text-white'
          )
        }
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        <span className="truncate">{item.name}</span>
      </NavLink>
    );
  }

  return (
    <div className="flex flex-col flex-shrink-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className={clsx(
          'flex items-center justify-between px-2 h-10 rounded-sm font-medium transition-colors text-[13px] w-full flex-shrink-0',
          expanded || isActive
            ? 'bg-primary text-white'
            : 'text-[#C8D1DC] hover:bg-white/5 hover:text-white'
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <item.icon className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">{item.name}</span>
        </div>
        {expanded ? <ChevronDown className="w-4 h-4 opacity-50 flex-shrink-0 ml-1" /> : <ChevronRight className="w-4 h-4 opacity-50 flex-shrink-0 ml-1" />}
      </button>

      {expanded && (
        <div className="flex flex-col gap-0.5 mt-0.5 pl-8 pr-1 flex-shrink-0">
          {item.submenus.map((sub) => (
            <NavLink
              key={sub.name}
              to={sub.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center px-2 py-1.5 rounded-sm font-medium transition-colors text-[12px] relative flex-shrink-0',
                  isActive
                    ? 'text-white bg-white/5 after:absolute after:left-0 after:top-1.5 after:bottom-1.5 after:w-[2px] after:bg-primary after:rounded-r-full'
                    : 'text-[#C8D1DC] hover:bg-white/5 hover:text-white'
                )
              }
            >
              <span className="truncate">{sub.name}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isProfileOpen]);

  const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : 'U';

  const handleLogout = () => {
    logout();
  };

  const handleViewDetails = () => {
    setIsProfileOpen(false);
    // navigate('/settings/users/profile'); // Example route
  };

  return (
    <aside className="w-[230px] bg-secondary flex flex-col h-full border-r border-border flex-shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-[rgba(255,255,255,0.1)] flex-shrink-0">
        <span className="text-white font-bold text-[18px] tracking-tight">CIVIL DESK</span>
      </div>

      {/* Navigation */}
      {/* Using standard webkit scrollbar hiding via custom class to remove visible scrollbar but keep scrollability */}
      <nav className="flex-1 min-h-0 overflow-y-auto py-3 px-2 flex flex-col gap-0.5 scrollbar-hide">
        {NAVIGATION.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-[rgba(255,255,255,0.1)] flex-shrink-0 relative" ref={profileRef}>
        {/* Floating Profile Card */}
        {isProfileOpen && (
          <div className="absolute bottom-full left-1.5 right-1.5 mb-2 bg-surface rounded-lg shadow-level-2 border border-border z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            {/* User Info Section */}
            <div className="p-4 flex flex-col gap-3">
              <div className="flex justify-center w-full mb-1">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                  {initials}
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 w-full text-center">
                <span className="text-[14px] font-semibold text-text-primary truncate w-full">
                  {user?.name || 'User'}
                </span>
                <span className="text-[12px] text-text-secondary truncate w-full">
                  {user?.email || 'user@example.com'}
                </span>
                <span className="text-[12px] text-text-secondary truncate w-full">
                  {user?.designation || 'Staff'}
                </span>
                <div className="mt-1.5 flex justify-center w-full">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                    {(user?.user_type_code === 'COMPANY_ADMIN' || user?.is_super_admin) && (
                      <Crown className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                    )}
                    {user?.user_type_code?.replace('_', ' ') || 'User'}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px bg-border w-full" />

            {/* Actions Section */}
            <div className="p-2.5 flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 h-7 text-[11px] px-1"
                onClick={handleViewDetails}
              >
                View Details
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 h-7 text-[11px] px-1 text-error hover:bg-error/10 hover:border-error/30"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        )}

        {/* Trigger */}
        <div 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={clsx(
            "flex items-center justify-between px-2 py-1.5 rounded-sm cursor-pointer transition-colors",
            isProfileOpen ? "bg-white/10" : "hover:bg-white/5"
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-[11px] flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-white truncate leading-tight">{user?.name || 'User'}</p>
              <p className="text-[10px] text-[#C8D1DC] truncate leading-tight mt-0.5">{user?.designation || 'Staff'}</p>
            </div>
          </div>
          <ChevronDown className={clsx("w-4 h-4 text-white flex-shrink-0 ml-1 transition-transform", isProfileOpen && "rotate-180")} />
        </div>
      </div>
    </aside>
  );
}

import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';

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
  { name: 'Settings', to: '/settings', icon: Settings },
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
      <div className="p-3 border-t border-[rgba(255,255,255,0.1)] flex-shrink-0">
        <div className="flex items-center justify-between px-2 py-1.5 rounded-sm hover:bg-white/5 cursor-pointer transition-colors">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-[11px] flex-shrink-0">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-white truncate leading-tight">John Doe</p>
              <p className="text-[10px] text-[#C8D1DC] truncate leading-tight mt-0.5">Project Manager</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 opacity-50 text-white flex-shrink-0 ml-1" />
        </div>
      </div>
    </aside>
  );
}

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
  Crown,
  CalendarDays,
  ShoppingCart,
  Wrench,
  Receipt,
  LineChart,
  MessageSquare,
  Globe,
  FolderCog,
  UserCog,
  Boxes,
  Store,
  Landmark,
  Shield
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
      { name: 'Project Register', to: '/projects/register' },
      { name: 'Add New Project', to: '/projects/new' },
      { name: 'Project Clients', to: '/projects/clients' },
      { name: 'Project Team', to: '/projects/team' },
      { name: 'Project Overview', to: '/projects/overview' },
      { name: 'Project Documents', to: '/projects/documents' },
      { name: 'Project Milestones', to: '/projects/milestones' },
      { name: 'Project Status History', to: '/projects/status-history' }
    ]
  },
  {
    name: 'Sites & Locations',
    icon: Building2,
    submenus: [
      { name: 'Site Register', to: '/sites/register' },
      { name: 'Locations / Zones', to: '/sites/locations' },
      { name: 'Work Locations', to: '/sites/work-locations' },
      { name: 'Site Team Assignment', to: '/sites/team-assignment' },
      { name: 'Site Instructions', to: '/sites/instructions' },
      { name: 'Site Documents', to: '/sites/documents' }
    ]
  },
  {
    name: 'BOQ & Project Budget',
    icon: ClipboardList,
    submenus: [
      { name: 'BOQ Register', to: '/boq/register' },
      { name: 'BOQ Sections', to: '/boq/sections' },
      { name: 'BOQ Items', to: '/boq/items' },
      { name: 'Budget Summary', to: '/boq/budget-summary' },
      { name: 'Budget Revisions', to: '/boq/budget-revisions' },
      { name: 'Variation Orders', to: '/boq/variation-orders' },
      { name: 'Change Approval', to: '/boq/change-approval' },
      { name: 'Drawing Quantity Takeoff', to: '/boq/takeoff' },
      { name: 'Takeoff Review', to: '/boq/takeoff-review' },
      { name: 'Convert Takeoff to BOQ', to: '/boq/convert-takeoff' }
    ]
  },
  {
    name: 'Project Planning',
    icon: CalendarDays,
    submenus: [
      { name: 'Project Activities', to: '/planning/activities' },
      { name: 'Work Programme', to: '/planning/programme' },
      { name: 'Activity–BOQ Mapping', to: '/planning/mapping' },
      { name: 'Planned vs Completed', to: '/planning/planned-vs-completed' },
      { name: 'Look-Ahead Planning', to: '/planning/look-ahead' },
      { name: 'Material Requirements', to: '/planning/material-req' },
      { name: 'Material Forecast', to: '/planning/material-forecast' },
      { name: 'Shortage Predictions', to: '/planning/shortage' },
      { name: 'Planning Alerts', to: '/planning/alerts' }
    ]
  },
  {
    name: 'Labour & Attendance',
    icon: Users,
    submenus: [
      { name: 'Labour Register', to: '/labour/register' },
      { name: 'Labour Deployment', to: '/labour/deployment' },
      { name: 'Daily Attendance', to: '/labour/attendance' },
      { name: 'Attendance Exceptions', to: '/labour/exceptions' },
      { name: 'Timesheets', to: '/labour/timesheets' },
      { name: 'Overtime', to: '/labour/overtime' },
      { name: 'Leave Management', to: '/labour/leave' },
      { name: 'Daily Wages', to: '/labour/wages' },
      { name: 'Manpower Cost', to: '/labour/cost' },
      { name: 'Wage Approval', to: '/labour/approval' },
      { name: 'Labour Reports', to: '/labour/reports' }
    ]
  },
  {
    name: 'Materials & Inventory',
    icon: Package,
    submenus: [
      { name: 'Material Catalogue', to: '/materials/catalogue' },
      { name: 'Stock Overview', to: '/materials/overview' },
      { name: 'Project Stock', to: '/materials/project-stock' },
      { name: 'Material Requests', to: '/materials/requests' },
      { name: 'Stock Receipts', to: '/materials/receipts' },
      { name: 'Stock Issues', to: '/materials/issues' },
      { name: 'Stock Transfers', to: '/materials/transfers' },
      { name: 'Material Returns', to: '/materials/returns' },
      { name: 'Stock Adjustments', to: '/materials/adjustments' },
      { name: 'Delivery Challans', to: '/materials/challans' },
      { name: 'Material Consumption', to: '/materials/consumption' },
      { name: 'Stock Ledger', to: '/materials/ledger' }
    ]
  },
  {
    name: 'Procurement',
    icon: ShoppingCart,
    submenus: [
      { name: 'Purchase Requisitions', to: '/procurement/requisitions' },
      { name: 'Requisition Approval', to: '/procurement/req-approval' },
      { name: 'Request for Quotation', to: '/procurement/rfq' },
      { name: 'Vendor Quotations', to: '/procurement/quotations' },
      { name: 'Quotation Comparison', to: '/procurement/comparison' },
      { name: 'Purchase Orders', to: '/procurement/po' },
      { name: 'Purchase Order Approval', to: '/procurement/po-approval' },
      { name: 'Goods Receipt', to: '/procurement/grn' },
      { name: 'Vendor Invoices', to: '/procurement/invoices' },
      { name: 'Purchase Returns', to: '/procurement/returns' },
      { name: 'Procurement Tracking', to: '/procurement/tracking' }
    ]
  },
  {
    name: 'Daily Site Operations',
    icon: Wrench,
    submenus: [
      { name: 'Daily Work Report', to: '/operations/dpr' },
      { name: 'Work Completion Entry', to: '/operations/completion' },
      { name: 'Progress Measurements', to: '/operations/measurements' },
      { name: 'Manpower Usage', to: '/operations/manpower' },
      { name: 'Equipment Usage', to: '/operations/equipment' },
      { name: 'Material Usage', to: '/operations/material' },
      { name: 'Delays & Issues', to: '/operations/issues' },
      { name: 'Site Photos', to: '/operations/photos' },
      { name: 'Daily Report Approval', to: '/operations/approval' },
      { name: 'Daily Progress History', to: '/operations/history' }
    ]
  },
  {
    name: 'Subcontract Management',
    icon: Handshake,
    submenus: [
      { name: 'Subcontractors', to: '/subcontracts/list' },
      { name: 'Work Orders', to: '/subcontracts/orders' },
      { name: 'Work Order Approval', to: '/subcontracts/order-approval' },
      { name: 'Work Measurements', to: '/subcontracts/measurements' },
      { name: 'Measurement Certificates', to: '/subcontracts/certificates' },
      { name: 'RA Bills', to: '/subcontracts/ra-bills' },
      { name: 'Bill Approval', to: '/subcontracts/bill-approval' },
      { name: 'Subcontractor Payments', to: '/subcontracts/payments' },
      { name: 'Work Completion', to: '/subcontracts/completion' },
      { name: 'Retention Register', to: '/subcontracts/retention' },
      { name: 'Subcontract Reports', to: '/subcontracts/reports' }
    ]
  },
  {
    name: 'Client Billing & Receivables',
    icon: Receipt,
    submenus: [
      { name: 'Client Contracts', to: '/billing/contracts' },
      { name: 'Contract Value Register', to: '/billing/value' },
      { name: 'Client Advances', to: '/billing/advances' },
      { name: 'Advance Approval', to: '/billing/advance-approval' },
      { name: 'Client Invoice Register', to: '/billing/invoices' },
      { name: 'Progress Billing', to: '/billing/progress' },
      { name: 'Receipt Register', to: '/billing/receipts' },
      { name: 'Receipt Allocation', to: '/billing/allocation' },
      { name: 'Outstanding Receivables', to: '/billing/outstanding' },
      { name: 'Retention Receivables', to: '/billing/retention' },
      { name: 'Client Statement', to: '/billing/statement' }
    ]
  },
  {
    name: 'Finance & Cost Control',
    icon: Wallet,
    submenus: [
      { name: 'Project Cost Summary', to: '/finance/cost-summary' },
      { name: 'Budget vs Actual', to: '/finance/budget-vs-actual' },
      { name: 'Material Costs', to: '/finance/material-costs' },
      { name: 'Labour Costs', to: '/finance/labour-costs' },
      { name: 'Subcontract Costs', to: '/finance/subcontract-costs' },
      { name: 'Equipment Costs', to: '/finance/equipment-costs' },
      { name: 'Other Expenses', to: '/finance/expenses' },
      { name: 'Income Register', to: '/finance/income' },
      { name: 'Expense Register', to: '/finance/expense-register' },
      { name: 'Vendor Payables', to: '/finance/payables' },
      { name: 'Payment Register', to: '/finance/payment-register' },
      { name: 'Project Profitability', to: '/finance/profitability' },
      { name: 'Cash Flow', to: '/finance/cash-flow' }
    ]
  },
  {
    name: 'Reports & Analytics',
    icon: LineChart,
    submenus: [
      { name: 'Project Progress Report', to: '/reports/progress' },
      { name: 'BOQ Progress Report', to: '/reports/boq-progress' },
      { name: 'Budget vs Actual Report', to: '/reports/budget-vs-actual' },
      { name: 'Material Consumption Report', to: '/reports/material-consumption' },
      { name: 'Material Shortage Report', to: '/reports/material-shortage' },
      { name: 'Labour Deployment Report', to: '/reports/labour-deployment' },
      { name: 'Labour Cost Report', to: '/reports/labour-cost' },
      { name: 'Subcontractor Report', to: '/reports/subcontractor' },
      { name: 'Client Receivable Report', to: '/reports/receivable' },
      { name: 'Vendor Payable Report', to: '/reports/payable' },
      { name: 'Project Profitability Report', to: '/reports/profitability' },
      { name: 'Daily Site Report', to: '/reports/daily-site' },
      { name: 'Management Summary', to: '/reports/management-summary' }
    ]
  },
  { isDivider: true, id: 'div-utilities' },
  { isSection: true, name: 'Utilities' },
  {
    name: 'Communication',
    icon: MessageSquare,
    submenus: [
      { name: 'Project Messages', to: '/communication/project-messages' },
      { name: 'Client Updates', to: '/communication/client-updates' },
      { name: 'Document Sharing', to: '/communication/document-sharing' },
      { name: 'Approval Requests', to: '/communication/approval-requests' },
      { name: 'WhatsApp History', to: '/communication/whatsapp-history' },
      { name: 'Email History', to: '/communication/email-history' }
    ]
  },
  {
    name: 'Client Portal',
    icon: Globe,
    submenus: [
      { name: 'Client Users', to: '/client-portal/users' },
      { name: 'Portal Access', to: '/client-portal/access' },
      { name: 'Shared Projects', to: '/client-portal/shared-projects' },
      { name: 'Shared Documents', to: '/client-portal/shared-documents' },
      { name: 'Client Approvals', to: '/client-portal/approvals' },
      { name: 'Client Communications', to: '/client-portal/communications' }
    ]
  },
  { isDivider: true, id: 'div-masters' },
  { isSection: true, name: 'Masters' },
  {
    name: 'Project Masters',
    icon: FolderCog,
    submenus: [
      { name: 'Clients', to: '/masters/clients' },
      { name: 'Project Types', to: '/masters/project-types' },
      { name: 'Project Statuses', to: '/masters/project-statuses' },
      { name: 'Financial Years', to: '/masters/financial-years' },
      { name: 'Work Categories', to: '/masters/work-categories' },
      { name: 'Units', to: '/masters/project-units' }
    ]
  },
  {
    name: 'Labour Masters',
    icon: UserCog,
    submenus: [
      { name: 'Labour Types', to: '/masters/labour-types' },
      { name: 'Labour Categories', to: '/masters/labour-categories' },
      { name: 'Trades', to: '/masters/trades' },
      { name: 'Wage Rates', to: '/masters/wage-rates' },
      { name: 'Crews', to: '/masters/crews' }
    ]
  },
  {
    name: 'Material Masters',
    icon: Boxes,
    submenus: [
      { name: 'Material Categories', to: '/masters/material-categories' },
      { name: 'Materials', to: '/masters/materials' },
      { name: 'Brands', to: '/masters/brands' },
      { name: 'Units', to: '/masters/material-units' },
      { name: 'Warehouses', to: '/masters/warehouses' }
    ]
  },
  {
    name: 'Procurement Masters',
    icon: Store,
    submenus: [
      { name: 'Vendors', to: '/masters/vendors' },
      { name: 'Payment Terms', to: '/masters/payment-terms' },
      { name: 'Tax Rates', to: '/masters/tax-rates' }
    ]
  },
  {
    name: 'Finance Masters',
    icon: Landmark,
    submenus: [
      { name: 'Expense Categories', to: '/masters/expense-categories' },
      { name: 'Income Categories', to: '/masters/income-categories' },
      { name: 'Banks', to: '/masters/banks' },
      { name: 'Accounts', to: '/masters/accounts' },
      { name: 'Cost Heads', to: '/masters/cost-heads' }
    ]
  },
  { isDivider: true, id: 'div-administration' },
  { isSection: true, name: 'Administration' },
  {
    name: 'Administration',
    icon: Settings,
    submenus: [
      { name: 'Companies', to: '/administration/companies' },
      { name: 'Branches', to: '/administration/branches' },
      { name: 'Users', to: '/administration/users' },
      { name: 'Roles & Permissions', to: '/administration/roles-permissions' },
      { name: 'Approval Workflows', to: '/administration/approval-workflows' },
      { name: 'Numbering Settings', to: '/administration/numbering-settings' },
      { name: 'Notification Settings', to: '/administration/notification-settings' },
      { name: 'Email Settings', to: '/administration/email-settings' },
      { name: 'WhatsApp Settings', to: '/administration/whatsapp-settings' },
      { name: 'Audit Logs', to: '/administration/audit-logs' },
      { name: 'System Settings', to: '/administration/system-settings' }
    ]
  }
];

function NavItem({ item, isOpen, onToggle, onCloseMobile }) {
  const location = useLocation();
  const hasSubmenu = item.submenus && item.submenus.length > 0;

  // Check if any submenu is active to keep the parent highlighted/expanded
  const isSubmenuActive = hasSubmenu && item.submenus.some(sub => location.pathname.startsWith(sub.to));
  const isActive = location.pathname === item.to || isSubmenuActive;

  if (!hasSubmenu) {
    return (
      <NavLink
        to={item.to}
        onClick={onCloseMobile}
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
        onClick={onToggle}
        className={clsx(
          'flex items-center justify-between px-2 h-10 rounded-sm font-medium transition-colors text-[13px] w-full flex-shrink-0',
          isActive
            ? 'bg-primary text-white'
            : 'text-[#C8D1DC] hover:bg-white/5 hover:text-white'
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <item.icon className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">{item.name}</span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4 opacity-50 flex-shrink-0 ml-1" /> : <ChevronRight className="w-4 h-4 opacity-50 flex-shrink-0 ml-1" />}
      </button>

      {isOpen && (
        <div className="flex flex-col gap-0.5 mt-0.5 pl-8 pr-1 flex-shrink-0">
          {item.submenus.map((sub) => (
            <NavLink
              key={sub.name}
              to={sub.to}
              onClick={onCloseMobile}
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

export function Sidebar({ isMobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Single source of truth for the currently expanded accordion parent
  const [openMenu, setOpenMenu] = useState(() => {
    const activeItem = NAVIGATION.find(item => 
      item.submenus && item.submenus.some(sub => location.pathname.startsWith(sub.to))
    );
    return activeItem ? activeItem.name : null;
  });

  // Sync open menu with current route changes
  useEffect(() => {
    const activeItem = NAVIGATION.find(item => 
      item.submenus && item.submenus.some(sub => location.pathname.startsWith(sub.to))
    );
    if (activeItem) {
      setOpenMenu(activeItem.name);
    } else {
      setOpenMenu(null);
    }
  }, [location.pathname]);

  const handleToggleMenu = (menuName) => {
    setOpenMenu(prev => prev === menuName ? null : menuName);
  };

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
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={clsx(
          "bg-secondary flex flex-col h-full border-r border-[rgba(255,255,255,0.1)] flex-shrink-0 z-50 transition-transform duration-300 w-[230px]",
          "fixed inset-y-0 left-0 lg:static lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-[rgba(255,255,255,0.1)] flex-shrink-0">
          <span className="text-white font-bold text-[18px] tracking-tight">CIVIL DESK</span>
      </div>

      {/* Navigation */}
      {/* Using standard webkit scrollbar hiding via custom class to remove visible scrollbar but keep scrollability */}
      <nav className="flex-1 min-h-0 overflow-y-auto py-3 px-2 flex flex-col gap-0.5 scrollbar-hide">
        {NAVIGATION.map((item, index) => {
          if (item.isDivider) {
            return <div key={item.id || `div-${index}`} className="h-px bg-[rgba(255,255,255,0.1)] my-2 mx-2 flex-shrink-0" />;
          }
          if (item.isSection) {
            return (
              <div key={`sec-${index}`} className="px-2 pt-3 pb-1 flex-shrink-0">
                <span className="text-[10px] font-semibold text-[#C8D1DC]/50 uppercase tracking-wider">
                  {item.name}
                </span>
              </div>
            );
          }
          return (
            <NavItem 
              key={item.name} 
              item={item} 
              isOpen={openMenu === item.name}
              onToggle={() => handleToggleMenu(item.name)}
              onCloseMobile={onCloseMobile}
            />
          );
        })}
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
    </>
  );
}

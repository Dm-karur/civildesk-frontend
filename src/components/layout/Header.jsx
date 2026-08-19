import { Menu, Search, Bell, Building, ChevronDown } from 'lucide-react';
import { Select } from '../ui/Select';
import { useAuth } from '../../features/auth/context/AuthContext';

const SITE_OPTIONS = [
  { label: 'All Sites (Acme Builders)', value: 'all' },
  { label: 'Metro Station Construction', value: 'site-1' },
  { label: 'Commercial Complex', value: 'site-2' },
  { label: 'Residential Tower', value: 'site-3' },
  { label: 'Highway Project Phase 1', value: 'site-4' },
];

export function Header({ selectedSite, onSiteChange, onMenuClick }) {
  const { user, logout } = useAuth();
  
  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-text-secondary hover:text-text-primary hover:bg-surface-muted rounded-sm transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb / Context Placeholder */}
        <div className="hidden md:flex items-center gap-2 text-sm">
          <span className="text-text-secondary">Civil Desk</span>
          <span className="text-text-muted">/</span>
          <span className="text-text-primary font-medium">Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-placeholder" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 pl-9 pr-3 rounded-sm border border-border bg-background text-sm focus:outline-none focus:border-focus focus:ring-1 focus:ring-focus transition-all"
          />
        </div>

        {/* Site Selector Dropdown */}
        <div className="hidden sm:block w-[260px]">
          <Select 
            options={SITE_OPTIONS}
            value={selectedSite}
            onChange={onSiteChange}
            leftIcon={<Building />}
            dropdownWidth="w-[280px]"
          />
        </div>

        {/* Notifications */}
        <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-muted rounded-sm transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error"></span>
        </button>


      </div>
    </header>
  );
}

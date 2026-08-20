import { Filter, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { SearchField } from '../../../components/composite/SearchField';

export function ProjectTypesFilterBar({ 
  searchQuery, 
  onSearchChange, 
  statusFilter, 
  onStatusChange, 
  billingFilter, 
  onBillingChange,
  onAddType 
}) {
  const STATUS_OPTIONS = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const BILLING_OPTIONS = [
    { value: 'all', label: 'All Billing Methods' },
    { value: '1', label: 'Item Rate / BOQ' },
    { value: '2', label: 'Lump Sum' },
    { value: '3', label: 'Cost Plus' },
    { value: '4', label: 'Time & Material' },
    { value: '5', label: 'Milestone Based' }
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 mb-2.5">
      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
        <div className="w-full sm:w-[240px]">
          <SearchField 
            placeholder="Search code, name, description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Select
          className="w-full sm:w-[130px]"
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(val) => onStatusChange(val)}
        />
        
        <Select
          className="w-full sm:w-[170px]"
          options={BILLING_OPTIONS}
          value={billingFilter}
          onChange={(val) => onBillingChange(val)}
        />
      </div>
      
      <div className="flex items-center gap-2 w-full lg:w-auto justify-end mt-1 lg:mt-0">
        <Button variant="outline" className="h-9 px-3 text-[13px]" leftIcon={<Filter className="w-3.5 h-3.5" />}>
          Filter
        </Button>
        <Button 
          variant="primary" 
          className="h-9 px-3 text-[13px]" 
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={onAddType}
        >
          Add Project Type
        </Button>
      </div>
    </div>
  );
}

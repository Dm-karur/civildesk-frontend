import { Filter, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { SearchField } from '../../../components/composite/SearchField';

export function FinancialYearsFilterBar({ 
  searchQuery, 
  onSearchChange, 
  statusFilter, 
  onStatusChange, 
  currentFilter, 
  onCurrentFilterChange,
  onAddYear 
}) {
  const STATUS_OPTIONS = [
    { value: 'all', label: 'All Status' },
    { value: '1', label: 'Open' },
    { value: '2', label: 'Closed' },
    { value: '3', label: 'Locked' },
    { value: '4', label: 'Future' }
  ];

  const CURRENT_OPTIONS = [
    { value: 'all', label: 'All Financial Years' },
    { value: 'current', label: 'Current FY Only' },
    { value: 'other', label: 'Past / Future FY' }
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 mb-2.5">
      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
        <div className="w-full sm:w-[240px]">
          <SearchField 
            placeholder="Search year code, name, dates..."
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
          options={CURRENT_OPTIONS}
          value={currentFilter}
          onChange={(val) => onCurrentFilterChange(val)}
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
          onClick={onAddYear}
        >
          Add Financial Year
        </Button>
      </div>
    </div>
  );
}

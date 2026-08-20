import { Filter, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { SearchField } from '../../../components/composite/SearchField';

export function WorkCategoriesFilterBar({ 
  searchQuery, 
  onSearchChange, 
  statusFilter, 
  onStatusChange, 
  stageFilter, 
  onStageChange,
  onAddCategory 
}) {
  const STATUS_OPTIONS = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const STAGE_OPTIONS = [
    { value: 'all', label: 'All Work Stages' },
    { value: '1', label: 'Substructure & Excavation' },
    { value: '2', label: 'Foundation & Plinth' },
    { value: '3', label: 'Superstructure & RCC' },
    { value: '4', label: 'Masonry & Plastering' },
    { value: '5', label: 'MEP (Electrical/Plumbing)' },
    { value: '6', label: 'Flooring & Tiling' },
    { value: '7', label: 'Finishing & Painting' },
    { value: '8', label: 'General Civil' },
    { value: '9', label: 'External Works' }
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 mb-2.5">
      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
        <div className="w-full sm:w-[240px]">
          <SearchField 
            placeholder="Search code, category name, scope..."
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
          className="w-full sm:w-[190px]"
          options={STAGE_OPTIONS}
          value={stageFilter}
          onChange={(val) => onStageChange(val)}
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
          onClick={onAddCategory}
        >
          Add Work Category
        </Button>
      </div>
    </div>
  );
}

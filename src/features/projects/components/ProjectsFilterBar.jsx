import { Filter, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { SearchField } from '../../../components/composite/SearchField';

export function ProjectsFilterBar() {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-4">
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0">
        <div className="w-full sm:w-[250px] flex-shrink-0">
          <SearchField 
            placeholder="Search projects by name or code..."
            onChange={() => {}}
          />
        </div>
        
        <Select
          className="w-full sm:w-[150px] flex-shrink-0"
          options={[{ value: 'all', label: 'All Clients' }]}
          value="all"
          onChange={() => {}}
        />
        
        <Select
          className="w-full sm:w-[150px] flex-shrink-0"
          options={[{ value: 'all', label: 'All Status' }]}
          value="all"
          onChange={() => {}}
        />
        
        <Select
          className="w-full sm:w-[150px] flex-shrink-0"
          options={[{ value: 'all', label: 'All Types' }]}
          value="all"
          onChange={() => {}}
        />
        
        <Select
          className="w-full sm:w-[180px] flex-shrink-0"
          options={[{ value: 'all', label: 'All Financial Years' }]}
          value="all"
          onChange={() => {}}
        />
      </div>
      
      <div className="flex items-center gap-3 w-full xl:w-auto justify-end flex-shrink-0">
        <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
          Filter
        </Button>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Add Project
        </Button>
      </div>
    </div>
  );
}

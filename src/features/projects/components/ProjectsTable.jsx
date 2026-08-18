import { Eye, Edit, MoreVertical } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/composite/StatusBadge';
import { DataTableContainer } from '../../../components/composite/DataTableContainer';
import { Pagination } from '../../../components/composite/Pagination';
import { mockProjects } from '../data/mockData';

export function ProjectsTable() {
  const getStatusType = (status) => {
    switch (status) {
      case 'In Progress': return 'success';
      case 'On Hold': return 'warning';
      case 'Not Started': return 'neutral';
      default: return 'neutral';
    }
  };

  const renderPagination = () => (
    <Pagination 
      currentPage={1}
      totalPages={3}
      totalItems={24}
      itemsPerPage={10}
      onPageChange={() => {}}
      onItemsPerPageChange={() => {}}
    />
  );

  return (
    <DataTableContainer pagination={renderPagination()}>
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-surface-muted text-text-secondary text-xs uppercase font-medium border-b border-border">
          <tr>
            <th className="px-4 py-3 w-16">#</th>
            <th className="px-4 py-3">Project Code</th>
            <th className="px-4 py-3">Project Name</th>
            <th className="px-4 py-3">Client</th>
            <th className="px-4 py-3">Project Type</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Start Date</th>
            <th className="px-4 py-3">End Date</th>
            <th className="px-4 py-3 text-right">Budget (₹)</th>
            <th className="px-4 py-3 text-center w-32">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {mockProjects.map((project, index) => (
            <tr key={project.id} className="hover:bg-surface-muted/50 transition-colors group">
              <td className="px-4 py-3 font-medium text-text-primary">{index + 1}</td>
              <td className="px-4 py-3 text-text-secondary">{project.code}</td>
              <td className="px-4 py-3 font-medium text-text-primary">{project.name}</td>
              <td className="px-4 py-3 text-text-secondary">{project.client}</td>
              <td className="px-4 py-3 text-text-secondary">{project.type}</td>
              <td className="px-4 py-3">
                <StatusBadge 
                  status={getStatusType(project.status)}
                  text={project.status}
                />
              </td>
              <td className="px-4 py-3 text-text-secondary">{project.startDate}</td>
              <td className="px-4 py-3 text-text-secondary">{project.endDate}</td>
              <td className="px-4 py-3 text-right text-text-secondary">{project.budget}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View">
                    <Eye className="w-4 h-4 text-text-secondary hover:text-primary" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit">
                    <Edit className="w-4 h-4 text-text-secondary hover:text-primary" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="More">
                    <MoreVertical className="w-4 h-4 text-text-secondary" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DataTableContainer>
  );
}

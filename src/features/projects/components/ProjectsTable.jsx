import { Eye, Edit, MoreVertical, PlayCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
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
      <table className="w-full text-left text-[12px] whitespace-nowrap table-fixed">
        <thead className="bg-surface-muted text-text-secondary text-[11px] uppercase font-semibold border-b border-border tracking-wider">
          <tr>
            <th className="px-2 py-1.5 w-10">#</th>
            <th className="px-2 py-1.5 w-24">Pro-Code</th>
            <th className="px-2 py-1.5 w-48">Project Name</th>
            <th className="px-2 py-1.5 w-36">Client</th>
            <th className="px-2 py-1.5 w-32">Project Type</th>
            <th className="px-2 py-1.5 w-28">Status</th>
            <th className="px-2 py-1.5 w-32">Timeline</th>
            <th className="px-2 py-1.5 text-right w-28">Budget (₹)</th>
            <th className="px-2 py-1.5 text-center w-24">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {mockProjects.map((project, index) => (
            <tr key={project.id} className="hover:bg-surface-muted/30 transition-colors group">
              <td className="px-2 py-1 font-medium text-text-primary">{index + 1}</td>
              <td className="px-2 py-1 text-text-secondary">{project.code}</td>
              <td className="px-2 py-1 font-medium text-text-primary truncate" title={project.name}>{project.name}</td>
              <td className="px-2 py-1 text-text-secondary truncate" title={project.client}>{project.client}</td>
              <td className="px-2 py-1 text-text-secondary truncate">{project.type}</td>
              <td className="px-2 py-1">
                <Badge 
                  variant={getStatusType(project.status)}
                  className="text-[9px] font-bold uppercase tracking-wider h-5 px-1.5 inline-flex items-center gap-1 leading-none"
                >
                  {project.status === 'In Progress' && <PlayCircle className="w-3 h-3" />}
                  {project.status === 'On Hold' && <AlertCircle className="w-3 h-3" />}
                  {project.status === 'Not Started' && <Clock className="w-3 h-3" />}
                  {project.status}
                </Badge>
              </td>
              <td className="px-2 py-1 text-text-secondary">
                <div className="flex flex-col text-[11px] leading-tight">
                  <span>{project.startDate}</span>
                  <span className="text-text-muted opacity-70">to {project.endDate}</span>
                </div>
              </td>
              <td className="px-2 py-1 text-right text-text-secondary">{project.budget}</td>
              <td className="px-2 py-1">
                <div className="flex items-center justify-center gap-0.5">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="View">
                    <Eye className="w-3.5 h-3.5 text-text-secondary hover:text-primary" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Edit">
                    <Edit className="w-3.5 h-3.5 text-text-secondary hover:text-primary" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="More">
                    <MoreVertical className="w-3.5 h-3.5 text-text-secondary" />
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

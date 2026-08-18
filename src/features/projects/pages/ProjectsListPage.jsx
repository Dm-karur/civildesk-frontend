import { Briefcase, Activity, CheckCircle, Clock, Building } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { PageContainer } from '../../../components/layout/PageContainer';
import { KpiCard } from '../../../components/composite/KpiCard';
import { ProjectsFilterBar } from '../components/ProjectsFilterBar';
import { ProjectsTable } from '../components/ProjectsTable';
import { projectKpis } from '../data/mockData';

export function ProjectsListPage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Project Masters' },
    { label: 'Projects' }
  ];

  return (
    <PageContainer>
      <PageHeader 
        title="Projects" 
        breadcrumbs={breadcrumbs}
      />
      
      <div className="flex flex-col gap-4">
        <ProjectsFilterBar />
        
        <ProjectsTable />
        
        {/* KPI Grid at the bottom */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mt-2">
          <KpiCard
            label="Total Projects"
            value={projectKpis.totalProjects.value}
            description={projectKpis.totalProjects.description}
            status={projectKpis.totalProjects.status}
            icon={<Briefcase className="w-5 h-5" />}
          />
          <KpiCard
            label="Total Budget"
            value={projectKpis.totalBudget.value}
            description={projectKpis.totalBudget.description}
            status={projectKpis.totalBudget.status}
            icon={<Building className="w-5 h-5" />}
          />
          <KpiCard
            label="Projects In Progress"
            value={projectKpis.inProgress.value}
            description={projectKpis.inProgress.description}
            status={projectKpis.inProgress.status}
            icon={<Activity className="w-5 h-5" />}
          />
          <KpiCard
            label="On Hold"
            value={projectKpis.onHold.value}
            description={projectKpis.onHold.description}
            status={projectKpis.onHold.status}
            icon={<Clock className="w-5 h-5" />}
          />
          <KpiCard
            label="Not Started"
            value={projectKpis.notStarted.value}
            description={projectKpis.notStarted.description}
            status={projectKpis.notStarted.status}
            icon={<Clock className="w-5 h-5" />}
          />
        </div>
      </div>
    </PageContainer>
  );
}

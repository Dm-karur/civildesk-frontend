import { useState, useEffect } from 'react';
import { Briefcase, Activity, CheckCircle, Clock, Building } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { PageContainer } from '../../../components/layout/PageContainer';
import { KpiCard } from '../../../components/composite/KpiCard';
import { ProjectsFilterBar } from '../components/ProjectsFilterBar';
import { ProjectsTable } from '../components/ProjectsTable';
import { projectsApi } from '../../../api/apiservice';

export function ProjectsListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [projectsCount, setProjectsCount] = useState({
    total: 0,
    inProgress: 0,
    onHold: 0,
    notStarted: 0,
    totalBudget: 0
  });

  useEffect(() => {
    projectsApi.list()
      .then(res => {
        const list = Array.isArray(res) ? res : (res?.data || res?.projects || []);
        if (Array.isArray(list)) {
          let budgetSum = 0;
          let inProg = 0;
          let hold = 0;
          let notStart = 0;

          list.forEach(p => {
            const b = Number(p.contract_value || p.estimated_cost || p.budget || 0);
            if (!isNaN(b)) budgetSum += b;

            const st = String(p.status_name || p.status || '').toLowerCase();
            if (st.includes('progress') || st === '1') inProg++;
            else if (st.includes('hold') || st === '2') hold++;
            else notStart++;
          });

          setProjectsCount({
            total: list.length,
            inProgress: inProg,
            onHold: hold,
            notStarted: notStart,
            totalBudget: budgetSum
          });
        }
      })
      .catch(() => {});
  }, []);

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
        <ProjectsFilterBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <ProjectsTable 
          searchQuery={searchQuery}
        />
        
        {/* KPI Grid computed directly from live database */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mt-2">
          <KpiCard
            label="Total Projects"
            value={projectsCount.total}
            description="All projects in database"
            status="neutral"
            icon={<Briefcase className="w-5 h-5" />}
          />
          <KpiCard
            label="Total Budget"
            value={`₹${projectsCount.totalBudget.toLocaleString('en-IN')}`}
            description="Combined contract values"
            status="success"
            icon={<Building className="w-5 h-5" />}
          />
          <KpiCard
            label="In Progress"
            value={projectsCount.inProgress}
            description="Active construction sites"
            status="success"
            icon={<Activity className="w-5 h-5" />}
          />
          <KpiCard
            label="On Hold"
            value={projectsCount.onHold}
            description="Temporarily suspended"
            status="warning"
            icon={<Clock className="w-5 h-5" />}
          />
          <KpiCard
            label="Not Started / Other"
            value={projectsCount.notStarted}
            description="Pending kickoff"
            status="neutral"
            icon={<Clock className="w-5 h-5" />}
          />
        </div>
      </div>
    </PageContainer>
  );
}

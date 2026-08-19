import { PageContainer, PageHeader } from '../../../components/layout';
import { BranchFilterBar } from '../components/BranchFilterBar';
import { BranchTable } from '../components/BranchTable';

export function BranchListPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Branch Master" 
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Administration', to: '/administration/branches' },
          { label: 'Branches' }
        ]}
      />
      <div className="flex flex-col h-full">
        <BranchFilterBar />
        <BranchTable />
      </div>
    </PageContainer>
  );
}

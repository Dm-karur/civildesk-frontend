import { PageContainer, PageHeader } from '../../../components/layout';
import { CompanyFilterBar } from '../components/CompanyFilterBar';
import { CompanyTable } from '../components/CompanyTable';

export function CompanyListPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Company Master" 
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Settings', to: '/settings' },
          { label: 'Company' }
        ]}
      />
      <div className="flex flex-col h-full">
        <CompanyFilterBar />
        <CompanyTable />
      </div>
    </PageContainer>
  );
}

import { useState, useEffect } from 'react';
import { Eye, Edit, MoreVertical, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { DataTableContainer } from '../../../components/composite/DataTableContainer';
import { Pagination } from '../../../components/composite/Pagination';
import { companiesApi } from '../../../api/apiservice';

export function CompanyTable() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await companiesApi.list();
        // Extract array depending on how the backend wraps data (e.g. response.data.data)
        const responseData = response?.data;
        let companiesArray = [];
        
        if (Array.isArray(responseData)) {
          companiesArray = responseData;
        } else if (responseData?.data && Array.isArray(responseData.data)) {
          companiesArray = responseData.data;
        }
        
        setCompanies(companiesArray);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const renderPagination = () => (
    <Pagination 
      currentPage={1}
      totalPages={1}
      totalItems={companies.length}
      itemsPerPage={10}
      onPageChange={() => {}}
    />
  );

  const getStatusType = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'neutral';
      default: return 'neutral';
    }
  };

  return (
    <DataTableContainer pagination={renderPagination()}>
      <table className="w-full text-left text-[12px] whitespace-nowrap table-fixed">
        <thead className="bg-surface-muted text-text-secondary text-[11px] uppercase font-semibold border-b border-border tracking-wider">
          <tr>
            <th className="px-2 py-1.5 w-12">#</th>
            <th className="px-2 py-1.5 w-48">Company Name</th>
            <th className="px-2 py-1.5 w-36">GST No.</th>
            <th className="px-2 py-1.5 w-36">PAN No.</th>
            <th className="px-2 py-1.5">Address</th>
            <th className="px-2 py-1.5 w-28">Status</th>
            <th className="px-2 py-1.5 text-center w-24">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-text-muted">Loading companies...</td>
            </tr>
          ) : companies.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-text-muted">No companies found.</td>
            </tr>
          ) : (
            companies.map((company, index) => (
              <tr key={company.id} className="hover:bg-surface-muted/30 transition-colors group">
                <td className="px-2 py-1 font-medium text-text-primary">{index + 1}</td>
                <td className="px-2 py-1 font-medium text-text-primary truncate" title={company.name}>{company.name}</td>
                <td className="px-2 py-1 text-text-secondary">{company.gst}</td>
                <td className="px-2 py-1 text-text-secondary">{company.pan}</td>
                <td className="px-2 py-1 text-text-secondary truncate" title={company.address}>{company.address}</td>
                <td className="px-2 py-1">
                  <Badge 
                    variant={getStatusType(company.status)}
                    className="text-[9px] font-bold uppercase tracking-wider h-5 px-1.5 inline-flex items-center gap-1 leading-none"
                  >
                    {company.status === 'Active' && <CheckCircle2 className="w-3 h-3" />}
                    {company.status === 'Inactive' && <XCircle className="w-3 h-3" />}
                    {company.status}
                  </Badge>
                </td>
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
            ))
          )}
        </tbody>
      </table>
    </DataTableContainer>
  );
}

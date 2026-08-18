import { useState, useEffect } from 'react';
import { Eye, Edit, MoreVertical, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { DataTableContainer } from '../../../components/composite/DataTableContainer';
import { Pagination } from '../../../components/composite/Pagination';
import { branchesApi } from '../../../api/apiservice';

export function BranchTable({ searchQuery = '' }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await branchesApi.list();
        // Extract array depending on how the backend wraps data
        const responseData = response?.data;
        let branchesArray = [];
        
        if (Array.isArray(responseData)) {
          branchesArray = responseData;
        } else if (responseData?.data && Array.isArray(responseData.data)) {
          branchesArray = responseData.data;
        }
        
        if (branchesArray.length > 0) {
          setBranches(branchesArray);
        } else {
          // Default initial branches if none returned yet
          setBranches([
            { id: 1, code: 'BR-MUM-01', name: 'Mumbai Head Office', company: 'CivilDesk Infrastructure Ltd.', location: 'Nariman Point, Mumbai', phone: '+91 22 6123 4567', status: 'Active' },
            { id: 2, code: 'BR-PUN-02', name: 'Pune Regional Office', company: 'CivilDesk Infrastructure Ltd.', location: 'Baner, Pune', phone: '+91 20 4123 8901', status: 'Active' },
            { id: 3, code: 'BR-BLR-03', name: 'Bangalore Tech Park Branch', company: 'CivilDesk Infrastructure Ltd.', location: 'Whitefield, Bangalore', phone: '+91 80 5123 7890', status: 'Active' },
            { id: 4, code: 'BR-DEL-04', name: 'Delhi NCR Site Office', company: 'CivilDesk Infrastructure Ltd.', location: 'Sector 62, Noida', phone: '+91 120 456 1234', status: 'Inactive' },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const filteredBranches = branches.filter((branch) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (branch.name && branch.name.toLowerCase().includes(query)) ||
      (branch.code && branch.code.toLowerCase().includes(query)) ||
      (branch.location && branch.location.toLowerCase().includes(query))
    );
  });

  const renderPagination = () => (
    <Pagination 
      currentPage={1}
      totalPages={1}
      totalItems={filteredBranches.length}
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
            <th className="px-2 py-1.5 w-32">Branch Code</th>
            <th className="px-2 py-1.5 w-48">Branch Name</th>
            <th className="px-2 py-1.5 w-48">Company</th>
            <th className="px-2 py-1.5">Location</th>
            <th className="px-2 py-1.5 w-28">Status</th>
            <th className="px-2 py-1.5 text-center w-24">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-text-muted">Loading branches...</td>
            </tr>
          ) : filteredBranches.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-text-muted">No branches found.</td>
            </tr>
          ) : (
            filteredBranches.map((branch, index) => (
              <tr key={branch.id} className="hover:bg-surface-muted/30 transition-colors group">
                <td className="px-2 py-1 font-medium text-text-primary">{index + 1}</td>
                <td className="px-2 py-1 font-medium text-text-primary">{branch.code}</td>
                <td className="px-2 py-1 text-text-secondary truncate" title={branch.name}>{branch.name}</td>
                <td className="px-2 py-1 text-text-secondary truncate" title={branch.company}>{branch.company}</td>
                <td className="px-2 py-1 text-text-secondary truncate" title={branch.location}>{branch.location}</td>
                <td className="px-2 py-1">
                  <Badge 
                    variant={getStatusType(branch.status)}
                    className="text-[9px] font-bold uppercase tracking-wider h-5 px-1.5 inline-flex items-center gap-1 leading-none"
                  >
                    {branch.status === 'Active' && <CheckCircle2 className="w-3 h-3" />}
                    {branch.status === 'Inactive' && <XCircle className="w-3 h-3" />}
                    {branch.status}
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

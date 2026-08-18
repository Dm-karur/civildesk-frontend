import { useState, useEffect } from 'react';
import { 
  Eye, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Crown,
  FileText,
  X
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { DataTableContainer } from '../../../components/composite/DataTableContainer';
import { Pagination } from '../../../components/composite/Pagination';
import { branchesApi } from '../../../api/apiservice';

export function BranchTable({ searchQuery = '' }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const response = await branchesApi.list();
        const responseData = response?.data;
        let list = [];
        
        if (Array.isArray(responseData)) {
          list = responseData;
        } else if (responseData?.data && Array.isArray(responseData.data)) {
          list = responseData.data;
        }
        
        if (list.length > 0) {
          setBranches(list);
        } else {
          // Default schema mock if none returned from live DB
          setBranches([
            {
              id: 1,
              branch_code: 'BR-MUM-01',
              branch_name: 'Mumbai Head Office & Operations',
              gstin: '27AABCU9603R1ZM',
              email: 'mumbai.branch@civildesk.com',
              phone: '+91 22 6123 4567',
              address_line1: 'Nariman Bhavan, 12th Floor',
              city: 'Mumbai',
              state_name: 'Maharashtra',
              postal_code: '400021',
              is_head_office: 1,
              is_active: 1
            },
            {
              id: 2,
              branch_code: 'BR-PUN-02',
              branch_name: 'Pune Regional Construction Branch',
              gstin: '27AABCU9603R2ZN',
              email: 'pune.branch@civildesk.com',
              phone: '+91 20 4123 8901',
              address_line1: 'Baner High Street, Sector 3',
              city: 'Pune',
              state_name: 'Maharashtra',
              postal_code: '411045',
              is_head_office: 0,
              is_active: 1
            },
            {
              id: 3,
              branch_code: 'BR-BLR-03',
              branch_name: 'Bangalore Metro Site Office',
              gstin: '29AABCU9603R1ZL',
              email: 'bangalore.site@civildesk.com',
              phone: '+91 80 5123 7890',
              address_line1: 'Whitefield Main Road, Opp Metro Station',
              city: 'Bengaluru',
              state_name: 'Karnataka',
              postal_code: '560066',
              is_head_office: 0,
              is_active: 1
            }
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
    const q = searchQuery.toLowerCase();
    return (
      (branch.branch_name && branch.branch_name.toLowerCase().includes(q)) ||
      (branch.branch_code && branch.branch_code.toLowerCase().includes(q)) ||
      (branch.city && branch.city.toLowerCase().includes(q)) ||
      (branch.gstin && branch.gstin.toLowerCase().includes(q))
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

  return (
    <>
      <DataTableContainer pagination={renderPagination()}>
        <table className="w-full text-left text-[12px] whitespace-nowrap table-fixed">
          <thead className="bg-surface-muted text-text-secondary text-[10px] uppercase font-bold border-b border-border tracking-wider">
            <tr>
              <th className="px-2 py-1.5 w-10 text-center">#</th>
              <th className="px-2 py-1.5 w-28">Branch Code</th>
              <th className="px-2 py-1.5 w-52">Branch Name</th>
              <th className="px-2 py-1.5 w-32">GSTIN</th>
              <th className="px-2 py-1.5 w-36">City & State</th>
              <th className="px-2 py-1.5 w-32">Phone</th>
              <th className="px-2 py-1.5 w-24 text-center">Type</th>
              <th className="px-2 py-1.5 w-20 text-center">Status</th>
              <th className="px-2 py-1.5 text-center w-16">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-4 text-text-muted text-[11px]">
                  Loading branches from database...
                </td>
              </tr>
            ) : filteredBranches.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4 text-text-muted text-[11px]">
                  No branches found.
                </td>
              </tr>
            ) : (
              filteredBranches.map((branch, index) => {
                const isHQ = branch.is_head_office === 1 || branch.is_head_office === '1';
                const isActive = branch.is_active === 1 || branch.is_active === '1' || branch.status === 'Active';
                
                return (
                  <tr key={branch.id || index} className="hover:bg-surface-muted/30 transition-colors group">
                    <td className="px-2 py-1 text-center font-medium text-text-secondary text-[11px]">{index + 1}</td>
                    <td className="px-2 py-1 font-mono font-semibold text-text-primary text-[11px]">{branch.branch_code}</td>
                    <td className="px-2 py-1 font-medium text-text-primary truncate" title={branch.branch_name}>
                      <div className="flex items-center gap-1.5">
                        {isHQ && <Crown className="w-3 h-3 text-amber-500 shrink-0" title="Head Office" />}
                        <span className="truncate">{branch.branch_name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-1 font-mono text-text-secondary text-[11px]">{branch.gstin || '—'}</td>
                    <td className="px-2 py-1 text-text-secondary truncate text-[11px]" title={`${branch.city || ''}, ${branch.state_name || ''}`}>
                      {branch.city ? `${branch.city}, ${branch.state_name || ''}` : branch.location || '—'}
                    </td>
                    <td className="px-2 py-1 text-text-secondary text-[11px]">{branch.phone || '—'}</td>
                    <td className="px-2 py-1 text-center">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isHQ ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-surface-muted text-text-secondary border border-border'}`}>
                        {isHQ ? 'HQ' : 'Branch'}
                      </span>
                    </td>
                    <td className="px-2 py-1 text-center">
                      <Badge 
                        variant={isActive ? 'success' : 'neutral'}
                        className="text-[8px] font-bold uppercase tracking-wider h-4 px-1 inline-flex items-center gap-0.5 leading-none"
                      >
                        {isActive ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                        {isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-2 py-1 text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedBranch(branch)}
                        className="h-5 w-5 p-0 mx-auto text-text-secondary hover:text-primary" 
                        title="View Branch Details"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </DataTableContainer>

      {/* Branch Detail Modal */}
      {selectedBranch && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-sm shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-border bg-surface-muted/50">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-primary" />
                <h3 className="text-[12px] font-bold text-text-primary">{selectedBranch.branch_name}</h3>
              </div>
              <button 
                onClick={() => setSelectedBranch(null)}
                className="text-text-secondary hover:text-text-primary p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 text-[11px] space-y-2.5">
              <div className="grid grid-cols-2 gap-2 bg-surface-muted/30 p-2 rounded-xs border border-border/60">
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-secondary block">Branch Code</span>
                  <span className="font-mono font-semibold text-text-primary">{selectedBranch.branch_code}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-secondary block">GSTIN</span>
                  <span className="font-mono font-semibold text-text-primary">{selectedBranch.gstin || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-secondary block">Email</span>
                  <span className="font-medium text-text-primary">{selectedBranch.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-secondary block">Phone</span>
                  <span className="font-medium text-text-primary">{selectedBranch.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="bg-surface-muted/30 p-2 rounded-xs border border-border/60">
                <span className="text-[9px] uppercase font-bold text-text-secondary block mb-0.5">Address</span>
                <p className="text-text-primary font-medium">
                  {[
                    selectedBranch.address_line1,
                    selectedBranch.address_line2,
                    selectedBranch.city,
                    selectedBranch.district,
                    selectedBranch.state_name,
                    selectedBranch.postal_code,
                    selectedBranch.country_code
                  ].filter(Boolean).join(', ') || 'N/A'}
                </p>
              </div>

              <div className="flex justify-end pt-1">
                <Button size="sm" variant="outline" className="h-6 text-[11px]" onClick={() => setSelectedBranch(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

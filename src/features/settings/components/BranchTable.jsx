import { useState, useEffect } from 'react';
import { 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Building, 
  Crown,
  X
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { DataTableContainer } from '../../../components/composite/DataTableContainer';
import { Pagination } from '../../../components/composite/Pagination';
import { branchesApi } from '../../../api/apiservice';

function extractBranchList(response) {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.branches)) return response.branches;
  if (Array.isArray(response.data?.branches)) return response.data.branches;
  if (Array.isArray(response.data?.data)) return response.data.data;
  if (response.data && typeof response.data === 'object' && (response.data.id || response.data.branch_name || response.data.name)) {
    return [response.data];
  }
  if (response && typeof response === 'object' && (response.id || response.branch_name || response.name)) {
    return [response];
  }
  return [];
}

export function BranchTable({ searchQuery = '' }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const response = await branchesApi.list();
        console.log('[BranchTable] API response:', response);
        const list = extractBranchList(response);
        setBranches(list);
      } catch (error) {
        console.error("[BranchTable] Failed to fetch branches:", error);
        setBranches([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const filteredBranches = branches.filter((branch) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const name = (branch.branch_name || branch.name || '').toLowerCase();
    const code = (branch.branch_code || branch.code || '').toLowerCase();
    const city = (branch.city || branch.location || '').toLowerCase();
    const gstin = (branch.gstin || branch.gst || '').toLowerCase();
    return name.includes(q) || code.includes(q) || city.includes(q) || gstin.includes(q);
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
                  No branches found in the database.
                </td>
              </tr>
            ) : (
              filteredBranches.map((branch, index) => {
                const branchCode = branch.branch_code || branch.code || '—';
                const branchName = branch.branch_name || branch.name || 'Branch';
                const gstin = branch.gstin || branch.gst || '—';
                const city = branch.city;
                const state = branch.state_name || branch.state;
                const locationDisplay = city ? `${city}${state ? `, ${state}` : ''}` : (branch.location || branch.address || '—');
                const phone = branch.phone || branch.contact || '—';

                const isHQ = branch.is_head_office === 1 || branch.is_head_office === '1' || branch.is_head_office === true || branch.head_office === 1;
                const isActive = branch.is_active === 1 || branch.is_active === '1' || branch.is_active === true || branch.status === 'Active' || branch.status === 1 || branch.is_active === undefined;
                
                return (
                  <tr key={branch.id || index} className="hover:bg-surface-muted/30 transition-colors group">
                    <td className="px-2 py-1 text-center font-medium text-text-secondary text-[11px]">{index + 1}</td>
                    <td className="px-2 py-1 font-mono font-semibold text-text-primary text-[11px]">{branchCode}</td>
                    <td className="px-2 py-1 font-medium text-text-primary truncate" title={branchName}>
                      <div className="flex items-center gap-1.5">
                        {isHQ && <Crown className="w-3 h-3 text-amber-500 shrink-0" title="Head Office" />}
                        <span className="truncate">{branchName}</span>
                      </div>
                    </td>
                    <td className="px-2 py-1 font-mono text-text-secondary text-[11px]">{gstin}</td>
                    <td className="px-2 py-1 text-text-secondary truncate text-[11px]" title={locationDisplay}>
                      {locationDisplay}
                    </td>
                    <td className="px-2 py-1 text-text-secondary text-[11px]">{phone}</td>
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
                <h3 className="text-[12px] font-bold text-text-primary">
                  {selectedBranch.branch_name || selectedBranch.name || 'Branch Details'}
                </h3>
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
                  <span className="font-mono font-semibold text-text-primary">
                    {selectedBranch.branch_code || selectedBranch.code || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-secondary block">GSTIN</span>
                  <span className="font-mono font-semibold text-text-primary">
                    {selectedBranch.gstin || selectedBranch.gst || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-secondary block">Email</span>
                  <span className="font-medium text-text-primary">
                    {selectedBranch.email || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-secondary block">Phone</span>
                  <span className="font-medium text-text-primary">
                    {selectedBranch.phone || selectedBranch.contact || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="bg-surface-muted/30 p-2 rounded-xs border border-border/60">
                <span className="text-[9px] uppercase font-bold text-text-secondary block mb-0.5">Address</span>
                <p className="text-text-primary font-medium">
                  {[
                    selectedBranch.address_line1 || selectedBranch.address,
                    selectedBranch.address_line2,
                    selectedBranch.city,
                    selectedBranch.district,
                    selectedBranch.state_name || selectedBranch.state,
                    selectedBranch.postal_code || selectedBranch.pincode,
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

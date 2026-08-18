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

      {/* Complete Branch Detail View Modal */}
      {selectedBranch && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-sm shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface-muted/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xs bg-primary/10 flex items-center justify-center text-primary">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[13px] font-bold text-text-primary">
                      {selectedBranch.branch_name || selectedBranch.name || 'Branch Details'}
                    </h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-surface border border-border rounded text-text-secondary font-medium">
                      {selectedBranch.branch_code || selectedBranch.code || 'N/A'}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-secondary">Branch ID: #{selectedBranch.id} • Company ID: #{selectedBranch.company_id || '1'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {(selectedBranch.is_head_office === 1 || selectedBranch.is_head_office === '1' || selectedBranch.is_head_office === true) && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1">
                    <Crown className="w-2.5 h-2.5" />
                    Head Office
                  </span>
                )}
                <Badge 
                  variant={(selectedBranch.is_active === 1 || selectedBranch.is_active === '1' || selectedBranch.is_active === true || selectedBranch.status === 'Active') ? 'success' : 'neutral'}
                  className="text-[8px] font-bold uppercase tracking-wider h-4 px-1.5 inline-flex items-center gap-0.5"
                >
                  {(selectedBranch.is_active === 1 || selectedBranch.is_active === '1' || selectedBranch.is_active === true || selectedBranch.status === 'Active') ? (
                    <CheckCircle2 className="w-2.5 h-2.5" />
                  ) : (
                    <XCircle className="w-2.5 h-2.5" />
                  )}
                  {(selectedBranch.is_active === 1 || selectedBranch.is_active === '1' || selectedBranch.is_active === true || selectedBranch.status === 'Active') ? 'Active' : 'Inactive'}
                </Badge>
                <button 
                  onClick={() => setSelectedBranch(null)}
                  className="text-text-secondary hover:text-text-primary p-1 rounded-xs hover:bg-surface"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 text-[11px] space-y-3 max-h-[80vh] overflow-y-auto">
              {/* Section 1: General & Tax Information */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1">
                  <span>General & Tax Information</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-surface-muted/30 p-2.5 rounded-xs border border-border/70">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-text-secondary block">Branch Code</span>
                    <span className="font-mono font-semibold text-text-primary text-[11px]">{selectedBranch.branch_code || selectedBranch.code || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-text-secondary block">GSTIN</span>
                    <span className="font-mono font-semibold text-text-primary text-[11px]">{selectedBranch.gstin || selectedBranch.gst || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-text-secondary block">Branch Type ID</span>
                    <span className="font-medium text-text-primary text-[11px]">{selectedBranch.branch_type_id || 'Standard'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-text-secondary block">Head Office</span>
                    <span className="font-medium text-text-primary text-[11px]">
                      {(selectedBranch.is_head_office === 1 || selectedBranch.is_head_office === '1' || selectedBranch.is_head_office === true) ? 'Yes (Headquarters)' : 'No (Branch Office)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact Information */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-surface-muted/30 p-2.5 rounded-xs border border-border/70">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-text-secondary block">Email Address</span>
                    <span className="font-medium text-text-primary text-[11px] break-all">{selectedBranch.email || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-text-secondary block">Phone Number</span>
                    <span className="font-medium text-text-primary text-[11px]">{selectedBranch.phone || selectedBranch.contact || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Detailed Address Breakdown */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                  Complete Address Breakdown
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-surface-muted/30 p-2.5 rounded-xs border border-border/70">
                  <div className="sm:col-span-2">
                    <span className="text-[9px] uppercase font-bold text-text-secondary block">Address Line 1</span>
                    <span className="font-medium text-text-primary text-[11px]">{selectedBranch.address_line1 || selectedBranch.address || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-text-secondary block">Address Line 2</span>
                    <span className="font-medium text-text-primary text-[11px]">{selectedBranch.address_line2 || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-text-secondary block">City</span>
                    <span className="font-medium text-text-primary text-[11px]">{selectedBranch.city || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-text-secondary block">District</span>
                    <span className="font-medium text-text-primary text-[11px]">{selectedBranch.district || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-text-secondary block">State</span>
                    <span className="font-medium text-text-primary text-[11px]">
                      {selectedBranch.state_name || selectedBranch.state || '—'} {selectedBranch.state_code ? `(${selectedBranch.state_code})` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-text-secondary block">Postal Code</span>
                    <span className="font-mono font-medium text-text-primary text-[11px]">{selectedBranch.postal_code || selectedBranch.pincode || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-text-secondary block">Country Code</span>
                    <span className="font-medium text-text-primary text-[11px]">{selectedBranch.country_code || 'IN'}</span>
                  </div>
                </div>
              </div>

              {/* Section 4: GPS Coordinates & System Meta */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                  GPS Coordinates & System Metadata
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-surface-muted/30 p-2.5 rounded-xs border border-border/70">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-text-secondary block">Latitude</span>
                    <span className="font-mono text-text-primary text-[11px]">{selectedBranch.latitude || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-text-secondary block">Longitude</span>
                    <span className="font-mono text-text-primary text-[11px]">{selectedBranch.longitude || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-text-secondary block">Created At</span>
                    <span className="font-mono text-text-secondary text-[11px]">{selectedBranch.created_at || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-text-secondary block">Record ID</span>
                    <span className="font-mono text-text-secondary text-[11px]">#{selectedBranch.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-border">
                <Button size="sm" variant="outline" className="h-7 text-[11px] px-3" onClick={() => setSelectedBranch(null)}>
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

import { useState, useEffect } from 'react';
import { 
  Eye, 
  Edit, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building,
  Phone,
  Mail,
  Coins
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { DataTableContainer } from '../../../components/composite/DataTableContainer';
import { Pagination } from '../../../components/composite/Pagination';
import { clientsApi } from '../../../api/apiservice';
import { ClientDetailModal } from './ClientDetailModal';

function extractClientsList(response) {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.clients)) return response.clients;
  if (Array.isArray(response.data?.clients)) return response.data.clients;
  if (Array.isArray(response.data?.data)) return response.data.data;
  if (response.data && typeof response.data === 'object' && (response.data.id || response.data.client_name || response.data.name)) {
    return [response.data];
  }
  if (response && typeof response === 'object' && (response.id || response.client_name || response.name)) {
    return [response];
  }
  return [];
}

export function ClientsTable({ searchQuery = '', statusFilter = 'all', industryFilter = 'all' }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientsApi.list();
      console.log('[ClientsTable] API response:', response);
      const list = extractClientsList(response);
      setClients(list);
    } catch (error) {
      console.error("[ClientsTable] Failed to fetch clients:", error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) => {
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const name = (client.client_name || client.name || '').toLowerCase();
      const code = (client.client_code || client.code || '').toLowerCase();
      const gstin = (client.gstin || client.gst || '').toLowerCase();
      const pan = (client.pan || '').toLowerCase();
      const email = (client.email || '').toLowerCase();
      const phone = (client.phone || client.contact || '').toLowerCase();
      const matchesSearch = name.includes(q) || code.includes(q) || gstin.includes(q) || pan.includes(q) || email.includes(q) || phone.includes(q);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter !== 'all') {
      const isActive = client.client_status_id === 1 || client.client_status_id === '1' || client.is_active === 1 || client.status === 'Active' || client.status === 1;
      if (statusFilter === 'active' && !isActive) return false;
      if (statusFilter === 'inactive' && isActive) return false;
    }

    // Industry filter
    if (industryFilter !== 'all') {
      const ind = (client.industry_type || client.industry || '').toLowerCase();
      if (!ind.includes(industryFilter.toLowerCase())) return false;
    }

    return true;
  });

  const getStatusBadge = (client) => {
    const isActive = client.client_status_id === 1 || client.client_status_id === '1' || client.is_active === 1 || client.status === 'Active' || client.status === 1 || client.client_status_id === undefined;
    
    return (
      <Badge 
        variant={isActive ? 'success' : 'neutral'}
        className="text-[9px] font-bold uppercase tracking-wider h-5 px-1.5 inline-flex items-center gap-1 leading-none"
      >
        {isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  const renderPagination = () => (
    <Pagination 
      currentPage={1}
      totalPages={Math.max(1, Math.ceil(filteredClients.length / 10))}
      totalItems={filteredClients.length}
      itemsPerPage={10}
      onPageChange={() => {}}
      onItemsPerPageChange={() => {}}
    />
  );

  return (
    <>
      <DataTableContainer pagination={renderPagination()}>
        <table className="w-full text-left text-[12px] whitespace-nowrap table-fixed">
          <thead className="bg-surface-muted text-text-secondary text-[11px] uppercase font-semibold border-b border-border tracking-wider">
            <tr>
              <th className="px-2 py-1.5 w-10 text-center">#</th>
              <th className="px-2 py-1.5 w-24">Client Code</th>
              <th className="px-2 py-1.5 w-44">Client Name</th>
              <th className="px-2 py-1.5 w-28">Industry</th>
              <th className="px-2 py-1.5 w-32">GSTIN / PAN</th>
              <th className="px-2 py-1.5 w-36">Contact Details</th>
              <th className="px-2 py-1.5 text-right w-28">Credit Limit (₹)</th>
              <th className="px-2 py-1.5 w-20 text-center">Status</th>
              <th className="px-2 py-1.5 text-center w-20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-text-muted text-[12px]">
                  Loading clients from database...
                </td>
              </tr>
            ) : filteredClients.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-text-muted text-[12px]">
                  No clients found in database.
                </td>
              </tr>
            ) : (
              filteredClients.map((client, index) => {
                const code = client.client_code || client.code || `CLT-${index + 1}`;
                const name = client.client_name || client.name || 'Unnamed Client';
                const legal = client.legal_name;
                const industry = client.industry_type || client.industry || 'General';
                const gstin = client.gstin || client.gst;
                const pan = client.pan;
                const email = client.email;
                const phone = client.phone || client.contact;
                const credit = client.credit_limit !== undefined ? Number(client.credit_limit).toLocaleString('en-IN') : '0.00';
                const terms = client.payment_terms_days !== undefined ? `${client.payment_terms_days}d` : '0d';

                return (
                  <tr key={client.id || index} className="hover:bg-surface-muted/30 transition-colors group">
                    <td className="px-2 py-1 text-center font-medium text-text-primary text-[11px]">{index + 1}</td>
                    <td className="px-2 py-1 font-mono font-semibold text-text-primary text-[11px]">{code}</td>
                    <td className="px-2 py-1 font-medium text-text-primary truncate" title={legal ? `${name} (${legal})` : name}>
                      <div className="flex flex-col leading-tight">
                        <span className="truncate">{name}</span>
                        {legal && <span className="text-[10px] text-text-muted truncate font-normal">{legal}</span>}
                      </div>
                    </td>
                    <td className="px-2 py-1 text-text-secondary truncate text-[11px]" title={industry}>
                      {industry}
                    </td>
                    <td className="px-2 py-1 text-text-secondary">
                      <div className="flex flex-col text-[10px] font-mono leading-tight">
                        <span className="truncate">{gstin || '—'}</span>
                        {pan && <span className="text-text-muted opacity-80 truncate">PAN: {pan}</span>}
                      </div>
                    </td>
                    <td className="px-2 py-1 text-text-secondary">
                      <div className="flex flex-col text-[10px] leading-tight">
                        {email && <span className="truncate text-text-primary" title={email}>{email}</span>}
                        {phone && <span className="text-text-muted truncate">{phone}</span>}
                        {!email && !phone && <span>—</span>}
                      </div>
                    </td>
                    <td className="px-2 py-1 text-right text-text-secondary">
                      <div className="flex flex-col text-[11px] leading-tight font-mono">
                        <span className="font-semibold text-text-primary">₹{credit}</span>
                        <span className="text-[9px] text-text-muted">Net {terms}</span>
                      </div>
                    </td>
                    <td className="px-2 py-1 text-center">
                      {getStatusBadge(client)}
                    </td>
                    <td className="px-2 py-1">
                      <div className="flex items-center justify-center gap-0.5">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedClient(client)}
                          className="h-6 w-6 p-0" 
                          title="View Client Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-text-secondary hover:text-primary" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0" 
                          title="Edit Client"
                        >
                          <Edit className="w-3.5 h-3.5 text-text-secondary hover:text-primary" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0" 
                          title="More Options"
                        >
                          <MoreVertical className="w-3.5 h-3.5 text-text-secondary" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </DataTableContainer>

      {/* Full Detail Modal */}
      {selectedClient && (
        <ClientDetailModal 
          client={selectedClient} 
          onClose={() => setSelectedClient(null)} 
        />
      )}
    </>
  );
}

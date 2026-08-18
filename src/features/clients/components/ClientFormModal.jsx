import { useState, useEffect } from 'react';
import { Building, Save, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { clientsApi, clientStatusesApi, clientSourcesApi } from '../../../api/apiservice';
import { toast } from '../../../components/composite/Toast';

export function ClientFormModal({ client, isOpen, onClose, onSaveSuccess }) {
  const isEditing = Boolean(client?.id);
  const [saving, setSaving] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [sources, setSources] = useState([]);

  const [formData, setFormData] = useState({
    client_code: '',
    client_name: '',
    legal_name: '',
    client_type_id: '1',
    industry_type: 'Real Estate Development',
    gst_registration_type_id: '1',
    gstin: '',
    pan: '',
    tan: '',
    email: '',
    phone: '',
    website: '',
    billing_currency: 'INR',
    payment_terms_days: 30,
    credit_limit: 0,
    tax_deduction_applicable: 0,
    client_source_id: '1',
    client_status_id: '2', // Default: Active
    notes: '',
    company_id: '1',
    branch_id: ''
  });

  useEffect(() => {
    // Fetch live statuses and sources
    const fetchMasters = async () => {
      try {
        const [statusRes, sourceRes] = await Promise.allSettled([
          clientStatusesApi.list(),
          clientSourcesApi.list()
        ]);

        if (statusRes.status === 'fulfilled') {
          const list = statusRes.value?.data || statusRes.value || [];
          if (Array.isArray(list) && list.length > 0) setStatuses(list);
          else {
            // Database schema fallback
            setStatuses([
              { id: 1, status_code: 'PROSPECT', status_name: 'Prospect' },
              { id: 2, status_code: 'ACTIVE', status_name: 'Active' },
              { id: 3, status_code: 'ON_HOLD', status_name: 'On Hold' },
              { id: 4, status_code: 'INACTIVE', status_name: 'Inactive' },
              { id: 5, status_code: 'BLACKLISTED', status_name: 'Blacklisted' }
            ]);
          }
        }

        if (sourceRes.status === 'fulfilled') {
          const list = sourceRes.value?.data || sourceRes.value || [];
          if (Array.isArray(list) && list.length > 0) setSources(list);
          else {
            setSources([
              { id: 1, source_name: 'Direct Reference' },
              { id: 2, source_name: 'Website Inquiry' },
              { id: 3, source_name: 'Exhibition / Tender' },
              { id: 4, source_name: 'Partner Channel' }
            ]);
          }
        }
      } catch (err) {
        console.error('Failed to load client masters:', err);
      }
    };
    fetchMasters();
  }, []);

  useEffect(() => {
    if (client) {
      setFormData({
        client_code: client.client_code || client.code || '',
        client_name: client.client_name || client.name || '',
        legal_name: client.legal_name || '',
        client_type_id: client.client_type_id || '1',
        industry_type: client.industry_type || client.industry || 'Real Estate Development',
        gst_registration_type_id: client.gst_registration_type_id || '1',
        gstin: client.gstin || client.gst || '',
        pan: client.pan || '',
        tan: client.tan || '',
        email: client.email || '',
        phone: client.phone || client.contact || '',
        website: client.website || '',
        billing_currency: client.billing_currency || 'INR',
        payment_terms_days: client.payment_terms_days || 30,
        credit_limit: client.credit_limit || 0,
        tax_deduction_applicable: client.tax_deduction_applicable ? 1 : 0,
        client_source_id: client.client_source_id || '1',
        client_status_id: String(client.client_status_id || '2'),
        notes: client.notes || '',
        company_id: client.company_id || '1',
        branch_id: client.branch_id || ''
      });
    } else {
      setFormData({
        client_code: '',
        client_name: '',
        legal_name: '',
        client_type_id: '1',
        industry_type: 'Real Estate Development',
        gst_registration_type_id: '1',
        gstin: '',
        pan: '',
        tan: '',
        email: '',
        phone: '',
        website: '',
        billing_currency: 'INR',
        payment_terms_days: 30,
        credit_limit: 0,
        tax_deduction_applicable: 0,
        client_source_id: '1',
        client_status_id: '2', // Active
        notes: '',
        company_id: '1',
        branch_id: ''
      });
    }
  }, [client, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEditing) {
        await clientsApi.update(client.id, formData);
        toast.success('Client updated successfully');
      } else {
        await clientsApi.create(formData);
        toast.success('Client created successfully');
      }
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to save client:', err);
      toast.error(err?.message || 'Failed to save client. Please check fields.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-sm shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-muted/60">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-primary" />
            <h3 className="text-[13px] font-bold text-text-primary">
              {isEditing ? `Edit Client: ${client.client_name || client.name}` : 'Add New Client'}
            </h3>
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 text-[11px] space-y-3.5 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Identifiers */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5">
              1. General & Business Identifiers
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">Client Code *</label>
                <input 
                  type="text"
                  name="client_code"
                  value={formData.client_code}
                  onChange={handleChange}
                  placeholder="e.g. CLI-001"
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] font-mono focus:outline-none focus:border-focus"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">Client Name *</label>
                <input 
                  type="text"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  placeholder="e.g. Greenfield Properties"
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">Legal Name</label>
                <input 
                  type="text"
                  name="legal_name"
                  value={formData.legal_name}
                  onChange={handleChange}
                  placeholder="e.g. Greenfield Properties Private Limited"
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">Industry Type</label>
                <input 
                  type="text"
                  name="industry_type"
                  value={formData.industry_type}
                  onChange={handleChange}
                  placeholder="e.g. Real Estate Development"
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Tax & Statutory Information */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5">
              2. Tax & Statutory Compliance
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">GSTIN</label>
                <input 
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  placeholder="27AABCU9603R1ZM"
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] font-mono focus:outline-none focus:border-focus"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">PAN Number</label>
                <input 
                  type="text"
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  placeholder="AABCU9603R"
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] font-mono focus:outline-none focus:border-focus"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">TAN Number</label>
                <input 
                  type="text"
                  name="tan"
                  value={formData.tan}
                  onChange={handleChange}
                  placeholder="MUMA12345B"
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] font-mono focus:outline-none focus:border-focus"
                />
              </div>
              <div className="flex items-center pt-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    name="tax_deduction_applicable"
                    checked={formData.tax_deduction_applicable === 1}
                    onChange={handleChange}
                    className="rounded-xs text-primary"
                  />
                  <span className="text-[10px] font-medium text-text-primary">TDS Applicable</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Financial & Billing Terms */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5">
              3. Financial & Billing Settings
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">Billing Currency</label>
                <select
                  name="billing_currency"
                  value={formData.billing_currency}
                  onChange={handleChange}
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="AED">AED</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">Payment Terms (Days)</label>
                <input 
                  type="number"
                  name="payment_terms_days"
                  value={formData.payment_terms_days}
                  onChange={handleChange}
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">Credit Limit (₹)</label>
                <input 
                  type="number"
                  name="credit_limit"
                  value={formData.credit_limit}
                  onChange={handleChange}
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] font-mono focus:outline-none focus:border-focus"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Contact & Web */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5">
              4. Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">Email Address</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@client.com"
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">Phone Number</label>
                <input 
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91-9876543210"
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">Website</label>
                <input 
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="www.client.com"
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Status & Sourcing */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5">
              5. Status & Lead Sourcing
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">Client Status *</label>
                <select
                  name="client_status_id"
                  value={formData.client_status_id}
                  onChange={handleChange}
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] font-medium focus:outline-none focus:border-focus"
                >
                  {statuses.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.status_name || st.name || st.status_code}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">Client Source</label>
                <select
                  name="client_source_id"
                  value={formData.client_source_id}
                  onChange={handleChange}
                  className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                >
                  {sources.map(sc => (
                    <option key={sc.id} value={sc.id}>
                      {sc.source_name || sc.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[9px] uppercase font-bold text-text-secondary mb-1">Notes / Instructions</label>
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Add any internal client notes..."
                  className="w-full p-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus resize-none"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} className="h-7 text-[11px]">
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={saving} className="h-7 text-[11px] gap-1">
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              <span>{isEditing ? 'Update Client' : 'Create Client'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

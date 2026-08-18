import { useState, useEffect } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  CreditCard, 
  Globe, 
  CheckCircle2, 
  XCircle,
  Edit,
  ShieldCheck,
  Calendar,
  Clock,
  Coins,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { companiesApi } from '../../../api/apiservice';

export function CompanyProfileCard() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({});

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const response = await companiesApi.list();
      const responseData = response?.data;
      let list = [];
      if (Array.isArray(responseData)) {
        list = responseData;
      } else if (responseData?.data && Array.isArray(responseData.data)) {
        list = responseData.data;
      }
      
      if (list.length > 0) {
        setCompany(list[0]);
      } else {
        // Default schema structure
        setCompany({
          id: 1,
          company_code: 'CD-CORP-01',
          company_name: 'CivilDesk Infrastructure Ltd.',
          legal_name: 'CivilDesk Infrastructure Technologies Private Limited',
          gstin: '27AABCU9603R1ZM',
          pan: 'AABCU9603R',
          cin: 'U72200MH2023PTC123456',
          email: 'admin@civildesk.com',
          phone: '+91 98765 43210',
          website: 'www.civildesk.com',
          address_line1: 'Plot 42, Technopark SEZ, Sector 5',
          address_line2: 'Mahape Industrial Area',
          city: 'Navi Mumbai',
          district: 'Thane',
          state_name: 'Maharashtra',
          state_code: '27',
          country_code: 'IN',
          postal_code: '400701',
          currency_code: 'INR',
          date_format: 'd-m-Y',
          timezone: 'Asia/Kolkata',
          is_active: 1
        });
      }
    } catch (error) {
      console.error('Failed to fetch company details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const handleEditOpen = () => {
    setEditForm({ ...company });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!company?.id) return;
    try {
      setSaving(true);
      await companiesApi.update(company.id, editForm);
      setCompany(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update company:', error);
      alert('Failed to update company details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-sm p-4 animate-pulse mb-3">
        <div className="h-5 bg-surface-muted rounded w-1/4 mb-3"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="h-12 bg-surface-muted rounded"></div>
          <div className="h-12 bg-surface-muted rounded"></div>
          <div className="h-12 bg-surface-muted rounded"></div>
          <div className="h-12 bg-surface-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!company) return null;

  // Format full address from schema columns
  const fullAddress = [
    company.address_line1,
    company.address_line2,
    company.city,
    company.district,
    company.state_name ? `${company.state_name} (${company.state_code || ''})` : null,
    company.postal_code,
    company.country_code
  ].filter(Boolean).join(', ');

  const isActive = company.is_active === 1 || company.is_active === '1' || company.status === 'Active';

  return (
    <>
      <div className="bg-surface border border-border rounded-sm p-3 mb-2.5 shadow-xs">
        {/* Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[13px] font-bold text-text-primary tracking-tight leading-none">
                  {company.company_name || company.name || 'Company Profile'}
                </h2>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 bg-surface-muted border border-border rounded text-text-secondary">
                  {company.company_code || company.code || 'MAIN-CORP'}
                </span>
              </div>
              <p className="text-[10px] text-text-secondary mt-0.5 font-medium">
                {company.legal_name || 'Enterprise Corporation'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge 
              variant={isActive ? 'success' : 'neutral'}
              className="text-[9px] font-bold uppercase tracking-wider h-5 px-2 inline-flex items-center gap-1 leading-none"
            >
              {isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEditOpen}
              className="h-6 text-[11px] px-2 gap-1 font-medium"
            >
              <Edit className="w-3 h-3" />
              <span>Edit Profile</span>
            </Button>
          </div>
        </div>

        {/* Database Mapped Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-1.5 text-[11px]">
          {/* GSTIN */}
          <div className="bg-surface-muted/40 border border-border/70 rounded-xs p-1.5">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1 mb-0.5">
              <FileText className="w-3 h-3 text-primary" />
              <span>GSTIN</span>
            </div>
            <p className="font-mono font-semibold text-text-primary text-[11px] truncate" title={company.gstin || 'N/A'}>
              {company.gstin || 'N/A'}
            </p>
          </div>

          {/* PAN */}
          <div className="bg-surface-muted/40 border border-border/70 rounded-xs p-1.5">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1 mb-0.5">
              <CreditCard className="w-3 h-3 text-primary" />
              <span>PAN</span>
            </div>
            <p className="font-mono font-semibold text-text-primary text-[11px] truncate" title={company.pan || 'N/A'}>
              {company.pan || 'N/A'}
            </p>
          </div>

          {/* CIN */}
          <div className="bg-surface-muted/40 border border-border/70 rounded-xs p-1.5">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1 mb-0.5">
              <ShieldCheck className="w-3 h-3 text-primary" />
              <span>CIN</span>
            </div>
            <p className="font-mono font-semibold text-text-primary text-[11px] truncate" title={company.cin || 'N/A'}>
              {company.cin || 'N/A'}
            </p>
          </div>

          {/* Email */}
          <div className="bg-surface-muted/40 border border-border/70 rounded-xs p-1.5">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1 mb-0.5">
              <Mail className="w-3 h-3 text-primary" />
              <span>Email</span>
            </div>
            <p className="font-medium text-text-primary truncate" title={company.email || 'N/A'}>
              {company.email || 'N/A'}
            </p>
          </div>

          {/* Phone */}
          <div className="bg-surface-muted/40 border border-border/70 rounded-xs p-1.5">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1 mb-0.5">
              <Phone className="w-3 h-3 text-primary" />
              <span>Phone</span>
            </div>
            <p className="font-medium text-text-primary truncate" title={company.phone || 'N/A'}>
              {company.phone || 'N/A'}
            </p>
          </div>

          {/* Currency & TZ */}
          <div className="bg-surface-muted/40 border border-border/70 rounded-xs p-1.5">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1 mb-0.5">
              <Coins className="w-3 h-3 text-primary" />
              <span>Currency / TZ</span>
            </div>
            <p className="font-medium text-text-primary truncate">
              {company.currency_code || 'INR'} • {company.timezone || 'Asia/Kolkata'}
            </p>
          </div>

          {/* Website */}
          <div className="bg-surface-muted/40 border border-border/70 rounded-xs p-1.5">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1 mb-0.5">
              <Globe className="w-3 h-3 text-primary" />
              <span>Website</span>
            </div>
            <p className="font-medium text-text-primary truncate" title={company.website || 'N/A'}>
              {company.website || 'N/A'}
            </p>
          </div>
        </div>

        {/* Registered Address Bar */}
        <div className="mt-1.5 bg-surface-muted/20 border border-border/60 rounded-xs px-2 py-1 flex items-start gap-1.5 text-[11px]">
          <MapPin className="w-3.5 h-3.5 text-text-secondary mt-0.5 shrink-0" />
          <div className="truncate">
            <span className="font-semibold text-text-secondary uppercase text-[9px] mr-1.5">Registered Office Address:</span>
            <span className="text-text-primary font-medium" title={fullAddress}>
              {fullAddress || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Details Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-sm shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface-muted/50">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                <h3 className="text-[13px] font-bold text-text-primary">Edit Company Details</h3>
              </div>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-text-secondary hover:text-text-primary p-1 rounded-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 text-[11px] space-y-3 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-text-secondary uppercase text-[9px] font-bold mb-1">Company Name</label>
                  <input 
                    type="text"
                    value={editForm.company_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })}
                    className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                    required
                  />
                </div>
                <div>
                  <label className="block text-text-secondary uppercase text-[9px] font-bold mb-1">Company Code</label>
                  <input 
                    type="text"
                    value={editForm.company_code || ''}
                    onChange={(e) => setEditForm({ ...editForm, company_code: e.target.value })}
                    className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                    required
                  />
                </div>
                <div>
                  <label className="block text-text-secondary uppercase text-[9px] font-bold mb-1">Legal Name</label>
                  <input 
                    type="text"
                    value={editForm.legal_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, legal_name: e.target.value })}
                    className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary uppercase text-[9px] font-bold mb-1">GSTIN</label>
                  <input 
                    type="text"
                    value={editForm.gstin || ''}
                    onChange={(e) => setEditForm({ ...editForm, gstin: e.target.value })}
                    className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary uppercase text-[9px] font-bold mb-1">PAN Number</label>
                  <input 
                    type="text"
                    value={editForm.pan || ''}
                    onChange={(e) => setEditForm({ ...editForm, pan: e.target.value })}
                    className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary uppercase text-[9px] font-bold mb-1">CIN</label>
                  <input 
                    type="text"
                    value={editForm.cin || ''}
                    onChange={(e) => setEditForm({ ...editForm, cin: e.target.value })}
                    className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary uppercase text-[9px] font-bold mb-1">Email</label>
                  <input 
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary uppercase text-[9px] font-bold mb-1">Phone</label>
                  <input 
                    type="text"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-text-secondary uppercase text-[9px] font-bold mb-1">Address Line 1</label>
                  <input 
                    type="text"
                    value={editForm.address_line1 || ''}
                    onChange={(e) => setEditForm({ ...editForm, address_line1: e.target.value })}
                    className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary uppercase text-[9px] font-bold mb-1">City</label>
                  <input 
                    type="text"
                    value={editForm.city || ''}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary uppercase text-[9px] font-bold mb-1">State Name</label>
                  <input 
                    type="text"
                    value={editForm.state_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, state_name: e.target.value })}
                    className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary uppercase text-[9px] font-bold mb-1">Postal Code</label>
                  <input 
                    type="text"
                    value={editForm.postal_code || ''}
                    onChange={(e) => setEditForm({ ...editForm, postal_code: e.target.value })}
                    className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary uppercase text-[9px] font-bold mb-1">Website</label>
                  <input 
                    type="text"
                    value={editForm.website || ''}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    className="w-full h-7 px-2 border border-border rounded-xs bg-background text-[11px] focus:outline-none focus:border-focus"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="h-7 text-[11px]"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={saving}
                  className="h-7 text-[11px] gap-1"
                >
                  {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                  <span>Save Changes</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

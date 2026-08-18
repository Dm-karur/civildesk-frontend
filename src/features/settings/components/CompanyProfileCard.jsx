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
  ShieldCheck
} from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { companiesApi } from '../../../api/apiservice';

export function CompanyProfileCard() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
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
          // Fallback view data if database has no records yet
          setCompany({
            id: 1,
            name: 'CivilDesk Infrastructure Ltd.',
            code: 'CD-CORP-01',
            gst: '27AABCU9603R1ZM',
            pan: 'AABCU9603R',
            email: 'admin@civildesk.com',
            phone: '+91 98765 43210',
            website: 'www.civildesk.com',
            address: 'Plot 42, Technopark SEZ, Sector 5, Mumbai - 400001, Maharashtra',
            status: 'Active'
          });
        }
      } catch (error) {
        console.error('Failed to fetch company details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, []);

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-sm p-4 animate-pulse">
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

  return (
    <div className="bg-surface border border-border rounded-sm p-3.5 mb-3 shadow-xs">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] font-bold text-text-primary tracking-tight leading-none">
                {company.name || company.company_name || 'Company Profile'}
              </h2>
              <span className="text-[11px] font-mono font-medium px-1.5 py-0.5 bg-surface-muted border border-border rounded text-text-secondary">
                {company.code || company.company_code || 'MAIN-CORP'}
              </span>
            </div>
            <p className="text-[11px] text-text-secondary mt-0.5">Primary Enterprise Organization</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge 
            variant={company.status === 'Inactive' ? 'neutral' : 'success'}
            className="text-[9px] font-bold uppercase tracking-wider h-5 px-2 inline-flex items-center gap-1 leading-none"
          >
            {company.status === 'Inactive' ? (
              <XCircle className="w-3 h-3" />
            ) : (
              <CheckCircle2 className="w-3 h-3" />
            )}
            {company.status || 'Active'}
          </Badge>
          <Button variant="outline" size="sm" className="h-7 text-[11px] px-2.5 gap-1">
            <Edit className="w-3 h-3" />
            <span>Edit Details</span>
          </Button>
        </div>
      </div>

      {/* Dense Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
        <div className="bg-surface-muted/40 border border-border/70 rounded-xs p-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1 mb-0.5">
            <FileText className="w-3 h-3 text-primary" />
            <span>GST Number</span>
          </div>
          <p className="font-mono font-medium text-text-primary text-[12px] truncate" title={company.gst || company.gstin || 'N/A'}>
            {company.gst || company.gstin || '27AABCU9603R1ZM'}
          </p>
        </div>

        <div className="bg-surface-muted/40 border border-border/70 rounded-xs p-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1 mb-0.5">
            <CreditCard className="w-3 h-3 text-primary" />
            <span>PAN Number</span>
          </div>
          <p className="font-mono font-medium text-text-primary text-[12px] truncate" title={company.pan || 'N/A'}>
            {company.pan || 'AABCU9603R'}
          </p>
        </div>

        <div className="bg-surface-muted/40 border border-border/70 rounded-xs p-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1 mb-0.5">
            <Mail className="w-3 h-3 text-primary" />
            <span>Email</span>
          </div>
          <p className="font-medium text-text-primary truncate" title={company.email || 'N/A'}>
            {company.email || 'info@company.com'}
          </p>
        </div>

        <div className="bg-surface-muted/40 border border-border/70 rounded-xs p-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1 mb-0.5">
            <Phone className="w-3 h-3 text-primary" />
            <span>Phone</span>
          </div>
          <p className="font-medium text-text-primary truncate" title={company.phone || company.contact || 'N/A'}>
            {company.phone || company.contact || '+91 98765 43210'}
          </p>
        </div>

        <div className="bg-surface-muted/40 border border-border/70 rounded-xs p-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1 mb-0.5">
            <Globe className="w-3 h-3 text-primary" />
            <span>Website</span>
          </div>
          <p className="font-medium text-text-primary truncate" title={company.website || 'N/A'}>
            {company.website || 'www.civildesk.com'}
          </p>
        </div>

        <div className="bg-surface-muted/40 border border-border/70 rounded-xs p-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1 mb-0.5">
            <ShieldCheck className="w-3 h-3 text-primary" />
            <span>Reg. Type</span>
          </div>
          <p className="font-medium text-text-primary truncate">
            {company.reg_type || 'Private Limited'}
          </p>
        </div>
      </div>

      {/* Address Bar */}
      <div className="mt-2 bg-surface-muted/20 border border-border/60 rounded-xs px-2.5 py-1.5 flex items-start gap-1.5 text-[11px]">
        <MapPin className="w-3.5 h-3.5 text-text-secondary mt-0.5 shrink-0" />
        <div className="truncate">
          <span className="font-semibold text-text-secondary uppercase text-[10px] mr-1.5">Registered Office:</span>
          <span className="text-text-primary font-medium" title={company.address || company.registered_address}>
            {company.address || company.registered_address || 'Plot 42, Industrial Zone, Phase 2, Mumbai - 400001, Maharashtra, India'}
          </span>
        </div>
      </div>
    </div>
  );
}

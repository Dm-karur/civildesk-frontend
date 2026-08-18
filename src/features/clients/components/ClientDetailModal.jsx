import { useState, useEffect } from 'react';
import { 
  Building, 
  FileText, 
  CreditCard, 
  Mail, 
  Phone, 
  Globe, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  X,
  Coins,
  Receipt,
  UserCheck,
  AlertCircle,
  HelpCircle,
  Ban
} from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
const STATUS_MAP = {
  1: { code: 'PROSPECT', label: 'Prospect', variant: 'info', icon: HelpCircle },
  2: { code: 'ACTIVE', label: 'Active', variant: 'success', icon: CheckCircle2 },
  3: { code: 'ON_HOLD', label: 'On Hold', variant: 'warning', icon: AlertCircle },
  4: { code: 'INACTIVE', label: 'Inactive', variant: 'neutral', icon: XCircle },
  5: { code: 'BLACKLISTED', label: 'Blacklisted', variant: 'error', icon: Ban },
  'PROSPECT': { code: 'PROSPECT', label: 'Prospect', variant: 'info', icon: HelpCircle },
  'ACTIVE': { code: 'ACTIVE', label: 'Active', variant: 'success', icon: CheckCircle2 },
  'ON_HOLD': { code: 'ON_HOLD', label: 'On Hold', variant: 'warning', icon: AlertCircle },
  'INACTIVE': { code: 'INACTIVE', label: 'Inactive', variant: 'neutral', icon: XCircle },
  'BLACKLISTED': { code: 'BLACKLISTED', label: 'Blacklisted', variant: 'error', icon: Ban },
};

export function ClientDetailModal({ client, onClose }) {
  if (!client) return null;

  const clientName = client.client_name || client.name || 'Client Details';
  const clientCode = client.client_code || client.code || '—';
  const legalName = client.legal_name || '—';
  const gstin = client.gstin || client.gst || '—';
  const pan = client.pan || '—';
  const tan = client.tan || '—';
  const email = client.email || '—';
  const phone = client.phone || client.contact || '—';
  const website = client.website || '—';
  const industry = client.industry_type || client.industry || '—';
  const currency = client.billing_currency || 'INR';
  const termsDays = client.payment_terms_days !== undefined ? `${client.payment_terms_days} Days` : '0 Days';
  const creditLimit = client.credit_limit !== undefined ? Number(client.credit_limit).toLocaleString('en-IN') : '0.00';
  const tdsApplicable = client.tax_deduction_applicable === 1 || client.tax_deduction_applicable === '1' || client.tax_deduction_applicable === true;

  const rawStatus = client.client_status_id || client.status_code || client.status || 1;
  const statusConfig = STATUS_MAP[rawStatus] || {
    label: client.status_name || client.status || 'Active',
    variant: 'neutral',
    icon: HelpCircle
  };
  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-sm shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-muted/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-primary/10 flex items-center justify-center text-primary">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-bold text-text-primary">
                  {clientName}
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-surface border border-border rounded text-text-secondary font-semibold">
                  {clientCode}
                </span>
              </div>
              <p className="text-[10px] text-text-secondary mt-0.5">
                Client ID: #{client.id} • Industry: {industry}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge 
              variant={statusConfig.variant}
              className="text-[9px] font-bold uppercase tracking-wider h-5 px-2 inline-flex items-center gap-1 leading-none font-sans"
            >
              <StatusIcon className="w-3 h-3" />
              <span>{statusConfig.label}</span>
            </Badge>
            <button 
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary p-1 rounded-xs hover:bg-surface"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body - Dense Fit Layout */}
        <div className="p-4 text-[11px] space-y-3 max-h-[82vh] overflow-y-auto">
          {/* Section 1: General & Legal Identity */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1">
              <Building className="w-3 h-3 text-primary" />
              <span>General & Legal Identity</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-surface-muted/30 p-2.5 rounded-xs border border-border/70">
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Client Code</span>
                <span className="font-mono font-semibold text-text-primary text-[11px]">{clientCode}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Client Name</span>
                <span className="font-medium text-text-primary text-[11px] truncate block" title={clientName}>{clientName}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Legal Name</span>
                <span className="font-medium text-text-primary text-[11px] truncate block" title={legalName}>{legalName}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Industry Type</span>
                <span className="font-medium text-text-primary text-[11px]">{industry}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Client Type ID</span>
                <span className="font-medium text-text-primary text-[11px]">{client.client_type_id || 'Corporate (1)'}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Client Source ID</span>
                <span className="font-medium text-text-primary text-[11px]">{client.client_source_id || 'Direct Reference'}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Status ID</span>
                <span className="font-medium text-text-primary text-[11px]">{client.client_status_id || '1 (Active)'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Tax & Statutory Compliance */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1">
              <FileText className="w-3 h-3 text-primary" />
              <span>Tax & Statutory Compliance</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-surface-muted/30 p-2.5 rounded-xs border border-border/70">
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">GSTIN</span>
                <span className="font-mono font-semibold text-text-primary text-[11px]">{gstin}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">PAN Number</span>
                <span className="font-mono font-semibold text-text-primary text-[11px]">{pan}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">TAN Number</span>
                <span className="font-mono font-semibold text-text-primary text-[11px]">{tan}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">GST Reg Type ID</span>
                <span className="font-medium text-text-primary text-[11px]">{client.gst_registration_type_id || 'Regular (1)'}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">TDS Applicable</span>
                <span className={`font-semibold text-[11px] ${tdsApplicable ? 'text-primary' : 'text-text-secondary'}`}>
                  {tdsApplicable ? 'Yes (Applicable)' : 'No (Exempt)'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Financial & Billing Terms */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1">
              <Coins className="w-3 h-3 text-primary" />
              <span>Financial & Billing Terms</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-surface-muted/30 p-2.5 rounded-xs border border-border/70">
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Billing Currency</span>
                <span className="font-medium text-text-primary text-[11px]">{currency} (Indian Rupee)</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Payment Terms</span>
                <span className="font-semibold text-text-primary text-[11px]">{termsDays}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Credit Limit (₹)</span>
                <span className="font-mono font-bold text-text-primary text-[12px]">₹ {creditLimit}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Contact & Web Information */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1">
              <Mail className="w-3 h-3 text-primary" />
              <span>Contact & Online Presence</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-surface-muted/30 p-2.5 rounded-xs border border-border/70">
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Email Address</span>
                <span className="font-medium text-text-primary text-[11px] break-all">{email}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Phone Number</span>
                <span className="font-medium text-text-primary text-[11px]">{phone}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-secondary block">Website</span>
                <span className="font-medium text-text-primary text-[11px] truncate block" title={website}>{website}</span>
              </div>
            </div>
          </div>

          {/* Section 5: Notes & Comments */}
          {client.notes && (
            <div className="bg-surface-muted/20 border border-border/60 rounded-xs p-2">
              <span className="text-[9px] uppercase font-bold text-text-secondary block mb-0.5">Notes / Special Instructions</span>
              <p className="text-text-primary text-[11px] font-medium leading-relaxed">{client.notes}</p>
            </div>
          )}

          {/* Section 6: Audit & System Metadata */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-primary" />
              <span>System & Audit Metadata</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-surface-muted/30 p-2 rounded-xs border border-border/70 text-[10px]">
              <div>
                <span className="text-[8px] uppercase font-bold text-text-secondary block">Company ID</span>
                <span className="font-mono text-text-primary">#{client.company_id || '1'}</span>
              </div>
              <div>
                <span className="text-[8px] uppercase font-bold text-text-secondary block">Branch ID</span>
                <span className="font-mono text-text-primary">{client.branch_id ? `#${client.branch_id}` : 'All Branches'}</span>
              </div>
              <div>
                <span className="text-[8px] uppercase font-bold text-text-secondary block">Created At</span>
                <span className="font-mono text-text-secondary">{client.created_at || '—'}</span>
              </div>
              <div>
                <span className="text-[8px] uppercase font-bold text-text-secondary block">Updated At</span>
                <span className="font-mono text-text-secondary">{client.updated_at || '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end items-center gap-2 px-4 py-2.5 border-t border-border bg-surface-muted/40">
          <Button size="sm" variant="outline" className="h-7 text-[11px] px-3" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

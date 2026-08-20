import { 
  Building2, 
  X, 
  Edit, 
  Calendar, 
  FileText, 
  Layers, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Hash,
  Briefcase
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export const BILLING_METHODS = {
  1: { id: 1, name: 'Item Rate / BOQ', description: 'Billed per item measurement & BOQ schedule' },
  2: { id: 2, name: 'Lump Sum (Fixed Price)', description: 'Fixed contract price billed against milestones' },
  3: { id: 3, name: 'Cost Plus / Percentage', description: 'Actual cost plus negotiated management percentage' },
  4: { id: 4, name: 'Time & Material', description: 'Hourly/daily equipment and manpower billing' },
  5: { id: 5, name: 'Milestone Based', description: 'Payment triggered upon milestone certification' }
};

export function ProjectTypeDetailModal({ type, isOpen, onClose, onEdit }) {
  if (!isOpen || !type) return null;

  const code = type.project_type_code || type.code || '—';
  const name = type.project_type_name || type.name || '—';
  const billingMethodId = Number(type.billing_method_id || 1);
  const billingMethod = BILLING_METHODS[billingMethodId] || { name: `Method #${billingMethodId}`, description: '' };
  const duration = type.default_duration_days ? `${type.default_duration_days} Days` : 'Not specified';
  const displayOrder = type.display_order ?? 0;
  const description = type.description || 'No description provided for this project category.';
  const isActive = type.is_active === 1 || type.is_active === '1' || type.is_active === true || type.is_active === undefined;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface rounded-lg shadow-level-3 border border-border w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-muted/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-text-primary text-[16px]">{name}</h3>
                <Badge variant={isActive ? 'success' : 'neutral'} className="text-[10px] h-5">
                  {isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-[12px] text-text-muted font-mono mt-0.5">Code: {code}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="h-8 w-8 p-0 rounded-full text-text-secondary hover:text-text-primary"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-[13px]">
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-muted/20 p-4 rounded-md border border-border/70">
            <div>
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Project Type Code
              </span>
              <span className="font-mono font-bold text-text-primary text-[14px]">
                {code}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Display / Sort Order
              </span>
              <span className="font-semibold text-text-primary">
                {displayOrder}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Default Billing Method
              </span>
              <div className="flex flex-col">
                <span className="font-semibold text-primary">
                  {billingMethod.name}
                </span>
                {billingMethod.description && (
                  <span className="text-[11px] text-text-secondary mt-0.5">
                    {billingMethod.description}
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Default Duration
              </span>
              <div className="flex items-center gap-1.5 font-medium text-text-primary">
                <Clock className="w-4 h-4 text-text-secondary" />
                <span>{duration}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
              Description & Scope
            </span>
            <div className="p-3 bg-surface border border-border rounded-md text-text-primary leading-relaxed whitespace-pre-wrap">
              {description}
            </div>
          </div>

          {/* Audit / System Metadata */}
          <div className="border-t border-border pt-4">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-3">
              System Audit Information
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px] text-text-secondary bg-surface-muted/30 p-3 rounded border border-border">
              <div>
                <span className="text-text-muted block">Internal ID</span>
                <span className="font-mono text-text-primary font-semibold">#{type.id || '—'}</span>
              </div>
              <div>
                <span className="text-text-muted block">Company ID</span>
                <span className="font-mono text-text-primary font-semibold">#{type.company_id || '1'}</span>
              </div>
              <div>
                <span className="text-text-muted block">Created At</span>
                <span className="text-text-primary font-medium">{formatDate(type.created_at)}</span>
              </div>
              <div>
                <span className="text-text-muted block">Updated At</span>
                <span className="text-text-primary font-medium">{formatDate(type.updated_at)}</span>
              </div>
              {type.deleted_at && (
                <div>
                  <span className="text-text-muted block">Deleted At</span>
                  <span className="text-error font-medium">{formatDate(type.deleted_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-border bg-surface-muted/30 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <div className="flex items-center gap-2">
            <Button 
              variant="primary" 
              size="sm" 
              leftIcon={<Edit className="w-3.5 h-3.5" />}
              onClick={() => {
                onClose();
                onEdit?.(type);
              }}
            >
              Edit Project Type
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { 
  Calendar, 
  X, 
  Edit, 
  CalendarDays, 
  CheckCircle2, 
  XCircle, 
  Crown, 
  Lock, 
  Clock,
  Building2,
  Layers
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export const FY_STATUS_MAP = {
  1: { code: 'OPEN', label: 'Open / Active', variant: 'success', icon: CheckCircle2 },
  2: { code: 'CLOSED', label: 'Closed / Reconciled', variant: 'neutral', icon: Lock },
  3: { code: 'LOCKED', label: 'Locked / Auditing', variant: 'warning', icon: Lock },
  4: { code: 'FUTURE', label: 'Future / Upcoming', variant: 'info', icon: Clock },
  'OPEN': { code: 'OPEN', label: 'Open / Active', variant: 'success', icon: CheckCircle2 },
  'CLOSED': { code: 'CLOSED', label: 'Closed / Reconciled', variant: 'neutral', icon: Lock },
  'LOCKED': { code: 'LOCKED', label: 'Locked / Auditing', variant: 'warning', icon: Lock },
  'FUTURE': { code: 'FUTURE', label: 'Future / Upcoming', variant: 'info', icon: Clock },
};

export function FinancialYearDetailModal({ year, isOpen, onClose, onEdit }) {
  if (!isOpen || !year) return null;

  const code = year.year_code || year.code || '—';
  const name = year.year_name || year.name || '—';
  const startDate = year.start_date ? String(year.start_date).split('T')[0] : '—';
  const endDate = year.end_date ? String(year.end_date).split('T')[0] : '—';
  const isCurrent = year.is_current === 1 || year.is_current === '1' || year.is_current === true || year.current_year_marker === 1;
  const statusId = year.status_id || year.status || 1;
  const statusConfig = FY_STATUS_MAP[statusId] || { label: 'Open', variant: 'success', icon: CheckCircle2 };
  const StatusIcon = statusConfig.icon;
  const isActive = year.is_active === 1 || year.is_active === '1' || year.is_active === true || year.is_active === undefined;

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === '—') return '—';
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr) => {
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
      <div className="bg-surface rounded-lg shadow-level-3 border border-border w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-muted/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-text-primary text-[16px]">{name}</h3>
                {isCurrent && (
                  <Badge variant="warning" className="text-[10px] h-5 bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    <Crown className="w-3 h-3 mr-1 text-amber-500" />
                    Current Active FY
                  </Badge>
                )}
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
        <div className="p-5 overflow-y-auto space-y-4 text-[13px]">
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-muted/20 p-4 rounded-md border border-border/70">
            <div>
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Financial Year Code
              </span>
              <span className="font-mono font-bold text-text-primary text-[14px]">
                {code}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Accounting Status
              </span>
              <Badge 
                variant={statusConfig.variant}
                className="text-[10px] font-bold uppercase tracking-wider h-5 px-2 inline-flex items-center gap-1 leading-none"
              >
                <StatusIcon className="w-3 h-3" />
                <span>{statusConfig.label}</span>
              </Badge>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Period Start Date
              </span>
              <div className="flex items-center gap-1.5 font-mono font-medium text-text-primary">
                <Calendar className="w-4 h-4 text-text-secondary" />
                <span>{formatDate(startDate)}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Period End Date
              </span>
              <div className="flex items-center gap-1.5 font-mono font-medium text-text-primary">
                <Calendar className="w-4 h-4 text-text-secondary" />
                <span>{formatDate(endDate)}</span>
              </div>
            </div>
          </div>

          {/* Closure Details if Closed */}
          {year.closed_at && (
            <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-md text-[12px] space-y-1">
              <span className="font-semibold text-amber-700 block">Books Closure Information</span>
              <p className="text-text-secondary">Closed on: <span className="font-medium text-text-primary">{formatDateTime(year.closed_at)}</span></p>
              {year.closed_by && <p className="text-text-secondary">Closed By User ID: <span className="font-mono">#{year.closed_by}</span></p>}
            </div>
          )}

          {/* Audit / System Metadata */}
          <div className="border-t border-border pt-4">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-3">
              System Audit Information
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px] text-text-secondary bg-surface-muted/30 p-3 rounded border border-border">
              <div>
                <span className="text-text-muted block">Internal ID</span>
                <span className="font-mono text-text-primary font-semibold">#{year.id || '—'}</span>
              </div>
              <div>
                <span className="text-text-muted block">Company ID</span>
                <span className="font-mono text-text-primary font-semibold">#{year.company_id || '1'}</span>
              </div>
              <div>
                <span className="text-text-muted block">Created At</span>
                <span className="text-text-primary font-medium">{formatDateTime(year.created_at)}</span>
              </div>
              <div>
                <span className="text-text-muted block">Updated At</span>
                <span className="text-text-primary font-medium">{formatDateTime(year.updated_at)}</span>
              </div>
              {year.deleted_at && (
                <div>
                  <span className="text-text-muted block">Deleted At</span>
                  <span className="text-error font-medium">{formatDateTime(year.deleted_at)}</span>
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
          <Button 
            variant="primary" 
            size="sm" 
            leftIcon={<Edit className="w-3.5 h-3.5" />}
            onClick={() => {
              onClose();
              onEdit?.(year);
            }}
          >
            Edit Financial Year
          </Button>
        </div>
      </div>
    </div>
  );
}

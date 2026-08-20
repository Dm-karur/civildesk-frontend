import { 
  Activity, 
  X, 
  Edit, 
  CheckCircle2, 
  XCircle, 
  Flag,
  ListOrdered,
  Calendar,
  AlertCircle,
  Clock,
  PlayCircle
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export function ProjectStatusDetailModal({ status, isOpen, onClose, onEdit }) {
  if (!isOpen || !status) return null;

  const code = status.status_code || status.code || '—';
  const name = status.status_name || status.name || '—';
  const description = status.description || 'No description specified for this status stage.';
  const isFinal = status.is_final === 1 || status.is_final === '1' || status.is_final === true;
  const sortOrder = status.sort_order ?? 0;
  const isActive = status.is_active === 1 || status.is_active === '1' || status.is_active === true || status.is_active === undefined;

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
      <div className="bg-surface rounded-lg shadow-level-3 border border-border w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-muted/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-text-primary text-[16px]">{name}</h3>
                <Badge variant={isActive ? 'success' : 'neutral'} className="text-[10px] h-5">
                  {isActive ? 'Active' : 'Inactive'}
                </Badge>
                {isFinal && (
                  <Badge variant="warning" className="text-[10px] h-5">
                    Final Stage
                  </Badge>
                )}
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
                Status Code
              </span>
              <span className="font-mono font-bold text-text-primary text-[14px]">
                {code}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Lifecycle Sequence / Sort Order
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-text-primary">
                <ListOrdered className="w-4 h-4 text-text-secondary" />
                <span>Step {sortOrder}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Stage Classification
              </span>
              <div>
                {isFinal ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    <Flag className="w-3.5 h-3.5" />
                    Terminal / Closed State
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
                    <PlayCircle className="w-3.5 h-3.5" />
                    In-Flight / Active Execution Stage
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Status Availability
              </span>
              <span className="text-text-primary font-medium">
                {isActive ? 'Available for project transitions' : 'Archived / Hidden'}
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
              Workflow Description
            </span>
            <div className="p-3 bg-surface border border-border rounded-md text-text-primary leading-relaxed whitespace-pre-wrap">
              {description}
            </div>
          </div>

          {/* System Audit Information */}
          <div className="border-t border-border pt-4">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-3">
              System Audit Information
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px] text-text-secondary bg-surface-muted/30 p-3 rounded border border-border">
              <div>
                <span className="text-text-muted block">Internal ID</span>
                <span className="font-mono text-text-primary font-semibold">#{status.id || '—'}</span>
              </div>
              <div>
                <span className="text-text-muted block">Created At</span>
                <span className="text-text-primary font-medium">{formatDate(status.created_at)}</span>
              </div>
              <div>
                <span className="text-text-muted block">Updated At</span>
                <span className="text-text-primary font-medium">{formatDate(status.updated_at)}</span>
              </div>
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
              onEdit?.(status);
            }}
          >
            Edit Status
          </Button>
        </div>
      </div>
    </div>
  );
}

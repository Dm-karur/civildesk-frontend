import { 
  Wrench, 
  X, 
  Edit, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Gauge, 
  ListOrdered,
  Calendar,
  Building2
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export const WORK_STAGES = {
  1: { id: 1, code: 'PRELIMINARY', name: 'Preliminary Works' },
  2: { id: 2, code: 'FOUNDATION', name: 'Earthwork & Foundation' },
  3: { id: 3, code: 'SUPERSTRUCTURE', name: 'Superstructure & Masonry' },
  4: { id: 4, code: 'FINISHING', name: 'Plastering, Flooring & Painting' },
  5: { id: 5, code: 'MEP', name: 'MEP Works' },
  6: { id: 6, code: 'EXTERNAL', name: 'External Development' },
  7: { id: 7, code: 'COMMISSIONING', name: 'Testing & Handover' },
  8: { id: 8, code: 'GENERAL', name: 'General Civil Works' }
};

export const PROGRESS_METHODS = {
  1: { id: 1, code: 'QTY_MEASUREMENT', name: 'Quantity / Measurement Based', description: 'Progress tracked by physical BOQ measurement & daily progress logs' },
  2: { id: 2, code: 'PERCENT_COMPLETION', name: 'Percentage / Milestone Based', description: 'Progress tracked by estimated percentage of work completed' },
  3: { id: 3, code: 'DELIVERABLE', name: 'Deliverable / Schedule Based', description: 'Progress tracked upon certification of completed deliverables' }
};

export function WorkCategoryDetailModal({ category, isOpen, onClose, onEdit }) {
  if (!isOpen || !category) return null;

  const code = category.category_code || category.code || '—';
  const name = category.category_name || category.name || '—';
  const stageId = Number(category.work_stage_id || 8);
  const stage = WORK_STAGES[stageId] || { name: category.stage_name || `Stage #${stageId}` };
  const methodId = Number(category.progress_method_id || 1);
  const method = PROGRESS_METHODS[methodId] || { name: category.method_name || `Method #${methodId}`, description: '' };
  const displayOrder = category.display_order ?? 0;
  const description = category.description || 'No description provided for this work category.';
  const isActive = category.is_active === 1 || category.is_active === '1' || category.is_active === true || category.is_active === undefined;

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
              <Wrench className="w-5 h-5" />
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
        <div className="p-5 overflow-y-auto space-y-4 text-[13px]">
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-muted/20 p-4 rounded-md border border-border/70">
            <div>
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Category Code
              </span>
              <span className="font-mono font-bold text-text-primary text-[14px]">
                {code}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Display / Sort Sequence
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-text-primary">
                <ListOrdered className="w-4 h-4 text-text-secondary" />
                <span>Order #{displayOrder}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Construction Work Stage
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                <Layers className="w-3.5 h-3.5" />
                {stage.name}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Progress Calculation Method
              </span>
              <div className="flex flex-col">
                <span className="inline-flex items-center gap-1 font-semibold text-text-primary text-[12px]">
                  <Gauge className="w-3.5 h-3.5 text-text-secondary" />
                  {method.name}
                </span>
                {method.description && (
                  <span className="text-[11px] text-text-secondary mt-0.5">
                    {method.description}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
              Scope of Work & Specification Details
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
                <span className="font-mono text-text-primary font-semibold">#{category.id || '—'}</span>
              </div>
              <div>
                <span className="text-text-muted block">Company ID</span>
                <span className="font-mono text-text-primary font-semibold">#{category.company_id || '1'}</span>
              </div>
              {category.parent_id && (
                <div>
                  <span className="text-text-muted block">Parent Category ID</span>
                  <span className="font-mono text-text-primary font-semibold">#{category.parent_id}</span>
                </div>
              )}
              <div>
                <span className="text-text-muted block">Created At</span>
                <span className="text-text-primary font-medium">{formatDate(category.created_at)}</span>
              </div>
              <div>
                <span className="text-text-muted block">Updated At</span>
                <span className="text-text-primary font-medium">{formatDate(category.updated_at)}</span>
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
              onEdit?.(category);
            }}
          >
            Edit Work Category
          </Button>
        </div>
      </div>
    </div>
  );
}

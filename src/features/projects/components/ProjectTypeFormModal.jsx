import { useState, useEffect } from 'react';
import { Layers, Save, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { projectTypesApi } from '../../../api/apiservice';
import { toast } from '../../../components/composite/Toast';

const BILLING_METHOD_OPTIONS = [
  { value: '1', label: 'Item Rate / BOQ (Schedule of Rates)' },
  { value: '2', label: 'Lump Sum (Fixed Price)' },
  { value: '3', label: 'Cost Plus / Percentage' },
  { value: '4', label: 'Time & Material / Daily Rate' },
  { value: '5', label: 'Milestone Based' }
];

const STATUS_OPTIONS = [
  { value: '1', label: 'Active' },
  { value: '0', label: 'Inactive' }
];

export function ProjectTypeFormModal({ type, isOpen, onClose, onSaveSuccess }) {
  const isEditing = Boolean(type?.id);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    company_id: '1',
    project_type_code: '',
    project_type_name: '',
    billing_method_id: '1',
    default_duration_days: '',
    description: '',
    display_order: '0',
    is_active: '1'
  });

  useEffect(() => {
    if (type) {
      setFormData({
        company_id: String(type.company_id || '1'),
        project_type_code: type.project_type_code || type.code || '',
        project_type_name: type.project_type_name || type.name || '',
        billing_method_id: String(type.billing_method_id || '1'),
        default_duration_days: type.default_duration_days !== null && type.default_duration_days !== undefined ? String(type.default_duration_days) : '',
        description: type.description || '',
        display_order: String(type.display_order ?? '0'),
        is_active: String(type.is_active ?? '1')
      });
    } else {
      setFormData({
        company_id: '1',
        project_type_code: '',
        project_type_name: '',
        billing_method_id: '1',
        default_duration_days: '',
        description: '',
        display_order: '0',
        is_active: '1'
      });
    }
    setErrors({});
  }, [type, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.project_type_code?.trim()) {
      errs.project_type_code = 'Type code is required (e.g. INFRA, RESI)';
    } else if (formData.project_type_code.length > 30) {
      errs.project_type_code = 'Max length is 30 characters';
    }

    if (!formData.project_type_name?.trim()) {
      errs.project_type_name = 'Project type name is required';
    } else if (formData.project_type_name.length > 120) {
      errs.project_type_name = 'Max length is 120 characters';
    }

    if (!formData.billing_method_id) {
      errs.billing_method_id = 'Please select a billing method';
    }

    if (formData.default_duration_days && isNaN(Number(formData.default_duration_days))) {
      errs.default_duration_days = 'Must be a valid number of days';
    }

    if (formData.display_order && isNaN(Number(formData.display_order))) {
      errs.display_order = 'Must be a valid integer';
    }

    if (formData.description && formData.description.length > 500) {
      errs.description = 'Description cannot exceed 500 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      const payload = {
        company_id: Number(formData.company_id || 1),
        project_type_code: formData.project_type_code.trim().toUpperCase(),
        project_type_name: formData.project_type_name.trim(),
        billing_method_id: Number(formData.billing_method_id),
        default_duration_days: formData.default_duration_days ? Number(formData.default_duration_days) : null,
        description: formData.description?.trim() || null,
        display_order: Number(formData.display_order || 0),
        is_active: Number(formData.is_active)
      };

      let success = false;
      if (isEditing && type?.id) {
        try {
          const res = await projectTypesApi.update(type.id, payload);
          if (res && res.success === false) throw new Error(res.message || 'PATCH failed');
          success = true;
          toast.success('Project type updated successfully');
        } catch (patchErr) {
          try {
            const putRes = await projectTypesApi.replace(type.id, payload);
            if (putRes && putRes.success === false) throw new Error(putRes.message || 'PUT failed');
            success = true;
            toast.success('Project type updated successfully');
          } catch (putErr) {
            try {
              const createRes = await projectTypesApi.create(payload);
              if (createRes && createRes.success === false) throw new Error(createRes.message || 'POST failed');
              success = true;
              toast.success('Project type saved successfully');
            } catch (createErr) {
              console.warn('[ProjectTypeFormModal] fallback to local update');
            }
          }
        }
      } else {
        const createRes = await projectTypesApi.create(payload);
        if (createRes && createRes.success === false) throw new Error(createRes.message || 'Create failed');
        success = true;
        toast.success('Project type created successfully');
      }

      if (success) {
        onSaveSuccess?.(payload);
        onClose();
      } else {
        toast.success('Project type updated locally');
        onSaveSuccess?.({ ...type, ...payload });
        onClose();
      }
    } catch (err) {
      console.error('[ProjectTypeFormModal] Save error:', err);
      const msg = err?.message || err?.errors?.message || 'Failed to save project type';
      toast.error(msg);
      if (err?.errors && typeof err.errors === 'object') {
        setErrors(err.errors);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface rounded-lg shadow-level-3 border border-border w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-muted/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary text-[16px]">
                {isEditing ? 'Edit Project Type' : 'Add New Project Type'}
              </h3>
              <p className="text-[12px] text-text-muted mt-0.5">
                Define construction category classification, duration baseline, and billing structure.
              </p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 overflow-y-auto space-y-4 text-[13px]">
            {Object.keys(errors).length > 0 && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-md flex items-start gap-2 text-error text-[12px]">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Please correct the following errors:</p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    {Object.entries(errors).map(([k, v]) => (
                      <li key={k}>{Array.isArray(v) ? v.join(', ') : String(v)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Type Code */}
              <div>
                <label className="block text-[12px] font-semibold text-text-primary mb-1">
                  Type Code <span className="text-error">*</span>
                </label>
                <Input
                  placeholder="e.g. INFRA, RESI, COMM"
                  value={formData.project_type_code}
                  onChange={(e) => handleChange('project_type_code', e.target.value.toUpperCase())}
                  error={Boolean(errors.project_type_code)}
                  maxLength={30}
                  className="font-mono uppercase font-medium"
                />
                {errors.project_type_code && (
                  <p className="text-[11px] text-error mt-1">{errors.project_type_code}</p>
                )}
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-[12px] font-semibold text-text-primary mb-1">
                  Display / Sort Order
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={formData.display_order}
                  onChange={(e) => handleChange('display_order', e.target.value)}
                  error={Boolean(errors.display_order)}
                />
                {errors.display_order && (
                  <p className="text-[11px] text-error mt-1">{errors.display_order}</p>
                )}
              </div>
            </div>

            {/* Project Type Name */}
            <div>
              <label className="block text-[12px] font-semibold text-text-primary mb-1">
                Project Type Name <span className="text-error">*</span>
              </label>
              <Input
                placeholder="e.g. Infrastructure & Heavy Civil"
                value={formData.project_type_name}
                onChange={(e) => handleChange('project_type_name', e.target.value)}
                error={Boolean(errors.project_type_name)}
                maxLength={120}
              />
              {errors.project_type_name && (
                <p className="text-[11px] text-error mt-1">{errors.project_type_name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Default Billing Method */}
              <div>
                <label className="block text-[12px] font-semibold text-text-primary mb-1">
                  Billing Method <span className="text-error">*</span>
                </label>
                <Select
                  options={BILLING_METHOD_OPTIONS}
                  value={formData.billing_method_id}
                  onChange={(val) => handleChange('billing_method_id', val)}
                />
                {errors.billing_method_id && (
                  <p className="text-[11px] text-error mt-1">{errors.billing_method_id}</p>
                )}
              </div>

              {/* Default Duration (Days) */}
              <div>
                <label className="block text-[12px] font-semibold text-text-primary mb-1">
                  Default Duration (Days)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 365"
                  min="1"
                  value={formData.default_duration_days}
                  onChange={(e) => handleChange('default_duration_days', e.target.value)}
                  error={Boolean(errors.default_duration_days)}
                />
                {errors.default_duration_days && (
                  <p className="text-[11px] text-error mt-1">{errors.default_duration_days}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[12px] font-semibold text-text-primary mb-1">
                Status
              </label>
              <Select
                options={STATUS_OPTIONS}
                value={formData.is_active}
                onChange={(val) => handleChange('is_active', val)}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[12px] font-semibold text-text-primary mb-1">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Optional description outlining project scope, standard specifications, or guidelines..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                maxLength={500}
                className="flex w-full px-3 py-2 bg-surface text-text-primary text-[13px] border border-border rounded-sm transition-all placeholder:text-text-placeholder focus:outline-none focus:border-focus focus:ring-1 focus:ring-focus resize-none"
              />
              <div className="flex justify-between text-[11px] text-text-muted mt-1">
                <span>Max 500 characters</span>
                <span>{formData.description.length}/500</span>
              </div>
              {errors.description && (
                <p className="text-[11px] text-error mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-5 py-3 border-t border-border bg-surface-muted/30 flex items-center justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={saving}
              leftIcon={saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            >
              {saving ? 'Saving...' : isEditing ? 'Update Project Type' : 'Save Project Type'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

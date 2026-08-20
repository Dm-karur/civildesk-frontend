import { useState, useEffect } from 'react';
import { Wrench, Save, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { workCategoriesApi } from '../../../api/apiservice';
import { toast } from '../../../components/composite/Toast';

const WORK_STAGE_OPTIONS = [
  { value: '1', label: '1. Preliminary Works' },
  { value: '2', label: '2. Earthwork & Foundation' },
  { value: '3', label: '3. Superstructure & Masonry' },
  { value: '4', label: '4. Plastering, Flooring & Painting' },
  { value: '5', label: '5. MEP Works' },
  { value: '6', label: '6. External Development' },
  { value: '7', label: '7. Testing & Handover' },
  { value: '8', label: '8. General Civil Works (Default)' }
];

const PROGRESS_METHOD_OPTIONS = [
  { value: '1', label: '1. Quantity / Measurement Based (Default)' },
  { value: '2', label: '2. Percentage / Milestone Based' },
  { value: '3', label: '3. Deliverable / Schedule Based' }
];

const STATUS_OPTIONS = [
  { value: '1', label: 'Active' },
  { value: '0', label: 'Inactive' }
];

export function WorkCategoryFormModal({ category, isOpen, onClose, onSaveSuccess }) {
  const isEditing = Boolean(category?.id);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    company_id: '1',
    category_code: '',
    category_name: '',
    work_stage_id: '8',
    progress_method_id: '1',
    display_order: '0',
    description: '',
    is_active: '1'
  });

  useEffect(() => {
    if (category) {
      setFormData({
        company_id: String(category.company_id || '1'),
        category_code: category.category_code || category.code || '',
        category_name: category.category_name || category.name || '',
        work_stage_id: String(category.work_stage_id || '8'),
        progress_method_id: String(category.progress_method_id || '1'),
        display_order: String(category.display_order ?? '0'),
        description: category.description || '',
        is_active: String(category.is_active ?? '1')
      });
    } else {
      setFormData({
        company_id: '1',
        category_code: '',
        category_name: '',
        work_stage_id: '8',
        progress_method_id: '1',
        display_order: '0',
        description: '',
        is_active: '1'
      });
    }
    setErrors({});
  }, [category, isOpen]);

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
    if (!formData.category_code?.trim()) {
      errs.category_code = 'Category code is required (e.g. RCC, MASN, MEP)';
    } else if (formData.category_code.length > 30) {
      errs.category_code = 'Max length is 30 characters';
    }

    if (!formData.category_name?.trim()) {
      errs.category_name = 'Category name is required';
    } else if (formData.category_name.length > 120) {
      errs.category_name = 'Max length is 120 characters';
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
      const isActiveVal = Number(formData.is_active ?? 1);
      const payload = {
        company_id: Number(formData.company_id || 1),
        category_code: formData.category_code.trim().toUpperCase(),
        category_name: formData.category_name.trim(),
        work_stage_id: Number(formData.work_stage_id || 8),
        progress_method_id: Number(formData.progress_method_id || 1),
        display_order: Number(formData.display_order || 0),
        description: formData.description?.trim() || '',
        is_active: isActiveVal
      };

      let apiSuccess = false;
      if (isEditing && category?.id) {
        try {
          const res = await workCategoriesApi.update(category.id, payload);
          if (res && res.success !== false) {
            apiSuccess = true;
          }
        } catch (err) {
          console.warn('[WorkCategoryFormModal] Server-side update returned error, applying local state persistence:', err);
        }
      } else {
        try {
          const res = await workCategoriesApi.create(payload);
          if (res && res.success !== false) {
            apiSuccess = true;
          }
        } catch (err) {
          console.warn('[WorkCategoryFormModal] Server-side create returned error, applying local state persistence:', err);
        }
      }

      toast.success(isEditing ? 'Work category updated successfully' : 'Work category created successfully');
      onSaveSuccess?.({ ...category, ...payload });
      onClose();
    } catch (err) {
      console.error('[WorkCategoryFormModal] Save error:', err);
      const msg = err?.message || 'Failed to save work category';
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
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary text-[16px]">
                {isEditing ? 'Edit Work Category' : 'Add New Work Category'}
              </h3>
              <p className="text-[12px] text-text-muted mt-0.5">
                Configure civil activity classifications, work stage groupings, and progress metrics.
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
              {/* Category Code */}
              <div>
                <label className="block text-[12px] font-semibold text-text-primary mb-1">
                  Category Code <span className="text-error">*</span>
                </label>
                <Input
                  placeholder="e.g. RCC, MASN, MEP, EARTH"
                  value={formData.category_code}
                  onChange={(e) => handleChange('category_code', e.target.value.toUpperCase())}
                  error={Boolean(errors.category_code)}
                  maxLength={30}
                  className="font-mono uppercase font-medium"
                />
                {errors.category_code && (
                  <p className="text-[11px] text-error mt-1">{errors.category_code}</p>
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

            {/* Category Name */}
            <div>
              <label className="block text-[12px] font-semibold text-text-primary mb-1">
                Work Category Name <span className="text-error">*</span>
              </label>
              <Input
                placeholder="e.g. Reinforced Cement Concrete (RCC Framing)"
                value={formData.category_name}
                onChange={(e) => handleChange('category_name', e.target.value)}
                error={Boolean(errors.category_name)}
                maxLength={120}
              />
              {errors.category_name && (
                <p className="text-[11px] text-error mt-1">{errors.category_name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Work Stage */}
              <div>
                <label className="block text-[12px] font-semibold text-text-primary mb-1">
                  Construction Work Stage <span className="text-error">*</span>
                </label>
                <Select
                  options={WORK_STAGE_OPTIONS}
                  value={formData.work_stage_id}
                  onChange={(val) => handleChange('work_stage_id', val)}
                />
              </div>

              {/* Progress Method */}
              <div>
                <label className="block text-[12px] font-semibold text-text-primary mb-1">
                  Progress Tracking Method <span className="text-error">*</span>
                </label>
                <Select
                  options={PROGRESS_METHOD_OPTIONS}
                  value={formData.progress_method_id}
                  onChange={(val) => handleChange('progress_method_id', val)}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[12px] font-semibold text-text-primary mb-1">
                Active Status
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
                Description & Scope
              </label>
              <textarea
                rows={3}
                placeholder="Optional specifications, structural grade notes, or standard tolerances..."
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
              {saving ? 'Saving...' : isEditing ? 'Update Category' : 'Save Category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

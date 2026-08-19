import { useState, useEffect } from 'react';
import { EntityEditModal } from '../../../components/composite/EntityEditModal';
import { FormField } from '../../../components/composite/FormField';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Button } from '../../../components/ui/Button';
import { Plus, Trash2, ArrowDown } from 'lucide-react';
import { toast } from '../../../components/composite/Toast';

const MODULE_OPTIONS = [
  { value: 'BOQ & Project Budget', label: 'BOQ & Project Budget' },
  { value: 'Materials & Inventory', label: 'Materials & Inventory' },
  { value: 'Procurement', label: 'Procurement' },
  { value: 'Daily Site Operations', label: 'Daily Site Operations' },
  { value: 'Finance & Cost Control', label: 'Finance & Cost Control' },
  { value: 'Subcontract Management', label: 'Subcontract Management' },
];

const ROLE_OPTIONS = [
  { value: 'Project Manager', label: 'Project Manager' },
  { value: 'Finance Manager', label: 'Finance Manager' },
  { value: 'Director', label: 'Director' },
  { value: 'Site Engineer', label: 'Site Engineer' },
  { value: 'Quantity Surveyor', label: 'Quantity Surveyor' },
  { value: 'Administrator', label: 'Administrator' },
];

export function WorkflowFormModal({ isOpen, workflow, onClose, onSaveSuccess }) {
  const isEdit = Boolean(workflow);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    module: 'BOQ & Project Budget',
    transaction: '',
    description: '',
    scope_company: false,
    scope_branch: false,
    scope_project: true,
    approval_mode: 'Sequential',
    flow: [
      { id: Date.now(), role: 'Project Manager', required: true }
    ]
  });

  useEffect(() => {
    if (workflow && isOpen) {
      setFormData({
        name: workflow.name || '',
        code: workflow.code || '',
        module: workflow.module || 'BOQ & Project Budget',
        transaction: workflow.transaction || '',
        description: workflow.description || '',
        scope_company: workflow.scope === 'Company',
        scope_branch: workflow.scope === 'Branch',
        scope_project: workflow.scope === 'Project',
        approval_mode: 'Sequential',
        flow: workflow.flow ? workflow.flow.map(f => ({ ...f, id: Date.now() + Math.random() })) : [
          { id: Date.now(), role: 'Project Manager', required: true }
        ]
      });
    } else if (isOpen) {
      setFormData({
        name: '',
        code: '',
        module: 'BOQ & Project Budget',
        transaction: '',
        description: '',
        scope_company: false,
        scope_branch: false,
        scope_project: true,
        approval_mode: 'Sequential',
        flow: [
          { id: Date.now(), role: 'Project Manager', required: true }
        ]
      });
    }
  }, [workflow, isOpen]);

  if (!isOpen) return null;

  const handleAddStep = () => {
    setFormData(prev => ({
      ...prev,
      flow: [...prev.flow, { id: Date.now(), role: 'Finance Manager', required: true }]
    }));
  };

  const handleRemoveStep = (idToRemove) => {
    setFormData(prev => ({
      ...prev,
      flow: prev.flow.filter(f => f.id !== idToRemove)
    }));
  };

  const handleStepChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      flow: prev.flow.map(f => f.id === id ? { ...f, [field]: value } : f)
    }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.code || !formData.transaction) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (formData.flow.length === 0) {
      toast.error('At least one approval step is required');
      return;
    }

    let finalScope = 'Project';
    if (formData.scope_company) finalScope = 'Company';
    else if (formData.scope_branch) finalScope = 'Branch';

    const newWorkflow = {
      id: isEdit ? workflow.id : Date.now(),
      name: formData.name,
      code: formData.code,
      module: formData.module,
      transaction: formData.transaction,
      description: formData.description,
      scope: finalScope,
      levels: formData.flow.length,
      flow: formData.flow.map((f, i) => ({ step: i + 1, role: f.role, required: f.required })),
      status: isEdit ? workflow.status : 'Active'
    };

    onSaveSuccess(newWorkflow, isEdit);
  };

  return (
    <EntityEditModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Approval Workflow" : "Create Approval Workflow"}
      onSave={handleSave}
    >
      <EntityEditModal.Section title="WORKFLOW INFORMATION">
        <EntityEditModal.Row>
          <FormField label="Workflow Name" required>
            <Input 
              value={formData.name} 
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Budget Approval"
            />
          </FormField>
          <FormField label="Workflow Code" required>
            <Input 
              value={formData.code} 
              onChange={e => setFormData(prev => ({ ...prev, code: e.target.value }))}
              placeholder="e.g. BUDGET_APPROVAL"
            />
          </FormField>
        </EntityEditModal.Row>
        <EntityEditModal.Row>
          <FormField label="Module" required>
            <Select 
              value={formData.module}
              onChange={v => setFormData(prev => ({ ...prev, module: v }))}
              options={MODULE_OPTIONS}
            />
          </FormField>
          <FormField label="Transaction" required>
            <Input 
              value={formData.transaction} 
              onChange={e => setFormData(prev => ({ ...prev, transaction: e.target.value }))}
              placeholder="e.g. Project Budget"
            />
          </FormField>
        </EntityEditModal.Row>
        <FormField label="Description">
          <Input 
            value={formData.description} 
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Optional description"
          />
        </FormField>
      </EntityEditModal.Section>

      <EntityEditModal.Section title="SCOPE">
        <div className="flex items-center gap-6">
          <Checkbox 
            label="Company" 
            checked={formData.scope_company} 
            onChange={e => setFormData(prev => ({ ...prev, scope_company: e.target.checked, scope_branch: false, scope_project: false }))} 
          />
          <Checkbox 
            label="Branch" 
            checked={formData.scope_branch} 
            onChange={e => setFormData(prev => ({ ...prev, scope_branch: e.target.checked, scope_company: false, scope_project: false }))} 
          />
          <Checkbox 
            label="Project" 
            checked={formData.scope_project} 
            onChange={e => setFormData(prev => ({ ...prev, scope_project: e.target.checked, scope_company: false, scope_branch: false }))} 
          />
        </div>
      </EntityEditModal.Section>

      <EntityEditModal.Section title="APPROVAL CONFIGURATION">
        <FormField label="Approval Mode">
          <Select 
            value={formData.approval_mode}
            onChange={v => setFormData(prev => ({ ...prev, approval_mode: v }))}
            options={[{value: 'Sequential', label: 'Sequential'}, {value: 'Parallel', label: 'Parallel'}]}
          />
        </FormField>
      </EntityEditModal.Section>

      <EntityEditModal.Section title="APPROVAL STEPS" className="border-t border-border pt-4 mt-2">
        <div className="flex flex-col gap-3">
          {formData.flow.map((step, index) => (
            <div key={step.id} className="flex flex-col">
              <div className="border border-border rounded-md bg-surface p-3 shadow-sm relative">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-text-muted bg-surface-muted px-1.5 py-0.5 rounded">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[12px] font-bold text-text-primary">Approval Level {index + 1}</span>
                  </div>
                  {formData.flow.length > 1 && (
                    <button 
                      onClick={() => handleRemoveStep(step.id)}
                      className="text-text-muted hover:text-error transition-colors p-1"
                      title="Remove Step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <FormField label="Approver Type">
                      <Select 
                        value="Role"
                        onChange={() => {}}
                        options={[{value: 'Role', label: 'Role'}, {value: 'User', label: 'Specific User'}]}
                        disabled
                      />
                    </FormField>
                  </div>
                  <div className="flex-1 w-full">
                    <FormField label="Role">
                      <Select 
                        value={step.role}
                        onChange={v => handleStepChange(step.id, 'role', v)}
                        options={ROLE_OPTIONS}
                      />
                    </FormField>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-border/50">
                  <Checkbox 
                    label="Required for approval" 
                    checked={step.required}
                    onChange={e => handleStepChange(step.id, 'required', e.target.checked)}
                  />
                </div>
              </div>

              {index < formData.flow.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowDown className="w-4 h-4 text-border-strong" />
                </div>
              )}
            </div>
          ))}

          <Button 
            variant="outline" 
            onClick={handleAddStep}
            className="mt-2 border-dashed gap-1 h-9"
          >
            <Plus className="w-4 h-4" />
            <span>Add Approval Step</span>
          </Button>
        </div>
      </EntityEditModal.Section>

    </EntityEditModal>
  );
}

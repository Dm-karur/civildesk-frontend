import { useState, useEffect } from 'react';
import { Building } from 'lucide-react';
import { clientsApi, clientStatusesApi, clientSourcesApi } from '../../../api/apiservice';
import { toast } from '../../../components/composite/Toast';
import { EntityEditModal } from '../../../components/composite/EntityEditModal';
import { FormField } from '../../../components/composite/FormField';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { EmailInput } from '../../../components/ui/fields/EmailInput';
import { PhoneInput } from '../../../components/ui/fields/PhoneInput';
import { IntegerInput } from '../../../components/ui/fields/IntegerInput';
import { DecimalInput } from '../../../components/ui/fields/DecimalInput';
import { UrlInput } from '../../../components/ui/fields/UrlInput';
import { Textarea } from '../../../components/ui/Textarea';
import { Checkbox } from '../../../components/ui/Checkbox';
import { validators } from '../../../utils/validation';

export function ClientFormModal({ client, isOpen, onClose, onSaveSuccess }) {
  const isEditing = Boolean(client?.id);
  const [saving, setSaving] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [sources, setSources] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    client_code: '',
    client_name: '',
    legal_name: '',
    client_type_id: '1',
    industry_type: 'Real Estate Development',
    gst_registration_type_id: '1',
    gstin: '',
    pan: '',
    tan: '',
    email: '',
    phone: '',
    website: '',
    billing_currency: 'INR',
    payment_terms_days: 30,
    credit_limit: 0,
    tax_deduction_applicable: 0,
    client_source_id: '1',
    client_status_id: '2', // Default: Active
    notes: '',
    company_id: '1',
    branch_id: ''
  });

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [statusRes, sourceRes] = await Promise.allSettled([
          clientStatusesApi.list(),
          clientSourcesApi.list()
        ]);

        if (statusRes.status === 'fulfilled') {
          const list = statusRes.value?.data || statusRes.value || [];
          if (Array.isArray(list) && list.length > 0) setStatuses(list);
          else {
            setStatuses([
              { id: 1, status_name: 'Prospect' },
              { id: 2, status_name: 'Active' },
              { id: 3, status_name: 'On Hold' },
              { id: 4, status_name: 'Inactive' }
            ]);
          }
        }

        if (sourceRes.status === 'fulfilled') {
          const list = sourceRes.value?.data || sourceRes.value || [];
          if (Array.isArray(list) && list.length > 0) setSources(list);
          else {
            setSources([
              { id: 1, source_name: 'Direct Reference' },
              { id: 2, source_name: 'Website Inquiry' },
              { id: 3, source_name: 'Exhibition / Tender' },
              { id: 4, source_name: 'Partner Channel' }
            ]);
          }
        }
      } catch (err) {
        console.error('Failed to load client masters:', err);
      }
    };
    if (isOpen) {
      fetchMasters();
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (client) {
      setFormData({
        client_code: client.client_code || client.code || '',
        client_name: client.client_name || client.name || '',
        legal_name: client.legal_name || '',
        client_type_id: client.client_type_id || '1',
        industry_type: client.industry_type || client.industry || 'Real Estate Development',
        gst_registration_type_id: client.gst_registration_type_id || '1',
        gstin: client.gstin || client.gst || '',
        pan: client.pan || '',
        tan: client.tan || '',
        email: client.email || '',
        phone: client.phone || client.contact || '',
        website: client.website || '',
        billing_currency: client.billing_currency || 'INR',
        payment_terms_days: client.payment_terms_days || 30,
        credit_limit: client.credit_limit || 0,
        tax_deduction_applicable: client.tax_deduction_applicable ? 1 : 0,
        client_source_id: client.client_source_id || '1',
        client_status_id: String(client.client_status_id || '2'),
        notes: client.notes || '',
        company_id: client.company_id || '1',
        branch_id: client.branch_id || ''
      });
    } else {
      setFormData({
        client_code: '',
        client_name: '',
        legal_name: '',
        client_type_id: '1',
        industry_type: 'Real Estate Development',
        gst_registration_type_id: '1',
        gstin: '',
        pan: '',
        tan: '',
        email: '',
        phone: '',
        website: '',
        billing_currency: 'INR',
        payment_terms_days: 30,
        credit_limit: 0,
        tax_deduction_applicable: 0,
        client_source_id: '1',
        client_status_id: '2', // Active
        notes: '',
        company_id: '1',
        branch_id: ''
      });
    }
  }, [client, isOpen]);

  const validateField = (name, value) => {
    let error = null;
    switch (name) {
      case 'client_code':
      case 'client_name':
        error = validators.required(value);
        break;
      case 'email':
        error = validators.email(value);
        break;
      case 'phone':
        error = validators.phone(value);
        break;
      case 'website':
        error = validators.url(value);
        break;
      case 'payment_terms_days':
        error = validators.integer(value, { min: 0 });
        break;
      case 'credit_limit':
        error = validators.decimal(value, { min: 0 });
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? (checked ? 1 : 0) : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    
    // Clear error on change, validate on blur
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    newErrors.client_code = validateField('client_code', formData.client_code);
    newErrors.client_name = validateField('client_name', formData.client_name);
    newErrors.email = validateField('email', formData.email);
    newErrors.phone = validateField('phone', formData.phone);
    newErrors.website = validateField('website', formData.website);
    newErrors.payment_terms_days = validateField('payment_terms_days', formData.payment_terms_days);
    newErrors.credit_limit = validateField('credit_limit', formData.credit_limit);

    const hasErrors = Object.values(newErrors).some(err => err !== null);
    return !hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the validation errors before saving.');
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await clientsApi.update(client.id, formData);
        toast.success('Client updated successfully');
      } else {
        await clientsApi.create(formData);
        toast.success('Client created successfully');
      }
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to save client:', err);
      toast.error(err?.message || 'Failed to save client. Please check fields.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <EntityEditModal isOpen={isOpen} onClose={onClose}>
      <EntityEditModal.Header 
        icon={Building}
        title={isEditing ? `Edit Client: ${client.client_name || client.name}` : 'Add New Client'}
        subtitle="Manage client details, billing, and contact information."
        onClose={onClose}
      />

      <form id="client-edit-form" onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col min-h-0">
        <EntityEditModal.Body>
          <EntityEditModal.Section title="General & Business Identifiers">
            <EntityEditModal.Grid>
              <FormField label="Client Code" required error={errors.client_code}>
                <Input 
                  name="client_code"
                  value={formData.client_code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. CLI-001"
                />
              </FormField>
              <FormField label="Client Name" required error={errors.client_name}>
                <Input 
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Greenfield Properties"
                />
              </FormField>
              <FormField label="Legal Name">
                <Input 
                  name="legal_name"
                  value={formData.legal_name}
                  onChange={handleChange}
                  placeholder="e.g. Greenfield Properties Pvt. Ltd."
                />
              </FormField>
              <FormField label="Industry Type">
                <Input 
                  name="industry_type"
                  value={formData.industry_type}
                  onChange={handleChange}
                  placeholder="e.g. Real Estate Development"
                />
              </FormField>
            </EntityEditModal.Grid>
          </EntityEditModal.Section>

          <EntityEditModal.Section title="Tax & Statutory Compliance">
            <EntityEditModal.Grid>
              <FormField label="GSTIN">
                <Input 
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  placeholder="27AABCU9603R1ZM"
                />
              </FormField>
              <FormField label="PAN Number">
                <Input 
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  placeholder="AABCU9603R"
                />
              </FormField>
              <FormField label="TAN Number">
                <Input 
                  name="tan"
                  value={formData.tan}
                  onChange={handleChange}
                  placeholder="MUMA12345B"
                />
              </FormField>
              <div className="flex items-center mt-7">
                <Checkbox 
                  id="tax_deduction_applicable"
                  name="tax_deduction_applicable"
                  checked={formData.tax_deduction_applicable === 1}
                  onChange={handleChange}
                  label="TDS Applicable"
                />
              </div>
            </EntityEditModal.Grid>
          </EntityEditModal.Section>

          <EntityEditModal.Section title="Financial & Billing Settings">
            <EntityEditModal.Grid>
              <FormField label="Billing Currency">
                <Select
                  options={[
                    { value: 'INR', label: 'INR (₹)' },
                    { value: 'USD', label: 'USD ($)' },
                    { value: 'AED', label: 'AED' },
                    { value: 'EUR', label: 'EUR (€)' }
                  ]}
                  value={formData.billing_currency}
                  onChange={(val) => handleSelectChange('billing_currency', val)}
                />
              </FormField>
              <FormField label="Payment Terms (Days)" error={errors.payment_terms_days}>
                <IntegerInput 
                  name="payment_terms_days"
                  value={formData.payment_terms_days}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormField>
              <FormField label="Credit Limit (₹)" error={errors.credit_limit}>
                <DecimalInput 
                  name="credit_limit"
                  value={formData.credit_limit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormField>
            </EntityEditModal.Grid>
          </EntityEditModal.Section>

          <EntityEditModal.Section title="Contact Information">
            <EntityEditModal.Grid>
              <FormField label="Email Address" error={errors.email}>
                <EmailInput 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormField>
              <FormField label="Phone Number" error={errors.phone}>
                <PhoneInput 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormField>
              <FormField label="Website" error={errors.website}>
                <UrlInput 
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormField>
            </EntityEditModal.Grid>
          </EntityEditModal.Section>

          <EntityEditModal.Section title="Status & Lead Sourcing">
            <EntityEditModal.Grid>
              <FormField label="Client Status" required>
                <Select
                  options={statuses.map(s => ({ value: String(s.id), label: s.status_name || s.name }))}
                  value={String(formData.client_status_id)}
                  onChange={(val) => handleSelectChange('client_status_id', val)}
                />
              </FormField>
              <FormField label="Client Source">
                <Select
                  options={sources.map(s => ({ value: String(s.id), label: s.source_name || s.name }))}
                  value={String(formData.client_source_id)}
                  onChange={(val) => handleSelectChange('client_source_id', val)}
                />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Notes / Instructions">
                  <Textarea 
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add any internal client notes..."
                  />
                </FormField>
              </div>
            </EntityEditModal.Grid>
          </EntityEditModal.Section>
        </EntityEditModal.Body>
      </form>

      <EntityEditModal.Footer 
        onCancel={onClose} 
        submitLabel={isEditing ? 'Update Client' : 'Create Client'}
        formId="client-edit-form" 
        isSubmitting={saving} 
      />
    </EntityEditModal>
  );
}

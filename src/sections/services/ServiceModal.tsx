'use client';

// material-ui
import Dialog from '@mui/material/Dialog';

// project-imports
import { insertService, updateService } from 'api/services';
import { openSnackbar } from 'api/snackbar';
import ServiceForm from './ServiceForm';
import { buildServicePayload, getServiceUiConfig, mapServiceToFormValues, ServiceFormValues } from './tenantConfig';
import { ServiceRecord, TenantType } from 'types/service';
import useLocales from 'utils/locales/useLocales';

interface Props {
  open: boolean;
  onClose: () => void;
  tenantType: TenantType;
  service?: ServiceRecord | null;
}

export default function ServiceModal({ open, onClose, tenantType, service }: Props) {
  const uiConfig = getServiceUiConfig(tenantType);
  const isEditing = Boolean(service);
  const initialValues = service ? mapServiceToFormValues(service) : undefined;
  const { t } = useLocales();

  const handleSubmit = async (values: ServiceFormValues) => {
    try {
      if (service) {
        await updateService(service.id, buildServicePayload(tenantType, values));
      } else {
        await insertService(buildServicePayload(tenantType, values));
      }
      openSnackbar({
        open: true,
        message: t(service ? 'servicesPage.messages.updateSuccess' : 'servicesPage.messages.createSuccess'),
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });
      onClose();
    } catch (error) {
      openSnackbar({
        open: true,
        message: t(service ? 'servicesPage.messages.updateError' : 'servicesPage.messages.createError'),
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <ServiceForm
        tenantType={tenantType}
        onCancel={onClose}
        onSubmit={handleSubmit}
        initialValues={initialValues}
        title={isEditing ? uiConfig.form.editTitleKey : uiConfig.form.titleKey}
        submitLabel={isEditing ? uiConfig.form.editSubmitLabelKey : uiConfig.form.submitLabelKey}
      />
    </Dialog>
  );
}


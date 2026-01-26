'use client';

// material-ui
import Dialog from '@mui/material/Dialog';

// project-imports
import { insertService } from 'api/services';
import { openSnackbar } from 'api/snackbar';
import ServiceForm from './ServiceForm';
import { buildServicePayload, ServiceFormValues } from './tenantConfig';
import { TenantType } from 'types/service';

interface Props {
  open: boolean;
  onClose: () => void;
  tenantType: TenantType;
}

export default function ServiceModal({ open, onClose, tenantType }: Props) {
  const handleSubmit = async (values: ServiceFormValues) => {
    try {
      await insertService(buildServicePayload(tenantType, values));
      openSnackbar({
        open: true,
        message: 'Service added successfully.',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });
      onClose();
    } catch (error) {
      openSnackbar({
        open: true,
        message: 'Failed to add service.',
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <ServiceForm tenantType={tenantType} onCancel={onClose} onSubmit={handleSubmit} />
    </Dialog>
  );
}


'use client';

// material-ui
import Dialog from '@mui/material/Dialog';

// project-imports
import ServiceForm from './ServiceForm';
import { TenantType } from './tenantConfig';

interface Props {
  open: boolean;
  onClose: () => void;
  tenantType: TenantType;
}

export default function ServiceModal({ open, onClose, tenantType }: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <ServiceForm tenantType={tenantType} onCancel={onClose} />
    </Dialog>
  );
}


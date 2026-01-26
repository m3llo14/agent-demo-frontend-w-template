'use client';

import { useEffect, useMemo, useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

// project-imports
import { getServiceUiConfig, ServiceFieldConfig, ServiceFormValues } from './tenantConfig';
import { TenantType } from 'types/service';
import useLocales from 'utils/locales/useLocales';

interface Props {
  tenantType: TenantType;
  onCancel: () => void;
  onSubmit?: (values: ServiceFormValues) => void;
  initialValues?: ServiceFormValues;
  title?: string;
  submitLabel?: string;
}

const buildInitialValues = (fields: ServiceFieldConfig[]): ServiceFormValues =>
  fields.reduce<ServiceFormValues>((acc, field) => {
    acc[field.key] = '';
    return acc;
  }, {});

export default function ServiceForm({ tenantType, onCancel, onSubmit, initialValues: initialValuesProp, title, submitLabel }: Props) {
  const config = useMemo(() => getServiceUiConfig(tenantType), [tenantType]);
  const { form } = config;
  const { t } = useLocales();

  const initialValues = useMemo(
    () => (initialValuesProp ? { ...buildInitialValues(form.fields), ...initialValuesProp } : buildInitialValues(form.fields)),
    [form.fields, initialValuesProp]
  );
  const [values, setValues] = useState<ServiceFormValues>(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit?.(values);
  };

  const renderField = (field: ServiceFieldConfig) => {
    const label = t(field.labelKey);
    const placeholder = t(field.placeholderKey ?? field.labelKey);
    const startAdornment = field.adornment?.start ? (
      <InputAdornment position="start">{t(field.adornment.start)}</InputAdornment>
    ) : undefined;
    const endAdornment = field.adornment?.end ? <InputAdornment position="end">{t(field.adornment.end)}</InputAdornment> : undefined;

    const inputProps = startAdornment || endAdornment ? { startAdornment, endAdornment } : undefined;
    const gridSize = field.grid ?? { xs: 12, md: 6 };
    const fieldId = `service-${field.key}`;

    return (
      <Grid key={field.key} size={gridSize}>
        <Stack sx={{ gap: 1 }}>
          <InputLabel htmlFor={fieldId}>{label}</InputLabel>
          <TextField
            id={fieldId}
            name={field.key}
            placeholder={placeholder}
            type={field.type}
            value={values[field.key] ?? ''}
            onChange={handleChange(field.key)}
            multiline={field.multiline}
            rows={field.rows}
            fullWidth
            InputProps={inputProps}
            InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
          />
        </Stack>
      </Grid>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>{t(title || form.titleKey)}</DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 2.5 }}>
        <Grid container spacing={2}>
          {form.fields.map(renderField)}
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5 }}>
        <Button color="secondary" onClick={onCancel}>
          {t(form.cancelLabelKey)}
        </Button>
        <Button type="submit" variant="contained">
          {t(submitLabel || form.submitLabelKey)}
        </Button>
      </DialogActions>
    </form>
  );
}

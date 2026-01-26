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
import { getServiceUiConfig, ServiceFieldConfig, TenantType } from './tenantConfig';

type FormValues = Record<string, string>;

interface Props {
  tenantType: TenantType;
  onCancel: () => void;
  onSubmit?: (values: FormValues) => void;
}

const buildInitialValues = (fields: ServiceFieldConfig[]): FormValues =>
  fields.reduce<FormValues>((acc, field) => {
    acc[field.key] = '';
    return acc;
  }, {});

export default function ServiceForm({ tenantType, onCancel, onSubmit }: Props) {
  const config = useMemo(() => getServiceUiConfig(tenantType), [tenantType]);
  const { form } = config;

  const initialValues = useMemo(() => buildInitialValues(form.fields), [form.fields]);
  const [values, setValues] = useState<FormValues>(initialValues);

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
    const startAdornment = field.adornment?.start ? (
      <InputAdornment position="start">{field.adornment.start}</InputAdornment>
    ) : undefined;
    const endAdornment = field.adornment?.end ? (
      <InputAdornment position="end">{field.adornment.end}</InputAdornment>
    ) : undefined;

    const inputProps = startAdornment || endAdornment ? { startAdornment, endAdornment } : undefined;
    const gridSize = field.grid ?? { xs: 12, md: 6 };
    const fieldId = `service-${field.key}`;

    return (
      <Grid key={field.key} size={gridSize}>
        <Stack sx={{ gap: 1 }}>
          <InputLabel htmlFor={fieldId}>{field.label}</InputLabel>
          <TextField
            id={fieldId}
            name={field.key}
            placeholder={field.placeholder}
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
      <DialogTitle>{form.title}</DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 2.5 }}>
        <Grid container spacing={2}>
          {form.fields.map(renderField)}
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5 }}>
        <Button color="secondary" onClick={onCancel}>
          {form.cancelLabel}
        </Button>
        <Button type="submit" variant="contained">
          {form.submitLabel}
        </Button>
      </DialogActions>
    </form>
  );
}


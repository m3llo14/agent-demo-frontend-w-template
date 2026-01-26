export type TenantType = 'hotel' | 'tourism';

type AdornmentConfig = {
  start?: string;
  end?: string;
};

export type ServiceFieldConfig = {
  key: string;
  label: string;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  grid?: { xs: number; md?: number };
  adornment?: AdornmentConfig;
};

export type ServiceFormConfig = {
  title: string;
  submitLabel: string;
  cancelLabel: string;
  fields: ServiceFieldConfig[];
};

export type ServiceUiConfig = {
  listTitle: string;
  addButtonLabel: string;
  form: ServiceFormConfig;
};

const field = (key: string, label: string, overrides: Partial<ServiceFieldConfig> = {}): ServiceFieldConfig => ({
  key,
  label,
  placeholder: label,
  grid: { xs: 12, md: 6 },
  ...overrides
});

const moneyField = (key: string, label: string, suffix: string) =>
  field(key, label, { type: 'number', adornment: { start: '₺', end: suffix } });

const numberField = (key: string, label: string, suffix?: string) =>
  field(key, label, { type: 'number', adornment: suffix ? { end: suffix } : undefined });

const dateField = (key: string, label: string) => field(key, label, { type: 'date' });

const multilineField = (key: string, label: string, rows = 3) =>
  field(key, label, { multiline: true, rows, grid: { xs: 12 } });

export const resolveTenantType = (sessionTenant?: unknown, override?: string | null): TenantType => {
  if (override === 'hotel' || override === 'tourism') return override;
  if (sessionTenant === 'hotel' || sessionTenant === 'tourism') return sessionTenant;
  return 'hotel';
};

export const getServiceUiConfig = (tenantType: TenantType): ServiceUiConfig => {
  if (tenantType === 'tourism') {
    return {
      listTitle: 'Trips',
      addButtonLabel: 'Add Trip',
      form: {
        title: 'Add Trip',
        submitLabel: 'Save',
        cancelLabel: 'Cancel',
        fields: [
          field('name', 'Trip Name'),
          moneyField('adultPrice', 'Adult Price', 'per person'),
          moneyField('childPrice', 'Child Price', 'per person'),
          field('duration', 'Duration', { adornment: { end: 'days' } }),
          numberField('capacity', 'Group Capacity', 'pax'),
          field('specialistId', 'Guide ID'),
          dateField('startDate', 'Start Date'),
          dateField('endDate', 'End Date'),
          multilineField('description', 'Highlights')
        ]
      }
    };
  }

  return {
    listTitle: 'Rooms',
    addButtonLabel: 'Add Room',
    form: {
      title: 'Add Room',
      submitLabel: 'Save',
      cancelLabel: 'Cancel',
      fields: [
        field('name', 'Room Name'),
        moneyField('price', 'Room Price', 'per night'),
        numberField('capacity', 'Capacity', 'pax'),
        numberField('stock', 'Stock', 'rooms'),
        numberField('maxAdults', 'Max Adults'),
        numberField('maxChildren', 'Max Children'),
        multilineField('description', 'Description')
      ]
    }
  };
};


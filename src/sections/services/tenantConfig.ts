import { PricingTier, ServiceCreateInput, ServiceRecord, TenantType } from 'types/service';

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

export type ServiceFormValues = Record<string, string>;

export type ServiceFormConfig = {
  title: string;
  submitLabel: string;
  cancelLabel: string;
  fields: ServiceFieldConfig[];
};

export type ServiceColumnConfig = {
  id: string;
  header: string;
  align?: 'left' | 'right' | 'center';
  value: (row: ServiceRecord) => string | number;
};

export type ServiceTableConfig = {
  columns: ServiceColumnConfig[];
};

export type ServiceUiConfig = {
  listTitle: string;
  addButtonLabel: string;
  form: ServiceFormConfig;
  table: ServiceTableConfig;
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

const formatPricingTiers = (tiers: PricingTier[]) => {
  if (!tiers?.length) return '—';
  const active = tiers.filter((tier) => tier.isActive);
  const list = (active.length ? active : tiers).map((tier) => `${tier.name}: ${tier.price}`);
  return list.join(', ');
};

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
      },
      table: {
        columns: [
          { id: 'name', header: 'Name', value: (row) => row.name },
          {
            id: 'pricing',
            header: 'Pricing',
            value: (row) => (row.tenantType === 'tourism' ? formatPricingTiers(row.pricingTiers) : '—')
          },
          {
            id: 'duration',
            header: 'Duration',
            align: 'right',
            value: (row) => (row.tenantType === 'tourism' ? row.duration : '—')
          },
          {
            id: 'capacity',
            header: 'Capacity',
            align: 'right',
            value: (row) => row.capacity
          },
          {
            id: 'specialist',
            header: 'Target Specialist',
            align: 'right',
            value: (row) => (row.tenantType === 'tourism' ? row.targetSpecialistId : '—')
          },
          {
            id: 'startDate',
            header: 'Start Date',
            align: 'right',
            value: (row) => (row.tenantType === 'tourism' ? row.startDate : '—')
          },
          {
            id: 'endDate',
            header: 'End Date',
            align: 'right',
            value: (row) => (row.tenantType === 'tourism' ? row.endDate : '—')
          }
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
    },
    table: {
      columns: [
        { id: 'name', header: 'Name', value: (row) => row.name },
        {
          id: 'price',
          header: 'Price',
          align: 'right',
          value: (row) => (row.tenantType === 'hotel' ? row.price : '—')
        },
        {
          id: 'capacity',
          header: 'Capacity',
          align: 'right',
          value: (row) => row.capacity
        },
        {
          id: 'description',
          header: 'Description',
          align: 'right',
          value: (row) => (row.tenantType === 'hotel' ? row.description : '—')
        },
        {
          id: 'stock',
          header: 'Stock',
          align: 'right',
          value: (row) => (row.tenantType === 'hotel' ? row.stock : '—')
        },
        {
          id: 'maxAdults',
          header: 'Max Adults',
          align: 'right',
          value: (row) => (row.tenantType === 'hotel' ? row.maxAdults : '—')
        },
        {
          id: 'maxChildren',
          header: 'Max Children',
          align: 'right',
          value: (row) => (row.tenantType === 'hotel' ? row.maxChildren : '—')
        }
      ]
    }
  };
};

const toNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const buildServicePayload = (tenantType: TenantType, values: ServiceFormValues): ServiceCreateInput => {
  if (tenantType === 'tourism') {
    const pricingTiers = [
      values.adultPrice
        ? { name: 'Yetişkin', price: toNumber(values.adultPrice), isActive: true }
        : null,
      values.childPrice
        ? { name: 'Çocuk', price: toNumber(values.childPrice), isActive: true }
        : null
    ].filter(Boolean) as PricingTier[];

    return {
      tenantType: 'tourism',
      name: values.name || '',
      pricingTiers,
      duration: values.duration || '',
      capacity: toNumber(values.capacity),
      targetSpecialistId: values.specialistId || '',
      startDate: values.startDate || '',
      endDate: values.endDate || ''
    };
  }

  return {
    tenantType: 'hotel',
    name: values.name || '',
    price: toNumber(values.price),
    capacity: toNumber(values.capacity),
    description: values.description || '',
    stock: toNumber(values.stock),
    maxAdults: toNumber(values.maxAdults),
    maxChildren: toNumber(values.maxChildren)
  };
};


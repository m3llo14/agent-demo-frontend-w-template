import { PricingTier, ServiceCreateInput, ServiceRecord, TenantType, TourismService } from 'types/service';

type AdornmentConfig = {
  start?: string;
  end?: string;
};

export type ServiceFieldConfig = {
  key: string;
  labelKey: string;
  placeholderKey?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  grid?: { xs: number; md?: number };
  adornment?: AdornmentConfig;
};

export type ServiceFormValues = Record<string, string>;

export type ServiceFormConfig = {
  titleKey: string;
  editTitleKey: string;
  submitLabelKey: string;
  editSubmitLabelKey: string;
  cancelLabelKey: string;
  fields: ServiceFieldConfig[];
};

export type ServiceColumnConfig = {
  id: string;
  headerKey: string;
  align?: 'left' | 'right' | 'center';
  value: (row: ServiceRecord) => string | number;
};

export type ServiceTableConfig = {
  columns: ServiceColumnConfig[];
};

export type ServiceUiConfig = {
  listTitleKey: string;
  addButtonLabelKey: string;
  form: ServiceFormConfig;
  table: ServiceTableConfig;
};

const field = (key: string, labelKey: string, overrides: Partial<ServiceFieldConfig> = {}): ServiceFieldConfig => ({
  key,
  labelKey,
  placeholderKey: labelKey,
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
      listTitleKey: 'servicesPage.list.trips',
      addButtonLabelKey: 'servicesPage.add.trip',
      form: {
        titleKey: 'servicesPage.form.addTripTitle',
        editTitleKey: 'servicesPage.form.editTripTitle',
        submitLabelKey: 'common.save',
        editSubmitLabelKey: 'common.update',
        cancelLabelKey: 'common.cancel',
        fields: [
          field('name', 'servicesPage.fields.tripName'),
          moneyField('adultPrice', 'servicesPage.fields.adultPrice', 'servicesPage.adornments.perPerson'),
          moneyField('childPrice', 'servicesPage.fields.childPrice', 'servicesPage.adornments.perPerson'),
          field('duration', 'servicesPage.fields.duration', { adornment: { end: 'servicesPage.adornments.days' } }),
          numberField('capacity', 'servicesPage.fields.groupCapacity', 'servicesPage.adornments.pax'),
          field('specialistId', 'servicesPage.fields.guideId'),
          dateField('startDate', 'servicesPage.fields.startDate'),
          dateField('endDate', 'servicesPage.fields.endDate'),
          multilineField('description', 'servicesPage.fields.highlights')
        ]
      },
      table: {
        columns: [
          { id: 'name', headerKey: 'servicesPage.table.name', value: (row) => row.name },
          {
            id: 'pricing',
            headerKey: 'servicesPage.table.pricing',
            value: (row) => (row.tenantType === 'tourism' ? formatPricingTiers(row.pricingTiers) : '—')
          },
          {
            id: 'duration',
            headerKey: 'servicesPage.table.duration',
            align: 'right',
            value: (row) => (row.tenantType === 'tourism' ? row.duration : '—')
          },
          {
            id: 'capacity',
            headerKey: 'servicesPage.table.capacity',
            align: 'right',
            value: (row) => row.capacity
          },
          {
            id: 'specialist',
            headerKey: 'servicesPage.table.targetSpecialist',
            align: 'right',
            value: (row) => (row.tenantType === 'tourism' ? row.targetSpecialistId : '—')
          },
          {
            id: 'startDate',
            headerKey: 'servicesPage.table.startDate',
            align: 'right',
            value: (row) => (row.tenantType === 'tourism' ? row.startDate : '—')
          },
          {
            id: 'endDate',
            headerKey: 'servicesPage.table.endDate',
            align: 'right',
            value: (row) => (row.tenantType === 'tourism' ? row.endDate : '—')
          }
        ]
      }
    };
  }

  return {
    listTitleKey: 'servicesPage.list.rooms',
    addButtonLabelKey: 'servicesPage.add.room',
    form: {
      titleKey: 'servicesPage.form.addRoomTitle',
      editTitleKey: 'servicesPage.form.editRoomTitle',
      submitLabelKey: 'common.save',
      editSubmitLabelKey: 'common.update',
      cancelLabelKey: 'common.cancel',
      fields: [
        field('name', 'servicesPage.fields.roomName'),
        moneyField('price', 'servicesPage.fields.roomPrice', 'servicesPage.adornments.perNight'),
        numberField('capacity', 'servicesPage.fields.capacity', 'servicesPage.adornments.pax'),
        numberField('stock', 'servicesPage.fields.stock', 'servicesPage.adornments.rooms'),
        numberField('maxAdults', 'servicesPage.fields.maxAdults'),
        numberField('maxChildren', 'servicesPage.fields.maxChildren'),
        multilineField('description', 'servicesPage.fields.description')
      ]
    },
    table: {
      columns: [
        { id: 'name', headerKey: 'servicesPage.table.name', value: (row) => row.name },
        {
          id: 'price',
          headerKey: 'servicesPage.table.price',
          align: 'right',
          value: (row) => (row.tenantType === 'hotel' ? row.price : '—')
        },
        {
          id: 'capacity',
          headerKey: 'servicesPage.table.capacity',
          align: 'right',
          value: (row) => row.capacity
        },
        {
          id: 'description',
          headerKey: 'servicesPage.table.description',
          align: 'right',
          value: (row) => (row.tenantType === 'hotel' ? row.description : '—')
        },
        {
          id: 'stock',
          headerKey: 'servicesPage.table.stock',
          align: 'right',
          value: (row) => (row.tenantType === 'hotel' ? row.stock : '—')
        },
        {
          id: 'maxAdults',
          headerKey: 'servicesPage.table.maxAdults',
          align: 'right',
          value: (row) => (row.tenantType === 'hotel' ? row.maxAdults : '—')
        },
        {
          id: 'maxChildren',
          headerKey: 'servicesPage.table.maxChildren',
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
      endDate: values.endDate || '',
      description: values.description || ''
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

export const mapServiceToFormValues = (service: ServiceRecord): ServiceFormValues => {
  if (service.tenantType === 'tourism') {
    const tourismService = service as TourismService;
    const adult = tourismService.pricingTiers?.find((tier) => tier.name === 'Yetişkin');
    const child = tourismService.pricingTiers?.find((tier) => tier.name === 'Çocuk');
    return {
      name: tourismService.name,
      adultPrice: adult ? String(adult.price) : '',
      childPrice: child ? String(child.price) : '',
      duration: tourismService.duration,
      capacity: String(tourismService.capacity ?? ''),
      specialistId: tourismService.targetSpecialistId,
      startDate: tourismService.startDate,
      endDate: tourismService.endDate,
      description: tourismService.description || ''
    };
  }

  return {
    name: service.name,
    price: service.tenantType === 'hotel' ? String(service.price) : '',
    capacity: String(service.capacity ?? ''),
    description: service.tenantType === 'hotel' ? service.description : '',
    stock: service.tenantType === 'hotel' ? String(service.stock) : '',
    maxAdults: service.tenantType === 'hotel' ? String(service.maxAdults) : '',
    maxChildren: service.tenantType === 'hotel' ? String(service.maxChildren) : ''
  };
};


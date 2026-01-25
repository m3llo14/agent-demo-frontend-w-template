import { TenantType } from 'types/auth';

export const tenantConfig: Record<
  TenantType,
  {
    labels: {
      customer: string;
      appointment: string;
    };
  }
> = {
  hotel: {
    labels: {
      customer: 'Misafir',
      appointment: 'Rezervasyon'
    }
  },
  tourism: {
    labels: {
      customer: 'Müşteri',
      appointment: 'Tur'
    }
  },
  barber: {
    labels: {
      customer: 'Müşteri',
      appointment: 'Randevu'
    }
  },
  clinic: {
    labels: {
      customer: 'Hasta',
      appointment: 'Randevu'
    }
  }
};

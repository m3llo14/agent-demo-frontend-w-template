export type TenantType = 'hotel' | 'tourism';

export type PricingTier = {
  name: string;
  price: number;
  isActive: boolean;
};

export type HotelService = {
  id: string;
  tenantType: 'hotel';
  name: string;
  price: number;
  capacity: number;
  description: string;
  stock: number;
  maxAdults: number;
  maxChildren: number;
};

export type TourismService = {
  id: string;
  tenantType: 'tourism';
  name: string;
  pricingTiers: PricingTier[];
  duration: string;
  capacity: number;
  targetSpecialistId: string;
  startDate: string;
  endDate: string;
  description?: string;
};

export type ServiceRecord = HotelService | TourismService;

export type ServiceCreateInput = Omit<HotelService, 'id'> | Omit<TourismService, 'id'>;

export type ServiceListResponse = {
  services: ServiceRecord[];
};


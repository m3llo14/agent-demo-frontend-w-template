import { HotelService, ServiceRecord, TenantType, TourismService } from 'types/service';

export const hotelServices: HotelService[] = [
  {
    id: 'hotel-1',
    tenantType: 'hotel',
    name: 'Deluxe Sea View',
    price: 5200,
    capacity: 2,
    description: 'Sea view, balcony, breakfast included',
    stock: 8,
    maxAdults: 2,
    maxChildren: 1
  },
  {
    id: 'hotel-2',
    tenantType: 'hotel',
    name: 'Family Suite',
    price: 7800,
    capacity: 4,
    description: 'Two rooms, kitchenette, city view',
    stock: 5,
    maxAdults: 3,
    maxChildren: 2
  },
  {
    id: 'hotel-3',
    tenantType: 'hotel',
    name: 'Standard Room',
    price: 3200,
    capacity: 2,
    description: 'Garden view, queen bed',
    stock: 12,
    maxAdults: 2,
    maxChildren: 1
  }
];

export const tourismServices: TourismService[] = [
  {
    id: 'tour-1',
    tenantType: 'tourism',
    name: 'Cappadocia Sunrise Tour',
    pricingTiers: [
      { name: 'Yetişkin', price: 4500, isActive: true },
      { name: 'Çocuk', price: 2800, isActive: true }
    ],
    duration: '2 days',
    capacity: 24,
    targetSpecialistId: 'guide-102',
    startDate: '2025-06-12',
    endDate: '2025-06-13',
    description: 'Sunrise balloon tour with breakfast.'
  },
  {
    id: 'tour-2',
    tenantType: 'tourism',
    name: 'Pamukkale Day Trip',
    pricingTiers: [{ name: 'Yetişkin', price: 3500, isActive: true }],
    duration: '1 day',
    capacity: 40,
    targetSpecialistId: 'guide-205',
    startDate: '2025-07-05',
    endDate: '2025-07-05',
    description: 'Thermal pools and white terraces visit.'
  },
  {
    id: 'tour-3',
    tenantType: 'tourism',
    name: 'Ephesus Heritage Route',
    pricingTiers: [
      { name: 'Yetişkin', price: 3900, isActive: true },
      { name: 'Öğrenci', price: 3200, isActive: true }
    ],
    duration: '1 day',
    capacity: 30,
    targetSpecialistId: 'guide-318',
    startDate: '2025-08-18',
    endDate: '2025-08-18',
    description: 'Ancient city tour with local guide.'
  }
];

export const getCollection = (tenantType: TenantType): ServiceRecord[] =>
  tenantType === 'tourism' ? tourismServices : hotelServices;


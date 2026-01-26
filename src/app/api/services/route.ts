import { NextRequest, NextResponse } from 'next/server';

import { HotelService, ServiceCreateInput, ServiceRecord, TenantType, TourismService } from 'types/service';

const hotelServices: HotelService[] = [
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

const tourismServices: TourismService[] = [
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
    endDate: '2025-06-13'
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
    endDate: '2025-07-05'
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
    endDate: '2025-08-18'
  }
];

const getCollection = (tenantType: TenantType): ServiceRecord[] =>
  tenantType === 'tourism' ? tourismServices : hotelServices;

const getNextId = (tenantType: TenantType, collection: ServiceRecord[]) => {
  const prefix = tenantType === 'tourism' ? 'tour' : 'hotel';
  const maxNumeric = collection.reduce((max, service) => {
    const [, num] = service.id.split('-');
    const value = Number(num);
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 0);
  return `${prefix}-${maxNumeric + 1}`;
};

export async function GET(request: NextRequest) {
  const tenantType = request.nextUrl.searchParams.get('tenantType') === 'tourism' ? 'tourism' : 'hotel';
  const services = getCollection(tenantType);
  return NextResponse.json({ services });
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as ServiceCreateInput;
    const tenantType = payload?.tenantType === 'tourism' ? 'tourism' : 'hotel';
    const collection = getCollection(tenantType);
    const id = getNextId(tenantType, collection);

    const createdService: ServiceRecord = { ...payload, tenantType, id } as ServiceRecord;
    collection.push(createdService);

    return NextResponse.json({ service: createdService }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}


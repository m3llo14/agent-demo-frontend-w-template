import { NextRequest, NextResponse } from 'next/server';

import { ServiceCreateInput, ServiceRecord, TenantType } from 'types/service';

import { getCollection } from './store';

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
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
